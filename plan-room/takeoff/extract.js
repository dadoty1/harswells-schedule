/* Extract one page of a plan PDF into its own file for a takeoff.
   Runs in the hub preview and on the Plan Room page. pdf-lib copies the
   page, including rotation and user-unit scale. Nothing here is measured. */
const XKEY = "hws-sheet-extracts";

function xToast(msg) {
  if (typeof toast === "function") { toast(msg); return; }
  const s = document.getElementById("hws-status");
  if (s) s.textContent = msg;
}
function xVendor(name) {
  const path = String(location.pathname || "");
  const prefix = /\/plan-room\/takeoff\//.test(path) ? "../../" : "";
  return new URL(prefix + "vendor/" + name, location.href).href;
}
function xLoadScript(url) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = url;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Could not load a library for this PDF."));
    document.head.appendChild(s);
  });
}
async function xLib() {
  if (window.PDFLib) return window.PDFLib;
  await xLoadScript(xVendor("pdf-lib.min.js"));
  if (!window.PDFLib) throw new Error("Could not load a library for this PDF.");
  return window.PDFLib;
}
function xAuth() {
  if (window.HWSSync && HWSSync.LS) return HWSSync.LS.get("hws-dbx-auth");
  try { return JSON.parse(localStorage.getItem("hws-dbx-auth") || "null"); } catch (e) { return null; }
}
function xHeaders(auth, extra) {
  const headers = Object.assign({ Authorization: "Bearer " + auth.access_token }, extra || {});
  if (auth.root_ns) headers["Dropbox-API-Path-Root"] = JSON.stringify({ ".tag": "root", root: auth.root_ns });
  return headers;
}
async function xEnsureAuth() {
  const auth = xAuth();
  if (!auth || !auth.access_token) throw new Error("Sign in with Dropbox to save this sheet.");
  if (auth.root_ns) return auth;
  try {
    const r = await fetch("https://api.dropboxapi.com/2/users/get_current_account", {
      method: "POST", credentials: "omit",
      headers: { Authorization: "Bearer " + auth.access_token, "Content-Type": "application/json" },
      body: "null",
    });
    if (r.ok) {
      const a = await r.json();
      auth.root_ns = a.root_info && a.root_info.root_namespace_id;
      if (window.HWSSync && HWSSync.LS) HWSSync.LS.set("hws-dbx-auth", auth);
      else localStorage.setItem("hws-dbx-auth", JSON.stringify(auth));
    }
  } catch (e) {}
  return xAuth() || auth;
}
async function xUpload(path, bytes) {
  const auth = await xEnsureAuth();
  const r = await fetch("https://content.dropboxapi.com/2/files/upload", {
    method: "POST", credentials: "omit",
    headers: xHeaders(auth, {
      "Content-Type": "application/octet-stream",
      "Dropbox-API-Arg": JSON.stringify({ path: path, mode: { ".tag": "overwrite" }, autorename: false, mute: true }),
    }),
    body: bytes,
  });
  if (!r.ok) throw new Error("Could not save the sheet.");
}
async function xDownload(path) {
  const auth = await xEnsureAuth();
  const r = await fetch("https://content.dropboxapi.com/2/files/download", {
    method: "POST", credentials: "omit",
    headers: xHeaders(auth, { "Dropbox-API-Arg": JSON.stringify({ path: path }) }),
  });
  if (!r.ok) throw new Error("Could not download that PDF.");
  return new Uint8Array(await r.arrayBuffer());
}
function xSetName(name) {
  if (typeof prSetName === "function") return prSetName(name);
  let s = String(name || "").replace(/\.pdf$/i, "");
  s = s.replace(/\b(?:rev(?:ision)?|ver(?:sion)?)\s*[.#]?\s*\d+[a-z]?\b/gi, " ");
  s = s.replace(/\bv\d+[a-z]?\b/gi, " ");
  s = s.replace(/\b20\d{2}[-./]\d{1,2}[-./]\d{1,2}\b/g, " ");
  s = s.replace(/\b(?:final|issued|current|latest|updated|copy|draft)\b/gi, " ");
  s = s.replace(/[\s_]+/g, " ").replace(/^\s+|\s+$/g, "").replace(/[-\s]+$/g, "");
  return s || "Sheet";
}
function xCleanLabel(title, page) {
  const raw = String(title == null ? "" : title);
  if (window.HWSPlanIndex && HWSPlanIndex.sanitizeTitle) {
    const cleaned = HWSPlanIndex.sanitizeTitle(raw, page || 1);
    if (!raw.trim()) return "";
    return cleaned;
  }
  return raw.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/[^\u0020-\u007E]/g, " ").replace(/\s+/g, " ").trim();
}
function xDecodeContent(items) {
  const raw = (items || []).map((it) => ({
    str: String((it && it.str) || ""),
    font: (it && (it.fontName || it.font)) || "",
    x: 0, y: 0, w: 0, h: 0,
  })).filter((it) => {
    const s = it.str.replace(/[\u0000-\u0008\u000E-\u001F]/g, "");
    return !!s.trim() || s.length > 0;
  });
  if (window.HWSPlanIndex && HWSPlanIndex.correctItems) return HWSPlanIndex.correctItems(raw).items || [];
  return raw.map((it) => ({ str: it.str.replace(/[\u0000-\u001F\u007F]/g, " ") }));
}
function xSheetName(fileName, page, title) {
  const set = xSetName(fileName);
  if (window.HWSPlanIndex && HWSPlanIndex.sheetFileName) return HWSPlanIndex.sheetFileName(set, page, title);
  if (typeof prSheetFileName === "function") return prSheetFileName(set, page, title);
  const t = title ? String(title).replace(/[\u0000-\u001F\u007F]/g, " ").replace(/[^\u0020-\u007E]/g, " ").replace(/[\\/:*?"<>|]+/g, " ").replace(/\s+/g, " ").trim() : "";
  return t ? (set + " - p" + page + " - " + t + ".pdf") : (set + " - p" + page + ".pdf");
}
function xList(slug) {
  let all = {};
  try { all = JSON.parse(localStorage.getItem(XKEY) || "{}") || {}; } catch (e) { all = {}; }
  return (all[slug] || []).slice();
}
function xRemember(slug, rec) {
  let all = {};
  try { all = JSON.parse(localStorage.getItem(XKEY) || "{}") || {}; } catch (e) { all = {}; }
  const list = (all[slug] || []).filter((row) => row && row.rel !== rec.rel);
  list.unshift(rec);
  all[slug] = list.slice(0, 40);
  localStorage.setItem(XKEY, JSON.stringify(all));
  if (typeof prUI !== "undefined" && prUI && prUI.slug === slug && typeof prPrepare === "function") {
    const next = (prUI.entries || []).filter((e) => e && e.rel !== rec.rel);
    next.push({
      tag: "file", name: rec.name, label: rec.name, rel: rec.rel, path: rec.path,
      modified: rec.modified, pages: 1, size: rec.size || 0,
    });
    prUI.entries = prPrepare(next);
  }
}
async function xExtractPages(bytes, pages) {
  const lib = await xLib();
  const src = await lib.PDFDocument.load(bytes, { ignoreEncryption: true });
  const out = [];
  for (let i = 0; i < pages.length; i++) {
    const n = pages[i];
    const doc = await lib.PDFDocument.create();
    const copied = await doc.copyPages(src, [n - 1]);
    doc.addPage(copied[0]);
    out.push({ page: n, doc: doc, count: src.getPageCount() });
  }
  return out;
}
function xPlans(slug) {
  const entries = (typeof prUI !== "undefined" && prUI && prUI.slug === slug && prUI.entries && prUI.entries.length)
    ? prUI.entries
    : (typeof fileOfficeEntries === "function" ? fileOfficeEntries(slug) : []);
  if (typeof prPlansPath === "function") return prPlansPath(slug, entries);
  if (typeof filePlansPath === "function") return filePlansPath(slug);
  return "";
}
function xDest(slug, plans, fileName) {
  const full = String(plans || "").replace(/\/$/, "") + "/_takeoffs/sheets/" + fileName;
  const root = (typeof projectsRoot === "function" ? projectsRoot() : "").replace(/\/$/, "");
  const folder = typeof jobFolder === "function" ? String(jobFolder(slug) || "").replace(/^\/+|\/+$/g, "") : "";
  const base = root && folder ? root + "/" + folder + "/" : "";
  const rel = base && full.indexOf(base) === 0 ? full.slice(base.length) : ("_takeoffs/sheets/" + fileName);
  return { full: full, rel: rel, planRel: "_takeoffs/sheets/" + fileName };
}
function xAskFrame(view) {
  const frame = view && view.querySelector && view.querySelector("iframe[data-fpdf]");
  if (!frame || !frame.contentWindow) return Promise.resolve([]);
  return new Promise((resolve) => {
    const timer = setTimeout(() => { window.removeEventListener("message", on); resolve([]); }, 5000);
    function on(ev) {
      if (!ev.data || ev.data.type !== "hws-pdf-titles") return;
      if (ev.origin && location.origin && ev.origin !== location.origin) return;
      clearTimeout(timer);
      window.removeEventListener("message", on);
      resolve(ev.data.titles || []);
    }
    window.addEventListener("message", on);
    frame.contentWindow.postMessage({ type: "hws-pdf-titles" }, location.origin);
  });
}
async function xPdf(bytes) {
  if (!window.pdfjsLib) await xLoadScript(xVendor("pdf.min.js"));
  const lib = window.pdfjsLib;
  if (!lib || !lib.getDocument) return null;
  if (lib.GlobalWorkerOptions && !lib.GlobalWorkerOptions.workerSrc) {
    lib.GlobalWorkerOptions.workerSrc = xVendor("pdf.worker.min.js");
  }
  const data = bytes.slice ? bytes.slice(0) : bytes;
  return lib.getDocument({ data: data }).promise;
}
async function xIndexPages(bytes) {
  if (!window.HWSPlanIndex || !HWSPlanIndex.buildPage || !HWSPlanIndex.itemsFromContent) return [];
  const doc = await xPdf(bytes);
  if (!doc) return [];
  const out = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const got = HWSPlanIndex.itemsFromContent(page, content);
    out.push(HWSPlanIndex.buildPage({
      page: i,
      items: got.items,
      text: "",
      source: "text",
      width: got.width,
      height: got.height,
      userUnit: got.userUnit,
      rotate: got.rotate,
    }));
  }
  return out;
}
function xMetaFromPages(pages) {
  const titles = [];
  const meta = {};
  (pages || []).forEach((p) => {
    if (!p) return;
    titles[p.page - 1] = xCleanLabel(p.title || "", p.page);
    meta[p.page] = {
      sheet: p.sheet || "",
      scale: p.scale || null,
      rotation: Number(p.rotate) || 0,
    };
  });
  return { titles: titles, meta: meta };
}
async function xTitlesFromBytes(bytes) {
  const indexed = await xIndexPages(bytes);
  if (indexed.length) return xMetaFromPages(indexed).titles;
  const doc = await xPdf(bytes);
  if (!doc) return [];
  const out = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const content = await doc.getPage(i).then((page) => page.getTextContent());
    const items = xDecodeContent(content.items);
    let best = "";
    items.forEach((it) => {
      const s = String(it.str || "").replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim();
      if (s.length < 4 || s.length > 60 || !/[A-Za-z]/.test(s)) return;
      if (s.length > best.length) best = s;
    });
    out.push(xCleanLabel(best, i));
  }
  return out;
}
async function xDescribe(bytes, view) {
  if (window.HWSPlanIndex && bytes) {
    try {
      const indexed = await xIndexPages(bytes);
      if (indexed.length) return xMetaFromPages(indexed);
    } catch (e) {}
  }
  const titles = await xTitles(bytes, view);
  return { titles: titles, meta: {} };
}
async function xTitles(bytes, view) {
  if (window.HWSPlanIndex && bytes) {
    try {
      const decoded = await xTitlesFromBytes(bytes);
      if (decoded.some((t) => t)) return decoded;
    } catch (e) {}
  }
  const fromFrame = await xAskFrame(view);
  if (fromFrame && fromFrame.length) return fromFrame.map((t, i) => xCleanLabel(t, i + 1));
  try { return await xTitlesFromBytes(bytes); } catch (e) { return []; }
}
function xPanel(host, pages, titles, meta) {
  const old = host.querySelector("[data-xpanel]");
  if (old) old.remove();
  const box = document.createElement("div");
  box.className = host.classList && host.classList.contains("fview") ? "fextract" : "hws-xpanel";
  box.setAttribute("data-xpanel", "1");
  const rows = [];
  for (let n = 1; n <= pages; n++) {
    const title = (titles && titles[n - 1]) || "";
    const row = meta && meta[n];
    const sheet = row && row.sheet ? String(row.sheet).replace(/[\u0000-\u001F\u007F]/g, "").trim() : "";
    const bits = ["Page " + n];
    if (sheet) bits.push(sheet);
    if (title) bits.push(title);
    rows.push('<label><input type="checkbox" data-xpage="' + n + '"> ' + bits.map(xEsc).join(" · ") + "</label>");
  }
  box.innerHTML = '<h3>Extract page for takeoff</h3><p>Each selected page is saved as its own PDF.</p>' + rows.join("")
    + '<div class="xactions"><button type="button" data-xcancel>Cancel</button><button type="button" data-xsave>Save page for takeoff</button></div>';
  if (host.classList && host.classList.contains("fview")) {
    const facts = host.querySelector(".facts");
    if (facts) facts.parentNode.insertBefore(box, facts);
    else host.appendChild(box);
  } else {
    document.body.appendChild(box);
  }
  box.querySelector("[data-xcancel]").onclick = () => box.remove();
  return box;
}
function xEsc(v) {
  return String(v == null ? "" : v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function xFacts(page) {
  let rotation = 0;
  let user_unit = 1;
  try { rotation = page.getRotation().angle || 0; } catch (e) {}
  try {
    const lib = window.PDFLib;
    const raw = page.node && page.node.get && lib && lib.PDFName && page.node.get(lib.PDFName.of("UserUnit"));
    if (raw && typeof raw.asNumber === "function") user_unit = raw.asNumber();
  } catch (e) {}
  return { rotation: rotation, user_unit: user_unit };
}
async function xSave(opts) {
  const pages = opts.pages || [];
  if (!pages.length) { xToast("Pick at least one page."); return; }
  const bytes = opts.bytes;
  const made = await xExtractPages(bytes instanceof ArrayBuffer ? new Uint8Array(bytes) : bytes, pages);
  const titles = opts.titles || [];
  const saved = [];
  for (let i = 0; i < made.length; i++) {
    const item = made[i];
    const title = xCleanLabel(titles[item.page - 1] || "", item.page);
    const meta = (opts.meta && opts.meta[item.page]) || {};
    const facts = xFacts(item.doc.getPage(0));
    const name = xSheetName(opts.sourceName, item.page, title);
    item.doc.setTitle(name.replace(/\.pdf$/i, ""));
    item.doc.setSubject("source " + (opts.sourcePath || opts.sourceRel || "") + " page " + item.page);
    const raw = await item.doc.save();
    const dest = xDest(opts.slug, opts.plans, name);
    await xUpload(dest.full, raw);
    const rotation = meta.rotation != null && meta.rotation !== "" ? meta.rotation : facts.rotation;
    const sidecar = {
      schema: "harswells.sheet_extract.v1",
      source_path: opts.sourcePath || "",
      source_rel: opts.sourceRel || "",
      source_name: opts.sourceName || "",
      page: item.page,
      title: title,
      sheet: name,
      sheet_id: meta.sheet || "",
      scale: meta.scale || null,
      rotation: rotation,
      user_unit: facts.user_unit,
    };
    await xUpload(dest.full.replace(/\.pdf$/i, ".source.json"), new TextEncoder().encode(JSON.stringify(sidecar)));
    const rec = {
      tag: "file", name: name, label: name, rel: dest.rel, path: dest.full, planRel: dest.planRel,
      modified: new Date().toISOString(), pages: 1, size: raw.byteLength || raw.length || 0,
      source_name: opts.sourceName || "", source_rel: opts.sourceRel || "", source_path: opts.sourcePath || "",
      page: item.page, title: title,
      sheet_id: meta.sheet || "",
      scale_label: (meta.scale && meta.scale.label) || "",
      rotation: rotation,
      user_unit: facts.user_unit,
    };
    xRemember(opts.slug, rec);
    saved.push(rec);
  }
  const first = saved[0];
  if (!first) return;
  if (opts.navigate === "stay") {
    xToast(saved.length === 1 ? "Saved 1 page for takeoff." : ("Saved " + saved.length + " pages for takeoff."));
    window.dispatchEvent(new CustomEvent("hws-pages-saved", { detail: saved }));
    return saved;
  }
  if (opts.navigate === "plan" && typeof sheetHref === "function") {
    location.href = sheetHref(opts.slug, opts.plans, { path: first.path, name: first.name, rel: first.planRel });
    return;
  }
  const u = new URL(location.href);
  u.searchParams.set("pdf", first.path);
  u.searchParams.set("name", first.name);
  u.searchParams.set("rel", first.planRel);
  location.href = u.href;
}
function xSync(view) {
  const btn = view && view.querySelector && view.querySelector("[data-fextract]");
  if (!btn) return;
  const stage = view.querySelector("[data-fstage]");
  const pages = stage ? (+stage.getAttribute("data-fpages") || 0) : 0;
  const kind = stage ? (stage.getAttribute("data-preview") || "") : "";
  btn.hidden = !(kind === "pdf" && pages > 1);
  if (!btn._xbound) {
    btn._xbound = true;
    btn.onclick = () => xOpenPreview(view);
  }
}
async function xOpenPreview(view) {
  const state = view._hwsFile || {};
  const stage = view.querySelector("[data-fstage]");
  const pages = (state.pages || (stage && +stage.getAttribute("data-fpages"))) || 0;
  if (pages < 2) { xToast("This PDF has one page."); return; }
  if (!state.bytes) { xToast("This PDF is not open yet."); return; }
  const described = await xDescribe(state.bytes, view);
  const titles = described.titles || [];
  const box = xPanel(view, pages, titles, described.meta);
  const save = box.querySelector("[data-xsave]");
  save.onclick = async () => {
    const picked = Array.from(box.querySelectorAll("[data-xpage]:checked")).map((el) => +el.getAttribute("data-xpage"));
    save.disabled = true;
    save.textContent = "Saving…";
    try {
      await xSave({
        slug: state.slug || (typeof J !== "undefined" && J && J.slug) || "",
        bytes: state.bytes,
        pages: picked,
        titles: titles,
        meta: described.meta,
        sourceName: (state.entry && state.entry.name) || "plan.pdf",
        sourceRel: (state.entry && state.entry.rel) || "",
        sourcePath: (state.entry && state.entry.path) || "",
        plans: xPlans(state.slug || (J && J.slug) || ""),
        navigate: "plan",
      });
    } catch (e) {
      save.disabled = false;
      save.textContent = "Save page for takeoff";
      xToast(e.message || String(e));
    }
  };
}
async function xOpenPlan() {
  const params = new URLSearchParams(location.search);
  const path = params.get("pdf") || "";
  const name = params.get("name") || "plan.pdf";
  const slug = params.get("job") || "";
  const plans = params.get("plans") || "";
  if (!path) { xToast("This Plan Room has no PDF yet."); return; }
  const btn = document.getElementById("hws-extract");
  if (btn) btn.disabled = true;
  try {
    const bytes = await xDownload(path);
    const lib = await xLib();
    const src = await lib.PDFDocument.load(bytes, { ignoreEncryption: true });
    const pages = src.getPageCount();
    if (pages < 2) { xToast("This PDF has one page."); return; }
    const described = await xDescribe(bytes, null);
    const titles = described.titles || [];
    const box = xPanel(document.body, pages, titles, described.meta);
    const save = box.querySelector("[data-xsave]");
    save.onclick = async () => {
      const picked = Array.from(box.querySelectorAll("[data-xpage]:checked")).map((el) => +el.getAttribute("data-xpage"));
      save.disabled = true;
      save.textContent = "Saving…";
      try {
        await xSave({
          slug: slug,
          bytes: bytes,
          pages: picked,
          titles: titles,
          meta: described.meta,
          sourceName: name,
          sourceRel: params.get("rel") || "",
          sourcePath: path,
          plans: plans,
          navigate: "here",
        });
      } catch (e) {
        save.disabled = false;
        save.textContent = "Save page for takeoff";
        xToast(e.message || String(e));
      }
    };
  } catch (e) {
    xToast(e.message || String(e));
  } finally {
    if (btn) btn.disabled = false;
  }
}
function xBoot() {
  const btn = document.getElementById("hws-extract");
  if (!btn || btn._xbound) return;
  btn._xbound = true;
  btn.onclick = () => xOpenPlan();
}
if (typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", xBoot);
  else xBoot();
}
window.HWSExtract = {
  list: xList,
  sync: xSync,
  extractPages: xExtractPages,
  sheetName: xSheetName,
  openPreview: xOpenPreview,
  openPlan: xOpenPlan,
  save: xSave,
  download: xDownload,
};
