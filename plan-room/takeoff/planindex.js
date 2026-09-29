/* Per-page text and scale index for a plan PDF.
   Scales are feet per viewport point. A viewport point is 1/72 inch on the
   sheet after the PDF user unit is applied, so a quarter turn does not
   change the length and a UserUnit other than 1 does not change this number.
   The page box from getViewport({scale:1}) is that same space. */
(function (root) {
  var SCHEMA = "harswells.planindex.v1";
  var RATIOS = { 10: 1, 20: 1, 25: 1, 30: 1, 40: 1, 50: 1, 75: 1, 100: 1, 125: 1, 150: 1, 200: 1, 250: 1, 500: 1, 1000: 1, 1250: 1, 2500: 1 };

  function round(n) {
    n = Number(n) || 0;
    return Math.round(n * 1000) / 1000;
  }

  function normText(s) {
    return String(s || "")
      .replace(/[\u2032\u2018\u2019]/g, "'")
      .replace(/[\u2033\u201c\u201d]/g, '"')
      .replace(/''/g, '"');
  }

  function parseInches(s) {
    s = String(s || "").replace(/\s+/g, " ").trim();
    var m = s.match(/^(\d+)\s+(\d+)\s*\/\s*(\d+)$/);
    if (m) return Number(m[1]) + Number(m[2]) / Number(m[3]);
    m = s.match(/^(\d+)\s*\/\s*(\d+)$/);
    if (m) return Number(m[1]) / Number(m[2]);
    m = s.match(/^(\d+(?:\.\d+)?)$/);
    if (m) return Number(m[1]);
    return 0;
  }

  function fracLabel(n) {
    var den, num, i, g;
    if (!(n > 0)) return "";
    if (Math.abs(n - Math.round(n)) < 1e-6) return String(Math.round(n));
    for (den = 2; den <= 64; den++) {
      num = Math.round(n * den);
      if (Math.abs(n - num / den) < 0.004) {
        g = num;
        i = den;
        while (i) { var t = g % i; g = i; i = t; }
        num /= g;
        den /= g;
        if (num > den) {
          var whole = Math.floor(num / den);
          var rem = num % den;
          return rem ? (whole + " " + rem + "/" + den) : String(whole);
        }
        return num + "/" + den;
      }
    }
    return String(Math.round(n * 1000) / 1000);
  }

  function unitsPerPoint(scale) {
    if (!scale || scale.nts) return 0;
    if (scale.kind === "ratio") return scale.ratio / 864;
    if (!(scale.paperInches > 0)) return 0;
    return (scale.realFeet / scale.paperInches) / 72;
  }

  function blankSpans(text, spans) {
    var chars = text.split("");
    spans.forEach(function (sp) {
      for (var i = sp[0]; i < sp[1] && i < chars.length; i++) chars[i] = " ";
    });
    return chars.join("");
  }

  function itemAt(map, items, index) {
    if (!map || index < 0 || index >= map.length) return null;
    var it = items[map[index]];
    return it || null;
  }

  function boxOf(it) {
    if (!it) return null;
    return { x: Number(it.x) || 0, y: Number(it.y) || 0, w: Number(it.w) || 0, h: Number(it.h) || 0 };
  }

  function joinItems(items) {
    var text = "";
    var map = [];
    (items || []).forEach(function (it, i) {
      var s = normText(it && it.str);
      if (!s) return;
      if (text) { text += " "; map.push(i); }
      for (var c = 0; c < s.length; c++) map.push(i);
      text += s;
    });
    return { text: text, map: map };
  }

  function pushScale(out, spans, rec, start, end, items, map) {
    var it = itemAt(map, items, start);
    rec.box = boxOf(it);
    rec.unitsPerPoint = unitsPerPoint(rec);
    rec.raw = rec.raw || rec.label;
    out.push(rec);
    spans.push([start, end]);
  }

  function parseScales(text, items) {
    var joined = items && items.length ? joinItems(items) : { text: normText(text), map: [] };
    var src = joined.text;
    var itemsUse = items && items.length ? items : [];
    var spans = [];
    var out = [];
    var arch = /(?:(SCALE)\s*[:.]?\s*)?(\d+\s+\d+\s*\/\s*\d+|\d+\s*\/\s*\d+|\d+(?:\.\d+)?)\s*(?:"|in\b\.?)?\s*=\s*(\d+(?:\.\d+)?)\s*(?:'|ft\b)\s*(?:-\s*(\d+(?:\.\d+)?)\s*(?:"|in\b)?)?/gi;
    var m;
    while ((m = arch.exec(src))) {
      var paper = parseInches(m[2]);
      var feet = Number(m[3]) + (m[4] ? Number(m[4]) / 12 : 0);
      if (!(paper > 0) || !(feet > 0)) continue;
      var kind = (Math.abs(paper - 1) < 1e-6 && feet >= 10) ? "engineering" : "architectural";
      var label;
      if (kind === "engineering") label = '1" = ' + (m[4] ? (m[3] + "'-" + m[4] + '"') : (m[3] + "'"));
      else label = fracLabel(paper) + '" = ' + m[3] + "'" + (m[4] ? "-" + m[4] + '"' : "-0\"");
      pushScale(out, spans, {
        kind: kind,
        nts: false,
        explicit: !!m[1],
        paperInches: paper,
        realFeet: feet,
        label: label,
        raw: m[0].replace(/\s+/g, " ").trim(),
      }, m.index, m.index + m[0].length, itemsUse, joined.map);
    }
    var rest = blankSpans(src, spans);
    var nts = /(?:(SCALE)\s*[:.]?\s*)?(NTS|N\.T\.S\.|NOT\s+TO\s+SCALE|AS\s+NOTED)\b/gi;
    while ((m = nts.exec(rest))) {
      var word = m[2].replace(/\s+/g, " ").toUpperCase();
      var ntsLabel = word.indexOf("NOTE") >= 0 ? "AS NOTED" : (word.indexOf("NOT") >= 0 ? "NOT TO SCALE" : "NTS");
      pushScale(out, spans, {
        kind: "nts",
        nts: true,
        explicit: !!m[1] || word === "NTS" || word === "N.T.S.",
        paperInches: 0,
        realFeet: 0,
        ratio: 0,
        label: ntsLabel,
        raw: m[0].replace(/\s+/g, " ").trim(),
      }, m.index, m.index + m[0].length, itemsUse, joined.map);
    }
    rest = blankSpans(src, spans);
    var ratio = /(?:(SCALE)\s*[:.]?\s*)?\b1\s*:\s*(\d{1,5})\b(?!\s*(?:am|pm)\b)/gi;
    while ((m = ratio.exec(rest))) {
      var n = Number(m[2]);
      if (!m[1] && !RATIOS[n]) continue;
      if (!(n > 0)) continue;
      pushScale(out, spans, {
        kind: "ratio",
        nts: false,
        explicit: !!m[1],
        ratio: n,
        paperInches: 1,
        realFeet: n / 12,
        label: "1:" + n,
        raw: m[0].replace(/\s+/g, " ").trim(),
      }, m.index, m.index + m[0].length, itemsUse, joined.map);
    }
    var seen = {};
    var deduped = [];
    out.forEach(function (s) {
      var key = s.label + "|" + (s.box ? Math.round(s.box.x) + "," + Math.round(s.box.y) : "");
      if (seen[key]) return;
      seen[key] = 1;
      deduped.push(s);
    });
    return deduped;
  }

  function center(box) {
    return { x: box.x + box.w / 2, y: box.y + box.h / 2 };
  }

  function inTitleBlock(box, width, height) {
    if (!box || !(width > 0) || !(height > 0)) return false;
    var c = center(box);
    return c.x >= width * 0.52 && c.y >= height * 0.58;
  }

  function dist(a, b) {
    if (!a || !b) return Infinity;
    var ca = center(a), cb = center(b);
    return Math.hypot(ca.x - cb.x, ca.y - cb.y);
  }

  function pickDefault(scales, width, height, anchor) {
    if (!scales || !scales.length) return null;
    var pool = scales.slice();
    if (anchor) {
      pool.sort(function (a, b) { return dist(a.box, anchor) - dist(b.box, anchor); });
      var near = pool.filter(function (s) { return dist(s.box, anchor) < Math.max(width, height) * 0.35; });
      if (near.length) {
        var explicit = near.filter(function (s) { return s.explicit; });
        return (explicit[0] || near[0]);
      }
    }
    var block = scales.filter(function (s) { return inTitleBlock(s.box, width, height); });
    if (block.length) {
      var titled = block.filter(function (s) { return s.explicit; });
      return (titled[0] || block[0]);
    }
    var measured = scales.filter(function (s) { return !s.nts && s.unitsPerPoint > 0; });
    return measured[0] || scales[0];
  }

  function sheetToken(s) {
    var m = String(s || "").toUpperCase().match(/^([A-Z]{1,3})[-.]?(\d{1,3}(?:\.\d{1,3})?)$/);
    if (!m) return "";
    return m[1] + m[2];
  }

  function detectSheet(items, text, width, height) {
    var joined = items && items.length ? joinItems(items) : { text: normText(text), map: [] };
    var src = joined.text;
    var sheet = "";
    var anchor = null;
    var labeled = /SHEET(?:\s*(?:NO\.?|NUMBER))?\s*[:.]?\s*([A-Z]{1,3}\s*[-.]?\s*\d{1,3}(?:\.\d{1,3})?)/i.exec(src);
    if (labeled) {
      sheet = sheetToken(labeled[1].replace(/\s+/g, ""));
      anchor = boxOf(itemAt(joined.map, items || [], labeled.index));
    }
    if (!sheet) {
      var bare = /\b([A-Z]{1,2}\d{1,3}(?:\.\d{1,2})?)\b/g;
      var bm, best = null;
      while ((bm = bare.exec(src))) {
        var token = sheetToken(bm[1]);
        if (!token) continue;
        var box = boxOf(itemAt(joined.map, items || [], bm.index));
        var score = inTitleBlock(box, width, height) ? 2 : 1;
        if (!best || score > best.score) best = { token: token, box: box, score: score };
      }
      if (best) { sheet = best.token; anchor = best.box; }
    }
    var title = "";
    var banned = { SCALE: 1, SHEET: 1, DETAIL: 1, NOTED: 1, NOT: 1, NTS: 1 };
    var rawWords = src.split(/\s+/);
    var pos = 0;
    var run = [];
    var runs = [];
    function flushRun() {
      if (run.length >= 2) runs.push({ phrase: run.map(function (w) { return w.word; }).join(" "), index: run[0].index });
      run = [];
    }
    rawWords.forEach(function (word) {
      if (!word) return;
      var index = src.indexOf(word, pos);
      if (index < 0) index = pos;
      pos = index + word.length;
      if (/^[A-Z]{2,}$/.test(word) && !banned[word]) run.push({ word: word, index: index });
      else flushRun();
    });
    flushRun();
    var titleBest = null;
    runs.forEach(function (tm) {
      var phrase = tm.phrase;
      if (phrase.length < 5) return;
      var tbox = boxOf(itemAt(joined.map, items || [], tm.index));
      var tscore = 0;
      if (anchor) tscore = 1000 - Math.min(1000, dist(tbox, anchor));
      else if (inTitleBlock(tbox, width, height)) tscore = 100 + phrase.length;
      else tscore = phrase.length;
      if (!titleBest || tscore > titleBest.score) titleBest = { phrase: phrase, score: tscore };
    });
    if (titleBest) title = titleBest.phrase;
    return { sheet: sheet, title: title, anchor: anchor };
  }

  function buildPage(input) {
    var items = (input.items || []).map(function (it) {
      return {
        str: String(it.str || ""),
        x: round(it.x),
        y: round(it.y),
        w: round(it.w),
        h: round(it.h),
      };
    }).filter(function (it) { return it.str.trim(); });
    var text = items.map(function (it) { return it.str; }).join(" ").replace(/\s+/g, " ").trim();
    if (!text && input.text) text = String(input.text).replace(/\s+/g, " ").trim();
    var found = detectSheet(items, text, input.width, input.height);
    var scales = parseScales(text, items);
    var chosen = pickDefault(scales, input.width, input.height, found.anchor);
    var scale = null;
    if (chosen) {
      scale = {
        label: chosen.label,
        kind: chosen.kind,
        nts: !!chosen.nts,
        unitsPerPoint: chosen.unitsPerPoint || 0,
        paperInches: chosen.paperInches || 0,
        realFeet: chosen.realFeet || 0,
        ratio: chosen.ratio || 0,
        explicit: !!chosen.explicit,
        confirmed: false,
        source: chosen.nts ? "noted" : "detected",
      };
    }
    return {
      page: input.page,
      sheet: found.sheet || "",
      title: found.title || "",
      text: text,
      source: input.source || "text",
      width: round(input.width),
      height: round(input.height),
      userUnit: input.userUnit > 0 ? input.userUnit : 1,
      rotate: Number(input.rotate) || 0,
      scales: scales.map(function (s) {
        return {
          label: s.label,
          kind: s.kind,
          nts: !!s.nts,
          unitsPerPoint: s.unitsPerPoint || 0,
          raw: s.raw || s.label,
        };
      }),
      scale: scale,
      items: items,
    };
  }

  function measure(p1, p2, unitsPerPoint) {
    var dx = (Number(p2.x) || 0) - (Number(p1.x) || 0);
    var dy = (Number(p2.y) || 0) - (Number(p1.y) || 0);
    var len = Math.hypot(dx, dy);
    var k = Number(unitsPerPoint) || 0;
    return len * k;
  }

  function measureUser(p1, p2, unitsPerPoint, userUnit) {
    var uu = userUnit > 0 ? userUnit : 1;
    return measure(p1, p2, unitsPerPoint) * uu;
  }

  function searchIndex(index, query) {
    var q = String(query || "").trim().toLowerCase();
    var hits = [];
    if (!q || !index || !index.pages) return hits;
    index.pages.forEach(function (page) {
      var items = page.items || [];
      var hay = "";
      var owner = [];
      items.forEach(function (it, i) {
        var s = String(it.str || "");
        if (!s) return;
        if (hay) { hay += " "; owner.push(i); }
        for (var c = 0; c < s.length; c++) owner.push(i);
        hay += s;
      });
      if (!hay) hay = page.text || "";
      var lower = hay.toLowerCase();
      var from = 0;
      while (hits.length < 40) {
        var at = lower.indexOf(q, from);
        if (at < 0) break;
        from = at + Math.max(1, q.length);
        var a = owner[at];
        var b = owner[Math.min(at + q.length - 1, owner.length - 1)];
        var box = null;
        if (a != null && items[a]) {
          var first = items[a];
          var last = items[b == null ? a : b] || first;
          var x = Math.min(first.x, last.x);
          var y = Math.min(first.y, last.y);
          box = {
            x: x,
            y: y,
            w: Math.max(first.x + first.w, last.x + last.w) - x,
            h: Math.max(first.y + first.h, last.y + last.h) - y,
          };
        }
        var start = Math.max(0, at - 24);
        var end = Math.min(hay.length, at + q.length + 24);
        hits.push({
          page: page.page,
          sheet: page.sheet || "",
          title: page.title || "",
          snippet: (start ? "…" : "") + hay.slice(start, end).trim() + (end < hay.length ? "…" : ""),
          box: box,
        });
      }
    });
    return hits;
  }

  function indexCurrent(saved, revision) {
    return !!(saved && saved.schema === SCHEMA && saved.revision && saved.revision === revision && saved.complete && Array.isArray(saved.pages) && saved.pages.length);
  }

  function cacheKey(fileId, revision) {
    return String(fileId || "plan") + "|" + String(revision || "");
  }

  function takeoffDoc(index, pdfName) {
    var name = pdfName || (index && index.file) || "";
    var calibrations = [];
    var sheets = [];
    (index.pages || []).forEach(function (p) {
      var sc = p.scale;
      var id = p.sheet || (name + (p.page > 1 ? "#" + p.page : ""));
      if (sc && sc.unitsPerPoint > 0 && !sc.nts) {
        calibrations.push({
          unitsPerPoint: sc.unitsPerPoint,
          unit: "ft",
          label: sc.label,
          source: (sc.source === "declared" || sc.confirmed) ? "declared" : "imported",
          page: p.page,
        });
      }
      var row = {
        sheet_id: id,
        page: p.page,
        title: p.title || "",
        scale_label: sc ? sc.label : "",
        scales: (p.scales || []).map(function (s) { return { label: s.label, kind: s.kind, unitsPerPoint: s.unitsPerPoint || 0 }; }),
      };
      if (sc && sc.unitsPerPoint > 0 && !sc.nts) {
        row.scale_source = sc.confirmed ? "confirmed" : "detected";
        row.units_per_px = sc.unitsPerPoint / 2;
      } else if (sc && sc.nts) row.scale_source = "noted";
      sheets.push(row);
    });
    return {
      schema: "opentakeoff.takeoff_canvas.v1",
      pdf: name,
      conditions: [],
      shapes: [],
      sheets: sheets,
      planroom: {
        schema: "harswells.planroom.v1",
        pdf: name,
        needs_review: [],
        annotations: [],
        calibrations: calibrations,
        sheets: [],
        rotations: [],
        index: index,
      },
    };
  }

  function publicPage(p) {
    if (!p) return null;
    var copy = {
      page: p.page,
      sheet: p.sheet,
      title: p.title,
      text: p.text,
      source: p.source,
      width: p.width,
      height: p.height,
      userUnit: p.userUnit,
      rotate: p.rotate,
      scales: p.scales,
      scale: p.scale,
    };
    return copy;
  }

  root.HWSPlanIndex = {
    SCHEMA: SCHEMA,
    parseScales: function (text, items) { return parseScales(text, items); },
    unitsPerPoint: unitsPerPoint,
    pickDefault: pickDefault,
    detectSheet: detectSheet,
    buildPage: buildPage,
    measure: measure,
    measureUser: measureUser,
    search: searchIndex,
    indexCurrent: indexCurrent,
    cacheKey: cacheKey,
    takeoffDoc: takeoffDoc,
    publicPage: publicPage,
  };
})(typeof window !== "undefined" ? window : globalThis);
