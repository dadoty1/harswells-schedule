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
      .replace(/[\u2032\u2035\u02B9\u02BC\u2018\u2019\u201A\u201B\u00B4]/g, "'")
      .replace(/[\u2033\u2036\u02BA\u201C\u201D\u201E\u201F]/g, '"')
      .replace(/[\u2010\u2011\u2012\u2013\u2014\u2212]/g, "-")
      .replace(/\u2044/g, "/")
      .replace(/\u00BC/g, "1/4")
      .replace(/\u00BD/g, "1/2")
      .replace(/\u00BE/g, "3/4")
      .replace(/\u215B/g, "1/8")
      .replace(/\u215C/g, "3/8")
      .replace(/\u215D/g, "5/8")
      .replace(/\u215E/g, "7/8")
      .replace(/''/g, '"');
  }

  /* Common English and sheet words. A font whose letters are shifted by a
     constant (no usable ToUnicode map) scores near zero until the shift
     that restores these words. */
  var DICT = {};
  ("a an as at be by do go if in is it no of on or so to we all and for the not per see this that with from are was were been has had have its but can may will over under about than then them they you your our out off any each more most such only also other into plan site notes note scale sheet floor roof wall door window room cover project detail section elevation foundation north south east west general legend schedule architectural structural mechanical electrical plumbing civil landscape existing proposed building trades contractor drawing drawings title date revision typical similar grid level finish kitchen bath garage living dining bedroom closet porch deck stair stairs ramp area areas line lines symbol symbols material materials abbreviation abbreviations owner architect engineer survey grading utility dimension dimensions block number numbers noted inch inches feet foot information details read sheet").split(/\s+/).forEach(function (w) {
    if (w) DICT[w] = 1;
  });

  function caesar(str, delta) {
    var n = ((Number(delta) % 26) + 26) % 26;
    if (!n) return String(str || "");
    return String(str || "").replace(/[A-Za-z]/g, function (ch) {
      var base = ch <= "Z" ? 65 : 97;
      return String.fromCharCode(base + ((ch.charCodeAt(0) - base + n) % 26));
    });
  }

  function scoreText(text) {
    var words = String(text || "").toLowerCase().match(/[a-z]{2,}/g) || [];
    var hits = 0;
    words.forEach(function (w) { if (DICT[w]) hits++; });
    return { hits: hits, words: words.length, ratio: words.length ? hits / words.length : 0 };
  }

  function planBonus(text) {
    var up = String(text || "").toUpperCase();
    var n = 0;
    if (/\b(?:SCALE|PLAN|NOTES|SHEET|SITE|FLOOR|ELEVATION|FOUNDATION|COVER)\b/.test(up)) n += 2;
    if (/(?:FP|[GCLASMPE])\s*[-.]?\s*\d{1,3}\s*\.\s*\d{1,3}/.test(up)) n += 2;
    if (/\d+\s*\/\s*\d+/.test(up) && /=/.test(up)) n += 1;
    return n;
  }

  function betterScore(a, b) {
    if (a.hits !== b.hits) return a.hits > b.hits;
    if (Math.abs(a.ratio - b.ratio) > 0.02) return a.ratio > b.ratio;
    return (a.bonus || 0) > (b.bonus || 0);
  }

  function bestShift(text) {
    var raw = String(text || "");
    var letters = (raw.match(/[A-Za-z]/g) || []).length;
    var base = scoreText(raw);
    base.bonus = planBonus(raw);
    if (letters < 4) return { delta: 0, reliable: true, skip: true, score: base };
    if (base.hits >= 2 && base.ratio >= 0.45) return { delta: 0, reliable: true, skip: false, score: base };
    var best = { delta: 0, score: base };
    for (var d = 1; d <= 13; d++) {
      [d, -d].forEach(function (delta) {
        var shifted = caesar(raw, delta);
        var sc = scoreText(shifted);
        sc.bonus = planBonus(shifted);
        if (betterScore(sc, best.score)) best = { delta: delta, score: sc };
      });
    }
    var sc = best.score;
    var clear = (sc.hits >= 2 && sc.ratio >= 0.4 && (best.delta === 0 || sc.hits > base.hits))
      || (sc.hits >= 1 && sc.ratio >= 0.66 && sc.words <= 4 && letters >= 4 && (best.delta === 0 || sc.hits > base.hits));
    return { delta: clear ? best.delta : 0, reliable: !!clear, skip: false, score: sc };
  }

  function correctItems(items) {
    var list = items || [];
    if (!list.length) return { items: [], reliable: false, shifted: false, empty: true };
    var letters = 0;
    list.forEach(function (it) { letters += (String(it && it.str || "").match(/[A-Za-z]/g) || []).length; });
    if (letters < 4) return { items: list.slice(), reliable: false, shifted: false, empty: true };
    var grouped = {};
    list.forEach(function (it, i) {
      var key = String((it && it.font) || "");
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(i);
    });
    var deltas = {};
    var reliable = true;
    var keys = Object.keys(grouped);
    keys.forEach(function (key) {
      var text = grouped[key].map(function (i) { return list[i].str; }).join(" ");
      var found = bestShift(text);
      deltas[key] = found;
      if (!found.skip && !found.reliable) reliable = false;
    });
    if (!reliable) {
      var whole = bestShift(list.map(function (it) { return it.str; }).join(" "));
      if (whole.reliable) {
        reliable = true;
        keys.forEach(function (key) {
          if (!deltas[key].skip) deltas[key] = whole;
        });
      }
    }
    var shifted = false;
    var out = list.map(function (it) {
      var key = String((it && it.font) || "");
      var delta = (deltas[key] && deltas[key].delta) || 0;
      if (delta) shifted = true;
      var copy = {
        str: delta ? caesar(it.str, delta) : String((it && it.str) || ""),
        x: it.x, y: it.y, w: it.w, h: it.h,
      };
      if (it && it.font) copy.font = it.font;
      return copy;
    });
    return { items: out, reliable: reliable, shifted: shifted, empty: false };
  }

  function cleanFilePart(s) {
    var t = String(s || "");
    t = t.replace(/[\u0000-\u001F\u007F]/g, " ");
    t = t.replace(/[^\u0020-\u007E]/g, " ");
    t = t.replace(/[\\/:*?"<>|]/g, " ");
    t = t.replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "");
    return t;
  }

  function isJunkTitle(s) {
    var letters = String(s || "").replace(/[^A-Za-z]/g, "");
    if (letters.length < 2) return true;
    var vowels = (letters.match(/[AEIOUaeiou]/g) || []).length;
    if (vowels === 0 && letters.length >= 4) return true;
    if (letters.length >= 8 && vowels / letters.length < 0.15) return true;
    var words = String(s || "").toLowerCase().match(/[a-z]{3,}/g) || [];
    if (words.length && letters.length >= 8) {
      var hits = 0;
      words.forEach(function (w) { if (DICT[w]) hits++; });
      if (!hits && vowels / letters.length < 0.28) return true;
    }
    return false;
  }

  function sanitizeTitle(title, page) {
    var original = String(title == null ? "" : title);
    if (!original.trim()) return "";
    var s = cleanFilePart(original);
    var n = page || 1;
    if (!s || isJunkTitle(s)) return "Sheet p" + n;
    return s.slice(0, 80);
  }

  function sheetFileName(setName, page, title) {
    var set = cleanFilePart(setName).slice(0, 80) || "Sheet";
    var n = page || 1;
    var raw = String(title == null ? "" : title);
    var visible = raw.replace(/[\u0000-\u001F\u007F]/g, "").trim();
    if (!visible && !raw.trim()) return set + " - p" + n + ".pdf";
    var t = sanitizeTitle(raw, n);
    if (!t) return set + " - p" + n + ".pdf";
    return set + " - p" + n + " - " + t + ".pdf";
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
    var arch = /(?:(SCALE)\s*[:.]?\s*)?(\d+\s+\d+\s*\/\s*\d+|\d+\s*\/\s*\d+|\d+(?:\.\d+)?)\s*(?:"|in(?:ches|ch)?\b\.?)?\s*=\s*(\d+(?:\.\d+)?)\s*(?:'|ft\b|feet\b|foot\b)\.?\s*(?:-\s*(\d+(?:\.\d+)?)(?:\s*(?:"|in(?:ches|ch)?\b\.?))?|(\d+(?:\.\d+)?)\s*(?:"|in(?:ches|ch)?\b\.?))?/gi;
    var m;
    while ((m = arch.exec(src))) {
      var paper = parseInches(m[2]);
      var inch = m[4] != null && m[4] !== "" ? m[4] : (m[5] || "");
      var feet = Number(m[3]) + (inch !== "" ? Number(inch) / 12 : 0);
      if (!(paper > 0) || !(feet > 0)) continue;
      var kind = (Math.abs(paper - 1) < 1e-6 && feet >= 10) ? "engineering" : "architectural";
      var label;
      if (kind === "engineering") label = '1" = ' + (inch !== "" ? (m[3] + "'-" + inch + '"') : (m[3] + "'"));
      else label = fracLabel(paper) + '" = ' + m[3] + "'" + (inch !== "" ? "-" + inch + '"' : "-0\"");
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
    var rx = c.x / width;
    var ry = c.y / height;
    if (rx >= 0.55 && ry >= 0.55) return true;
    if (rx >= 0.7 && height >= width) return true;
    return false;
  }

  function dist(a, b) {
    if (!a || !b) return Infinity;
    var ca = center(a), cb = center(b);
    return Math.hypot(ca.x - cb.x, ca.y - cb.y);
  }

  function chooseScale(list) {
    if (!list || !list.length) return null;
    var measuredExplicit = list.filter(function (s) { return s.explicit && !s.nts && s.unitsPerPoint > 0; });
    if (measuredExplicit.length) return measuredExplicit[0];
    var under = list.filter(function (s) { return s.underTitle && !s.nts && s.unitsPerPoint > 0; });
    if (under.length) return under[0];
    var measured = list.filter(function (s) { return !s.nts && s.unitsPerPoint > 0; });
    if (measured.length) return measured[0];
    var noted = list.filter(function (s) { return s.explicit && s.nts; });
    return noted[0] || list[0];
  }

  function pickDefault(scales, width, height, anchor) {
    if (!scales || !scales.length) return null;
    var block = scales.filter(function (s) { return inTitleBlock(s.box, width, height); });
    if (block.length) return chooseScale(block);
    if (anchor) {
      var near = scales.filter(function (s) { return dist(s.box, anchor) < Math.max(width, height) * 0.35; });
      near.sort(function (a, b) { return dist(a.box, anchor) - dist(b.box, anchor); });
      if (near.length) return chooseScale(near);
    }
    var under = scales.filter(function (s) { return s.underTitle; });
    if (under.length) return chooseScale(under);
    return chooseScale(scales);
  }

  function markUnderTitles(scales, titles) {
    (scales || []).forEach(function (s) {
      s.underTitle = (titles || []).some(function (t) {
        if (!s.box || !t.box) return false;
        var dy = s.box.y - t.box.y;
        var dx = Math.abs(center(s.box).x - center(t.box).x);
        return dy >= -10 && dy <= Math.max(56, (t.box.h || 12) * 4.5) && dx <= Math.max(240, t.box.w || 40);
      });
    });
  }

  var ONE_TITLE = { NOTES: 1, LEGEND: 1, COVER: 1, INDEX: 1, DETAILS: 1, ELEVATION: 1 };

  function sheetId(prefix, major, minor) {
    return String(prefix || "").toUpperCase() + String(major) + "." + String(minor);
  }

  function isDoorOrRoom(token) {
    var t = String(token || "").toUpperCase().replace(/[\s-]+/g, "");
    if (/^[DW]\d{1,3}[A-Z]?$/.test(t)) return true;
    if (/^\d{2,4}[A-Z]$/.test(t)) return true;
    return false;
  }

  function detectSheet(items, text, width, height) {
    var joined = items && items.length ? joinItems(items) : { text: normText(text), map: [] };
    var src = joined.text;
    var sheet = "";
    var anchor = null;
    var hits = [];
    var re = /(?:^|[^A-Z0-9])((?:FP|[GCLASMPE]))\s*[-.]?\s*(\d{1,3})\s*\.\s*(\d{1,3})(?![0-9A-Z])/gi;
    var hm;
    while ((hm = re.exec(src))) {
      var token = sheetId(hm[1], hm[2], hm[3]);
      if (isDoorOrRoom(token)) continue;
      var at = hm.index + hm[0].toUpperCase().lastIndexOf(hm[1].toUpperCase());
      if (at < 0) at = hm.index;
      var box = boxOf(itemAt(joined.map, items || [], at));
      var before = src.slice(Math.max(0, at - 16), at).toUpperCase();
      var labeled = /SHEET(?:\s*(?:NO\.?|NUMBER))?\s*[:.]?\s*$/.test(before);
      var score = (inTitleBlock(box, width, height) ? 4 : 0) + (labeled ? 2 : 0);
      var cy = box ? center(box).y : 0;
      hits.push({ token: token, box: box, score: score, y: cy });
    }
    if (hits.length) {
      hits.sort(function (a, b) {
        if (b.score !== a.score) return b.score - a.score;
        return b.y - a.y;
      });
      sheet = hits[0].token;
      anchor = hits[0].box;
    }
    var title = "";
    var titles = [];
    var banned = { SCALE: 1, SHEET: 1, DETAIL: 1, NOTED: 1, NOT: 1, NTS: 1, DOOR: 1, WINDOW: 1 };
    var rawWords = src.split(/\s+/);
    var pos = 0;
    var run = [];
    var runs = [];
    function flushRun() {
      if (run.length >= 2) {
        runs.push({ phrase: run.map(function (w) { return w.word; }).join(" "), index: run[0].index });
      } else if (run.length === 1 && ONE_TITLE[run[0].word]) {
        runs.push({ phrase: run[0].word, index: run[0].index, single: true });
      }
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
      if (phrase.length < 4) return;
      var tbox = boxOf(itemAt(joined.map, items || [], tm.index));
      var inBlock = inTitleBlock(tbox, width, height);
      if (tm.single && !inBlock) return;
      var tscore = phrase.length;
      if (inBlock) tscore += 5000;
      if (anchor) tscore += 1000 - Math.min(1000, dist(tbox, anchor));
      titles.push({ phrase: phrase, box: tbox });
      if (!titleBest || tscore > titleBest.score) titleBest = { phrase: phrase, score: tscore, box: tbox };
    });
    if (titleBest) title = titleBest.phrase;
    return { sheet: sheet, title: title, anchor: anchor, titles: titles };
  }

  function buildPage(input) {
    var raw = (input.items || []).map(function (it) {
      return {
        str: String(it.str || ""),
        x: Number(it.x) || 0,
        y: Number(it.y) || 0,
        w: Number(it.w) || 0,
        h: Number(it.h) || 0,
        font: it.font || "",
      };
    }).filter(function (it) { return it.str.trim(); });
    var fixed = correctItems(raw);
    var items = fixed.items.map(function (it) {
      return { str: it.str, x: round(it.x), y: round(it.y), w: round(it.w), h: round(it.h) };
    }).filter(function (it) { return it.str.trim(); });
    var text = items.map(function (it) { return it.str; }).join(" ").replace(/\s+/g, " ").trim();
    if (!text && input.text) {
      var whole = bestShift(String(input.text));
      text = (whole.reliable && whole.delta) ? caesar(input.text, whole.delta) : String(input.text);
      text = text.replace(/\s+/g, " ").trim();
      if (whole.delta) fixed.shifted = true;
    }
    var found = detectSheet(items, text, input.width, input.height);
    var scales = parseScales(text, items);
    markUnderTitles(scales, found.titles);
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
    var title = found.title ? sanitizeTitle(found.title, input.page) : "";
    return {
      page: input.page,
      sheet: found.sheet || "",
      title: title,
      corrected: !!fixed.shifted,
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
    correctItems: correctItems,
    sanitizeTitle: sanitizeTitle,
    sheetFileName: sheetFileName,
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
