/* Plan text, scale, and single-page open. Runs in the takeoff viewer and
   on page.html. Text comes from the PDF text layer, after a per-font
   code-point fix. OCR runs only when that text is still unreadable, and
   only on the title block. A saved index for the same file revision is
   reused, so a later open does not read the file again. */
(function () {
  var API = window.HWSPlanIndex;
  if (!API) return;

  var params = new URLSearchParams(location.search);
  var PAGE = document.body.classList.contains("hws-page");
  var state = {
    index: null,
    bytes: null,
    doc: null,
    current: 1,
    ready: false,
    fromCache: false,
    fileId: "",
    revision: "",
    ocrRuns: 0,
  };

  function note(text) {
    var el = document.getElementById("hws-note") || document.getElementById("hws-status");
    if (el && text) el.textContent = text;
  }

  function loadScript(url) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = url;
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error("Could not load " + url)); };
      document.head.appendChild(s);
    });
  }

  var pdfjsPromise = null;
  function loadPdfJs() {
    if (window.pdfjsLib && window.pdfjsLib.getDocument) return Promise.resolve(window.pdfjsLib);
    if (!pdfjsPromise) {
      var url = new URL("../preview/vendor/pdf.min.mjs", location.href).href;
      pdfjsPromise = import(url).then(function (mod) {
        var lib = mod;
        if (lib.GlobalWorkerOptions) {
          lib.GlobalWorkerOptions.workerSrc = new URL("../preview/vendor/pdf.worker.min.mjs", location.href).href;
        }
        window.pdfjsLib = lib;
        return lib;
      });
    }
    return pdfjsPromise;
  }

  function fileId() {
    return params.get("rel") || params.get("name") || params.get("src") || params.get("pdf") || "plan";
  }

  function revisionOf(buf) {
    var view = buf instanceof ArrayBuffer ? new Uint8Array(buf) : new Uint8Array(buf.buffer || buf);
    var bytes = new Uint8Array(view.length);
    bytes.set(view);
    if (window.crypto && crypto.subtle && crypto.subtle.digest) {
      return crypto.subtle.digest("SHA-256", bytes).then(function (dig) {
        return Array.from(new Uint8Array(dig)).slice(0, 8).map(function (b) {
          return b.toString(16).padStart(2, "0");
        }).join("");
      }).catch(function () { return fallbackRev(bytes); });
    }
    return Promise.resolve(fallbackRev(bytes));
  }

  function fallbackRev(bytes) {
    var h = 2166136261;
    for (var i = 0; i < bytes.length; i += 64) {
      h ^= bytes[i];
      h = Math.imul(h, 16777619);
    }
    h ^= bytes.length;
    return (h >>> 0).toString(16);
  }

  function idb() {
    return new Promise(function (resolve, reject) {
      if (!window.indexedDB) { reject(new Error("no idb")); return; }
      var req = indexedDB.open("hws-planindex", 1);
      req.onupgradeneeded = function () {
        if (!req.result.objectStoreNames.contains("index")) req.result.createObjectStore("index");
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
  }

  function idbGet(key) {
    return idb().then(function (db) {
      return new Promise(function (resolve) {
        var tx = db.transaction("index", "readonly");
        var req = tx.objectStore("index").get(key);
        req.onsuccess = function () { resolve(req.result || null); };
        req.onerror = function () { resolve(null); };
      });
    }).catch(function () { return null; });
  }

  function idbPut(key, value) {
    return idb().then(function (db) {
      return new Promise(function (resolve) {
        var tx = db.transaction("index", "readwrite");
        tx.objectStore("index").put(value, key);
        tx.oncomplete = function () { resolve(); };
        tx.onerror = function () { resolve(); };
      });
    }).catch(function () {});
  }

  function lsGet(key) {
    try { return JSON.parse(localStorage.getItem("hws-planindex:" + key) || "null"); } catch (e) { return null; }
  }

  function lsPut(key, value) {
    try { localStorage.setItem("hws-planindex:" + key, JSON.stringify(value)); } catch (e) {}
  }

  function rememberRuns() {
    window.HWS_EXTRACT_RUNS = (window.HWS_EXTRACT_RUNS || 0) + 1;
    try {
      var n = Number(sessionStorage.getItem("hws-extract-runs") || "0") + 1;
      sessionStorage.setItem("hws-extract-runs", String(n));
    } catch (e) {}
  }

  function itemsFromContent(page, content) {
    return API.itemsFromContent(page, content);
  }

  var ocrWorker = null;
  function ocrUrl(name) {
    return new URL("vendor/ocr/" + name, location.href).href;
  }

  function ensureOcr() {
    if (ocrWorker) return Promise.resolve(ocrWorker);
    var boot = window.Tesseract ? Promise.resolve() : loadScript(ocrUrl("tesseract.min.js"));
    return boot.then(function () {
      return window.Tesseract.createWorker("eng", 1, {
        workerPath: ocrUrl("worker.min.js"),
        corePath: ocrUrl("tesseract-core-lstm.js"),
        langPath: new URL("vendor/ocr/", location.href).href,
        gzip: true,
        workerBlobURL: false,
      });
    }).then(function (worker) {
      ocrWorker = worker;
      return worker;
    });
  }

  function ocrPage(pdfPage, region) {
    state.ocrRuns += 1;
    var scale = 2;
    var vp = pdfPage.getViewport({ scale: scale });
    var canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.ceil(vp.width));
    canvas.height = Math.max(1, Math.ceil(vp.height));
    var ctx = canvas.getContext("2d", { willReadFrequently: true });
    return pdfPage.render({ canvasContext: ctx, viewport: vp }).promise.then(function () {
      var src = canvas;
      var ox = 0;
      var oy = 0;
      if (region) {
        var wide = vp.width >= vp.height;
        var sx = Math.floor(vp.width * (wide ? 0.52 : 0.66));
        var sy = Math.floor(wide ? vp.height * 0.42 : 0);
        var sw = Math.max(1, Math.ceil(vp.width - sx));
        var sh = Math.max(1, Math.ceil(vp.height - sy));
        var crop = document.createElement("canvas");
        crop.width = sw;
        crop.height = sh;
        crop.getContext("2d", { willReadFrequently: true }).drawImage(canvas, sx, sy, sw, sh, 0, 0, sw, sh);
        src = crop;
        ox = sx / scale;
        oy = sy / scale;
      }
      return ensureOcr().then(function (worker) {
        return worker.recognize(src);
      }).then(function (res) {
        var data = (res && res.data) || {};
        var words = data.words || [];
        var items = [];
        words.forEach(function (word) {
          var text = word && (word.text || word.str) || "";
          if (!String(text).trim()) return;
          var b = word.bbox || {};
          var x0 = b.x0 != null ? b.x0 : 0;
          var y0 = b.y0 != null ? b.y0 : 0;
          var x1 = b.x1 != null ? b.x1 : x0;
          var y1 = b.y1 != null ? b.y1 : y0;
          items.push({
            str: String(text),
            x: ox + x0 / scale,
            y: oy + y0 / scale,
            w: Math.max(1, (x1 - x0) / scale),
            h: Math.max(1, (y1 - y0) / scale),
          });
        });
        if (!items.length && data.text) {
          return { items: [], text: String(data.text), source: "ocr", width: vp.width / scale, height: vp.height / scale };
        }
        return { items: items, text: "", source: "ocr", width: vp.width / scale, height: vp.height / scale };
      });
    });
  }

  function pageFrom(n, got, items, text, source) {
    return API.buildPage({
      page: n,
      items: items,
      text: text || "",
      source: source,
      width: got.width,
      height: got.height,
      userUnit: got.userUnit,
      rotate: got.rotate,
    });
  }

  function readPage(doc, n, allowOcr) {
    return doc.getPage(n).then(function (pdfPage) {
      return pdfPage.getTextContent().then(function (content) {
        var got = itemsFromContent(pdfPage, content);
        var verdict = API.correctItems(got.items);
        if (verdict.reliable) return pageFrom(n, got, got.items, "", "text");
        if (!allowOcr) return pageFrom(n, got, got.items, "", "text");
        note("Reading title block on page " + n + "…");
        return ocrPage(pdfPage, true).then(function (ocr) {
          return pageFrom(n, { width: ocr.width || got.width, height: ocr.height || got.height, userUnit: got.userUnit, rotate: got.rotate }, ocr.items, ocr.text, "ocr");
        });
      });
    });
  }

  function openDoc(spec) {
    return loadPdfJs().then(function (lib) {
      var task;
      if (spec.data) task = lib.getDocument({ data: spec.data });
      else {
        task = lib.getDocument({
          url: spec.url,
          disableAutoFetch: true,
          disableStream: true,
          rangeChunkSize: 65536,
        });
      }
      return task.promise;
    });
  }

  function publish(index) {
    state.index = index;
    window.__hwsPlanIndex = index;
    var bar = document.getElementById("hws-planbar");
    if (bar) {
      bar.dataset.ready = index && index.complete ? "1" : "0";
      bar.dataset.fromCache = state.fromCache ? "1" : "0";
      bar.dataset.revision = state.revision || "";
    }
    paintScale();
    paintSheets();
    pushSheetLabels();
    pushCalibrations();
    var page = index && index.pages && index.pages.filter(function (p) { return p.page === state.current; })[0];
    if (page) showPageLabel(page);
  }

  function showPageLabel(page) {
    var title = document.getElementById("hws-title");
    if (!title || !PAGE) return;
    var bits = [showText(page.sheet) || ("Page " + page.page), showText(page.title)].filter(Boolean);
    title.textContent = bits.join(" · ") || (params.get("name") || "Plan");
  }

  function persist() {
    var index = state.index;
    if (!index || !state.revision) return Promise.resolve();
    var key = API.cacheKey(state.fileId || fileId(), state.revision);
    lsPut(key, index);
    try {
      localStorage.setItem("hws-plan-takeoff:" + key, JSON.stringify(API.takeoffDoc(index, index.file || "")));
    } catch (e) {}
    return idbPut(key, index);
  }

  function loadSaved(revision) {
    var key = API.cacheKey(fileId(), revision);
    return idbGet(key).then(function (row) {
      if (API.indexCurrent(row, revision)) return row;
      var ls = lsGet(key);
      if (API.indexCurrent(ls, revision)) return ls;
      return null;
    });
  }

  function shouldSkipStoredCal(prev, confirmed) {
    if (!prev) return false;
    if (confirmed) return false;
    return prev.source === "measured" || prev.source === "declared";
  }

  function pushSheetLabels() {
    var viewer = window.HWSPlanViewer;
    var index = state.index;
    if (!viewer || !viewer.store || typeof viewer.store.setSheet !== "function" || !index) return;
    (index.pages || []).forEach(function (p) {
      var number = showText(p.sheet);
      var title = showText(p.title);
      if (!number && !title) return;
      viewer.store.setSheet({
        sheetId: number || String(p.page),
        page: p.page,
        number: number,
        title: title,
      });
    });
  }

  function pushCalibrations() {
    var index = state.index;
    if (!index) return;
    var room = window.HWSPlanRoom;
    var storage = room && room.storage;
    if (storage) storage.planIndex = index;
    var viewer = window.HWSPlanViewer;
    (index.pages || []).forEach(function (p) {
      var sc = p.scale;
      if (!sc || sc.nts || !(sc.unitsPerPoint > 0)) return;
      var cal = {
        unitsPerPoint: sc.unitsPerPoint,
        unit: "ft",
        label: sc.label,
        source: (sc.confirmed || sc.source === "declared") ? "declared" : "imported",
        page: p.page,
      };
      if (storage && storage.cals) {
        if (!shouldSkipStoredCal(storage.cals.get(p.page), sc.confirmed)) storage.cals.set(p.page, cal);
      }
      if (viewer && viewer.store && typeof viewer.store.setCalibration === "function") {
        try {
          var prev = viewer.store.calibration && viewer.store.calibration(p.page);
          if (!shouldSkipStoredCal(prev, sc.confirmed)) viewer.store.setCalibration(cal, p.page);
        } catch (e) {}
      }
    });
  }

  function hookSnapshot() {
    var room = window.HWSPlanRoom;
    var storage = room && room.storage;
    if (!storage || storage.__hwsIndexHook || typeof storage.snapshot !== "function") return;
    storage.__hwsIndexHook = 1;
    var orig = storage.snapshot.bind(storage);
    storage.snapshot = function () {
      if (window.__hwsPlanIndex) storage.planIndex = window.__hwsPlanIndex;
      var doc = orig();
      if (doc && doc.planroom && window.__hwsPlanIndex) doc.planroom.index = window.__hwsPlanIndex;
      return doc;
    };
  }

  function buildIndex(doc, pages, revision, complete, ms) {
    return {
      schema: API.SCHEMA,
      revision: revision,
      file: params.get("name") || "plan.pdf",
      fileId: fileId(),
      complete: !!complete,
      ms: ms || 0,
      pages: pages,
    };
  }

  function extractDoc(doc, pageList, revision, complete) {
    rememberRuns();
    var started = Date.now();
    var pages = [];
    var chain = Promise.resolve();
    pageList.forEach(function (n) {
      chain = chain.then(function () {
        note("Reading page " + n + "…");
        return readPage(doc, n, true).then(function (row) { pages.push(row); });
      });
    });
    return chain.then(function () {
      pages.sort(function (a, b) { return a.page - b.page; });
      var index = buildIndex(doc, pages, revision, complete, Date.now() - started);
      state.fromCache = false;
      publish(index);
      return persist().then(function () {
        if (ocrWorker) {
          var w = ocrWorker;
          ocrWorker = null;
          return w.terminate().catch(function () {});
        }
      }).then(function () { return index; });
    });
  }

  function useSaved(saved) {
    state.fromCache = true;
    publish(saved);
    note(saved.complete ? "Saved index" : "Saved page");
    return saved;
  }

  function finishReady() {
    state.ready = true;
    window.HWSPlanView.ready = true;
    var bar = document.getElementById("hws-planbar");
    if (bar) bar.dataset.ready = "1";
    note("");
  }

  function paintCanvas(n) {
    if (!PAGE || !state.doc) return Promise.resolve();
    state.current = n;
    return state.doc.getPage(n).then(function (pdfPage) {
      var base = pdfPage.getViewport({ scale: 1 });
      var stage = document.getElementById("hws-stage");
      var width = (stage && stage.clientWidth) || 390;
      var scale = width / base.width;
      var vp = pdfPage.getViewport({ scale: scale });
      var canvas = document.getElementById("hws-canvas");
      var ctx = canvas.getContext("2d", { alpha: false });
      canvas.width = Math.max(1, Math.ceil(vp.width));
      canvas.height = Math.max(1, Math.ceil(vp.height));
      return pdfPage.render({ canvasContext: ctx, viewport: vp }).promise;
    }).then(function () {
      paintScale();
      var page = pageRec(n);
      if (page) showPageLabel(page);
    });
  }

  function pageRec(n) {
    var pages = (state.index && state.index.pages) || [];
    for (var i = 0; i < pages.length; i++) if (pages[i].page === n) return pages[i];
    return null;
  }

  function paintScale() {
    var chip = document.getElementById("hws-scalechip");
    if (!chip) return;
    var page = pageRec(state.current);
    var label = chip.querySelector("[data-scale-label]");
    if (!page || !page.scale) {
      if (label) label.textContent = page ? "No scale found" : "Scale";
      return;
    }
    var extra = page.scales && page.scales.length > 1 ? (" · " + page.scales.length + " on this sheet") : "";
    var mark = page.scale.confirmed ? " · saved" : "";
    if (label) label.textContent = page.scale.label + extra + mark;
    chip.hidden = false;
  }

  function clearMarks() {
    var layer = document.getElementById("hws-marks");
    if (layer) layer.innerHTML = "";
  }

  function highlight(pageNo, box) {
    state.current = pageNo;
    var go = PAGE ? paintCanvas(pageNo) : Promise.resolve().then(function () {
      var viewer = window.HWSPlanViewer;
      if (viewer && typeof viewer.goToPage === "function") viewer.goToPage(pageNo);
    });
    return go.then(function () {
      clearMarks();
      paintScale();
      if (!box) return;
      var page = pageRec(pageNo);
      if (!page || !(page.width > 0) || !(page.height > 0)) return;
      var layer = document.getElementById("hws-marks");
      if (!layer) return;
      var mark = document.createElement("div");
      mark.className = "hws-hit";
      mark.style.left = (100 * box.x / page.width) + "%";
      mark.style.top = (100 * box.y / page.height) + "%";
      mark.style.width = Math.max(1, 100 * box.w / page.width) + "%";
      mark.style.height = Math.max(1, 100 * box.h / page.height) + "%";
      layer.appendChild(mark);
    });
  }

  function runSearch(q) {
    var hits = API.search(state.index, q);
    var box = document.getElementById("hws-hits");
    if (!box) return hits;
    box.innerHTML = "";
    box.hidden = !hits.length;
    hits.forEach(function (hit) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "hws-hitrow";
      btn.textContent = (showText(hit.sheet) || ("Page " + hit.page)) + " · " + showText(hit.snippet);
      btn.onclick = function () { highlight(hit.page, hit.box); };
      box.appendChild(btn);
    });
    if (hits[0]) highlight(hits[0].page, hits[0].box);
    else note("No match");
    return hits;
  }

  function setScale(pageNo, scale, confirmed) {
    var page = pageRec(pageNo);
    if (!page || !scale) return;
    page.scale = {
      label: scale.label,
      kind: scale.kind,
      nts: !!scale.nts,
      unitsPerPoint: scale.unitsPerPoint || 0,
      paperInches: scale.paperInches || 0,
      realFeet: scale.realFeet || 0,
      ratio: scale.ratio || 0,
      explicit: !!scale.explicit,
      confirmed: !!confirmed,
      source: confirmed ? "declared" : (scale.nts ? "noted" : "detected"),
    };
    publish(state.index);
    persist();
  }

  function confirmScale() {
    var page = pageRec(state.current);
    if (!page || !page.scale) return;
    page.scale.confirmed = true;
    page.scale.source = "declared";
    publish(state.index);
    persist();
  }

  function applyCustom() {
    var input = document.querySelector("[data-scale-custom]");
    var text = input ? input.value : "";
    var found = API.parseScales(text);
    if (!found.length) { note("That scale was not recognized"); return; }
    setScale(state.current, found[0], true);
    var pick = document.getElementById("hws-scalepick");
    if (pick) pick.hidden = true;
  }

  function openChange() {
    var pick = document.getElementById("hws-scalepick");
    var list = document.querySelector("[data-scale-list]");
    if (!pick || !list) return;
    list.innerHTML = "";
    var page = pageRec(state.current);
    ((page && page.scales) || []).forEach(function (scale) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = scale.label;
      btn.onclick = function () {
        setScale(state.current, scale, true);
        pick.hidden = true;
      };
      list.appendChild(btn);
    });
    pick.hidden = false;
  }

  function pageOnlyHref(n) {
    var u = new URL("page.html", location.href);
    if (params.get("src")) u.searchParams.set("src", params.get("src"));
    else if (params.get("pdf")) u.searchParams.set("pdf", params.get("pdf"));
    u.searchParams.set("page", String(n));
    if (params.get("name")) u.searchParams.set("name", params.get("name"));
    if (params.get("job")) u.searchParams.set("job", params.get("job"));
    if (params.get("plans")) u.searchParams.set("plans", params.get("plans"));
    return u.href;
  }

  function paintSheets() {
    var host = document.getElementById("hws-sheetlist");
    if (!host || !state.index) return;
    host.innerHTML = "";
    (state.index.pages || []).forEach(function (page) {
      var row = document.createElement("div");
      row.className = "hws-sheetrow";
      var label = (showText(page.sheet) || ("Page " + page.page)) + (showText(page.title) ? (" · " + showText(page.title)) : "");
      var scale = page.scale ? showText(page.scale.label) : "No scale";
      row.innerHTML = '<label><input type="checkbox" data-xpage="' + page.page + '"> ' + escapeHtml(label) + '</label>'
        + '<div class="hws-sheetmeta"><div>' + escapeHtml(scale) + '</div>'
        + '<a class="hws-openone" href="' + escapeHtml(pageOnlyHref(page.page)) + '">Open this page only</a></div>'
        + '<canvas data-thumb="' + page.page + '" width="72" height="48"></canvas>';
      host.appendChild(row);
    });
    thumbAll();
  }

  function showText(v) {
    var s = String(v == null ? "" : v);
    if (API.stripControls) s = API.stripControls(s);
    else s = s.replace(/[\u0000-\u001F\u007F]/g, " ");
    return s.replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "");
  }

  function escapeHtml(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function thumbAll() {
    if (!state.doc) return;
    var nodes = document.querySelectorAll("[data-thumb]");
    var chain = Promise.resolve();
    Array.prototype.forEach.call(nodes, function (canvas) {
      chain = chain.then(function () { return thumb(canvas); });
    });
  }

  function thumb(canvas) {
    var n = Number(canvas.getAttribute("data-thumb"));
    return state.doc.getPage(n).then(function (pdfPage) {
      var base = pdfPage.getViewport({ scale: 1 });
      var scale = 72 / base.width;
      var vp = pdfPage.getViewport({ scale: scale });
      canvas.width = Math.max(1, Math.ceil(vp.width));
      canvas.height = Math.max(1, Math.ceil(vp.height));
      return pdfPage.render({ canvasContext: canvas.getContext("2d"), viewport: vp }).promise;
    }).catch(function () {});
  }

  function selectedPages() {
    return Array.prototype.map.call(document.querySelectorAll("#hws-sheetlist [data-xpage]:checked"), function (el) {
      return Number(el.getAttribute("data-xpage"));
    });
  }

  function savePages() {
    var pages = selectedPages();
    if (!pages.length) { note("Pick at least one page."); return Promise.resolve(); }
    var saveBtn = document.getElementById("hws-save-page");
    if (saveBtn) saveBtn.disabled = true;
    return ensureBytes().then(function (bytes) {
      var titles = [];
      var meta = {};
      (state.index.pages || []).forEach(function (p) {
        titles[p.page - 1] = showText(p.title) || showText(p.sheet) || "";
        meta[p.page] = { sheet: p.sheet || "", scale: p.scale || null };
      });
      return window.HWSExtract.save({
        slug: params.get("job") || "",
        bytes: bytes,
        pages: pages,
        titles: titles,
        meta: meta,
        sourceName: params.get("name") || "plan.pdf",
        sourceRel: params.get("rel") || "",
        sourcePath: params.get("pdf") || "",
        plans: params.get("plans") || "",
        navigate: "stay",
      });
    }).then(function (saved) {
      note(saved && saved.length ? "Saved page for takeoff" : "Saved");
    }).catch(function (e) {
      note(e && e.message ? e.message : String(e));
    }).then(function () {
      if (saveBtn) saveBtn.disabled = false;
    });
  }

  function ensureBytes() {
    if (state.bytes) return Promise.resolve(state.bytes);
    if (window.__hwsPdfBytes) {
      state.bytes = window.__hwsPdfBytes;
      return Promise.resolve(state.bytes);
    }
    var src = params.get("src");
    if (src) {
      return fetch(src).then(function (r) { return r.arrayBuffer(); }).then(function (buf) {
        state.bytes = buf;
        window.__hwsPdfBytes = buf;
        return buf;
      });
    }
    if (params.get("pdf") && window.HWSExtract && window.HWSExtract.download) {
      return window.HWSExtract.download(params.get("pdf")).then(function (bytes) {
        state.bytes = bytes.buffer ? bytes.buffer : bytes;
        return state.bytes;
      });
    }
    return Promise.reject(new Error("This PDF is not loaded yet."));
  }

  function mount() {
    if (document.getElementById("hws-planbar")) return;
    var bar = document.createElement("div");
    bar.id = "hws-planbar";
    bar.innerHTML = ''
      + '<form id="hws-find" action="#">'
      + '<input id="hws-findq" type="search" enterkeyhint="search" placeholder="Find on plans" aria-label="Find text on plans">'
      + '<button type="submit">Find</button>'
      + '<button type="button" id="hws-pages">Pages</button>'
      + '</form>'
      + '<div id="hws-hits" hidden></div>'
      + '<div id="hws-scalechip"><span data-scale-label>Scale</span>'
      + '<button type="button" data-scale-confirm>Confirm</button>'
      + '<button type="button" data-scale-change>Change</button></div>'
      + '<div id="hws-scalepick" hidden><div data-scale-list></div>'
      + '<input data-scale-custom aria-label="Type a scale" placeholder="1/4 in = 1 ft">'
      + '<button type="button" data-scale-apply>Save scale</button></div>';
    var panel = document.createElement("div");
    panel.id = "hws-sheets-panel";
    panel.hidden = true;
    panel.innerHTML = '<h3>Save page for takeoff</h3><div id="hws-sheetlist"></div>'
      + '<div class="hws-hitrow"><button type="button" id="hws-save-page">Save page for takeoff</button>'
      + '<button type="button" id="hws-sheets-close">Close</button></div>';
    var anchor = document.getElementById("hws-bar");
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(bar, anchor.nextSibling);
    else document.body.insertBefore(bar, document.body.firstChild);
    document.body.appendChild(panel);
    bar.querySelector("#hws-find").onsubmit = function (ev) {
      ev.preventDefault();
      runSearch(document.getElementById("hws-findq").value);
    };
    bar.querySelector("[data-scale-confirm]").onclick = confirmScale;
    bar.querySelector("[data-scale-change]").onclick = openChange;
    bar.querySelector("[data-scale-apply]").onclick = applyCustom;
    document.getElementById("hws-pages").onclick = function () {
      panel.hidden = !panel.hidden;
    };
    document.getElementById("hws-sheets-close").onclick = function () { panel.hidden = true; };
    document.getElementById("hws-save-page").onclick = function () { savePages(); };
  }

  function afterIndex(index) {
    var first = (index.pages && index.pages[0] && index.pages[0].page) || 1;
    var wanted = Number(params.get("page")) || first;
    if (!pageRec(wanted)) wanted = first;
    state.current = wanted;
    var painted = PAGE ? paintCanvas(wanted) : Promise.resolve();
    return painted.then(function () {
      finishReady();
      return index;
    });
  }

  function bootWithBytes(buf, onlyPage) {
    state.bytes = buf.slice(0);
    window.__hwsPdfBytes = state.bytes.slice(0);
    state.fileId = fileId();
    return revisionOf(state.bytes).then(function (rev) {
      state.revision = rev;
      var copy = state.bytes.slice(0);
      if (!onlyPage) {
        return loadSaved(rev).then(function (saved) {
          return openDoc({ data: copy }).then(function (doc) {
            state.doc = doc;
            if (saved) return useSaved(saved);
            var list = [];
            for (var n = 1; n <= doc.numPages; n++) list.push(n);
            return extractDoc(doc, list, rev, true);
          });
        });
      }
      return openDoc({ data: copy }).then(function (doc) {
        state.doc = doc;
        var n = Math.min(Math.max(1, onlyPage), doc.numPages);
        return extractDoc(doc, [n], rev, false);
      });
    }).then(afterIndex).catch(function (e) {
      note(e && e.message ? e.message : String(e));
    });
  }

  function bootRange(url, onlyPage) {
    state.fileId = fileId();
    return fetch(url, { method: "HEAD" }).catch(function () { return null; }).then(function () {
      return openDoc({ url: url });
    }).then(function (doc) {
      state.doc = doc;
      var n = Math.min(Math.max(1, onlyPage || 1), doc.numPages);
      state.current = n;
      return readPage(doc, n, true).then(function (row) {
        rememberRuns();
        var index = buildIndex(doc, [row], "page-" + n, false, 0);
        state.fromCache = false;
        publish(index);
        return paintCanvas(n);
      });
    }).then(function () {
      finishReady();
    }).catch(function (e) {
      note(e && e.message ? e.message : String(e));
    });
  }

  function bootPage() {
    mount();
    var src = params.get("src");
    var only = params.get("all") === "1" ? 0 : (Number(params.get("page")) || 0);
    if (src && only) return bootRange(src, only);
    if (src) {
      return fetch(src).then(function (r) {
        if (!r.ok) throw new Error("Could not open that PDF.");
        return r.arrayBuffer();
      }).then(function (buf) { return bootWithBytes(buf, 0); });
    }
    if (params.get("pdf") && window.HWSExtract && window.HWSExtract.download) {
      return window.HWSExtract.download(params.get("pdf")).then(function (bytes) {
        var buf = bytes.buffer && bytes.buffer.byteLength ? bytes.buffer : bytes;
        return bootWithBytes(buf, only);
      });
    }
    note("This page has no PDF.");
  }

  function bootViewer() {
    mount();
    hookSnapshot();
    var timer = setInterval(hookSnapshot, 300);
    setTimeout(function () { clearInterval(timer); }, 8000);
    var skip = (params.get("sample") === "1" || params.get("orient") === "1" || params.get("permit") === "1")
      && params.get("index") !== "1";
    if (skip) return;
    function start(buf) {
      if (!buf || state.index) return;
      bootWithBytes(buf, 0);
    }
    if (window.__hwsPdfBytes) start(window.__hwsPdfBytes);
    window.addEventListener("hws-pdf-bytes", function () { start(window.__hwsPdfBytes); });
  }

  window.HWSPlanView = {
    ready: false,
    get index() { return state.index; },
    get page() { return state.current; },
    get fromCache() { return state.fromCache; },
    get ocrRuns() { return state.ocrRuns; },
    feetBetween: function (pageNo, p1, p2, space) {
      var page = pageRec(pageNo);
      if (!page || !page.scale) return 0;
      var k = page.scale.unitsPerPoint || 0;
      if (space === "user") return API.measureUser(p1, p2, k, page.userUnit);
      return API.measure(p1, p2, k);
    },
    search: runSearch,
    confirm: confirmScale,
    show: function (n) { return highlight(n, null); },
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { PAGE ? bootPage() : bootViewer(); });
  } else {
    PAGE ? bootPage() : bootViewer();
  }
})();
