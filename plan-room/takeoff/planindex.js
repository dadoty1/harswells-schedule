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

  /* Common English, sheet, and construction words. A CID font with no
     ToUnicode map comes back as glyph ids (a constant code-point offset
     over the whole range, not just letters). The offset that restores
     these words is the one we keep. */
  var DICT = {};
  ("a an as at be by do go if in is it no of on or so to we all and for the not per see this that with from are was were been has had have its but can may will over under about than then them they you your our out off any each more most such only also other into plan site notes note scale sheet floor roof wall door window room cover project detail section elevation foundation north south east west general legend schedule architectural structural mechanical electrical plumbing civil landscape existing proposed building trades contractor drawing drawings title date revision typical similar grid level finish kitchen bath garage living dining bedroom closet porch deck stair stairs ramp area areas line lines symbol symbols material materials abbreviation abbreviations owner architect engineer survey grading utility dimension dimensions block number numbers noted inch inches feet foot information details read sheet footing slab rebar concrete stud joist beam girder rafter truss sheathing drywall flashing gutter downspout header sill jamb handrail grade pier parapet soffit fascia ridge eave framing ceiling partition corridor egress verify permit demolition contour drainage setback occupancy remodel addition nts dwg hvac benchmark").split(/\s+/).forEach(function (w) {
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

  /* Shift every code point. Characters that do not land in printable ASCII
     become spaces so they cannot form a fake word. */
  function shiftCodes(str, delta) {
    var d = Number(delta) || 0;
    var s = String(str || "");
    if (!d) return { text: s, fit: 1, n: s.length };
    var out = [];
    var ok = 0;
    var n = 0;
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i);
      if (c >= 0xD800 && c <= 0xDBFF && i + 1 < s.length) {
        out.push(s.charAt(i), s.charAt(i + 1));
        i++;
        continue;
      }
      n++;
      var next = c + d;
      if (next >= 32 && next <= 126) {
        out.push(String.fromCharCode(next));
        ok++;
      } else {
        out.push(" ");
      }
    }
    return { text: out.join(""), fit: n ? ok / n : 0, n: n };
  }

  function applyShift(str, found) {
    if (!found || !found.delta) return String(str || "");
    if (found.mode === "letters") return caesar(str, found.delta);
    if (found.mode === "all") return shiftCodes(str, found.delta).text;
    return String(str || "");
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
    if ((a.hits || 0) !== (b.hits || 0)) return a.hits > b.hits;
    if (Math.abs((a.ratio || 0) - (b.ratio || 0)) > 0.02) return a.ratio > b.ratio;
    if (Math.abs((a.fit || 0) - (b.fit || 0)) > 0.05) return (a.fit || 0) > (b.fit || 0);
    return (a.bonus || 0) > (b.bonus || 0);
  }

  function glyphCount(str) {
    return String(str || "").replace(/\s+/g, "").length;
  }

  function shiftClear(best, base, glyphs) {
    var sc = best.score;
    var gained = best.delta === 0 || sc.hits > base.hits || (sc.bonus || 0) > (base.bonus || 0);
    if (sc.hits >= 2 && sc.ratio >= 0.4 && gained) return true;
    if (sc.hits >= 1 && sc.ratio >= 0.66 && sc.words <= 6 && glyphs >= 4 && gained) return true;
    if ((sc.bonus || 0) >= 3 && (sc.fit || 0) >= 0.8 && gained && sc.hits >= 1) return true;
    return false;
  }

  /* Letter-only Caesar first (a ToUnicode map that moves A-Z only), then a
     constant offset over the whole code range, including 29. */
  function bestShift(text) {
    var raw = String(text || "");
    var glyphs = glyphCount(raw);
    var base = scoreText(raw);
    base.bonus = planBonus(raw);
    base.fit = shiftCodes(raw, 0).fit;
    if (glyphs < 4) return { delta: 0, mode: "none", reliable: true, skip: true, score: base };
    if (base.hits >= 2 && base.ratio >= 0.45) return { delta: 0, mode: "none", reliable: true, skip: false, score: base };
    var best = { delta: 0, mode: "none", score: base };
    var k;
    for (k = 1; k <= 13; k++) {
      [k, -k].forEach(function (delta) {
        var shifted = caesar(raw, delta);
        var sc = scoreText(shifted);
        sc.bonus = planBonus(shifted);
        sc.fit = 1;
        if (betterScore(sc, best.score)) best = { delta: delta, mode: "letters", score: sc };
      });
    }
    for (var d = -40; d <= 40; d++) {
      if (!d) continue;
      var whole = shiftCodes(raw, d);
      if (whole.n < 4 || whole.fit < 0.72) continue;
      var sc = scoreText(whole.text);
      sc.bonus = planBonus(whole.text);
      sc.fit = whole.fit;
      if (betterScore(sc, best.score)) best = { delta: d, mode: "all", score: sc };
    }
    var clear = shiftClear(best, base, glyphs);
    return {
      delta: clear ? best.delta : 0,
      mode: clear ? best.mode : "none",
      reliable: !!clear,
      skip: false,
      score: best.score,
    };
  }

  function correctItems(items) {
    var list = items || [];
    if (!list.length) return { items: [], reliable: false, shifted: false, empty: true };
    var glyphs = 0;
    list.forEach(function (it) { glyphs += glyphCount(it && it.str); });
    if (glyphs < 4) return { items: list.slice(), reliable: false, shifted: false, empty: true };
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
      var found = deltas[key] || { delta: 0, mode: "none" };
      if (found.delta) shifted = true;
      var copy = {
        str: stripControls(applyShift(it.str, found)),
        x: it.x, y: it.y, w: it.w, h: it.h,
      };
      if (it && it.font) copy.font = it.font;
      return copy;
    });
    return { items: out, reliable: reliable, shifted: shifted, empty: false };
  }

  function stripControls(s) {
    return String(s || "").replace(/[\u0000-\u001F\u007F]/g, " ");
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
    for (den = 2; den <= 128; den++) {
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

  /* Architectural paper is a proper fraction (numerator smaller than a
     denominator from 2 through 128) or a whole number of inches from 1 to 12.
     5080" = 5'-0" is not a sheet scale. A paper inch that covers less than an
     inch of the building, or more than 2500 feet, is not one either. */
  function plausiblePaper(paper) {
    var whole, den, num;
    if (!(paper > 0)) return false;
    whole = Math.round(paper);
    if (Math.abs(paper - whole) < 1e-4 && whole >= 1 && whole <= 12) return true;
    for (den = 2; den <= 128; den++) {
      num = Math.round(paper * den);
      if (num >= 1 && num < den && Math.abs(paper - num / den) < 1e-3) return true;
    }
    return false;
  }

  function plausibleMeasure(paper, feet) {
    var perInch;
    if (!plausiblePaper(paper) || !(feet > 0)) return false;
    perInch = feet / paper;
    if (perInch < 1 / 12 - 1e-6) return false;
    if (perInch > 2500) return false;
    return true;
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

    /* A CID feet mark often survives the code-point fix as '='.
     1=-0" and 1=0" are 1'-0" on the real side of a scale.
     A trailing 20= is 20' when no inches follow.
     A trailing feet mark that is U+0020 is stripped by pdf.js, so
     1" = 20 with no mark is still 1" = 20'. */
  function normalizeScaleFeet(src) {
    /* A CID equals sign and feet mark are often glyph 32, so they arrive as
       a space. 1/4"  1 -0" is 1/4" = 1'-0". 1"  20 -0" is 1" = 20'-0". */
    var s = String(src || "").replace(/(^|[^0-9])(\d+\s*\/\s*\d+|1)\s*"\s+(\d{1,4})\s*(-\s*\d+)\s*"/g, function (all, pre, paper, feet, inches) {
      var p = parseInches(paper);
      var f = Number(feet);
      if (p > 0 && p < 1 && f >= 1 && f <= 20) return pre + paper + '" = ' + feet + "'" + inches + '"';
      if (Math.abs(p - 1) < 1e-6 && f >= 10 && f <= 2500) return pre + '1" = ' + feet + "'" + inches + '"';
      return all;
    });
    s = s.replace(/(=\s*\d+(?:\.\d+)?)\s*=\s*(-?\s*\d+(?:\.\d+)?)\s*"/g, function (_all, head, inches) {
      var inch = String(inches || "").replace(/\s+/g, "");
      if (!inch) return _all;
      if (inch.charAt(0) !== "-") inch = "-" + inch;
      return head + "'" + inch + '"';
    });
    return s.replace(/((?:"|in)\s*=\s*\d+(?:\.\d+)?)\s*=(?!\s*[-\d])/gi, function (_all, head) {
      return head + "'";
    });
  }

  /* N.T.S. with periods is the sheet notation. Bare NTS next to a detail is not. */
  function dottedNts(str) {
    var up = normText(str).toUpperCase().replace(/[^A-Z.]/g, "");
    return up === "N.T.S." || up === "N.T.S";
  }

  /* A title-block scale line is the notation by itself (SCALE: NTS, NTS,
     NOT TO SCALE). The same letters inside a note (DETAILS ARE NTS) are not. */
  function ntsScaleField(src, index, _rawLen, itemStr) {
    var item = normText(itemStr || "").toUpperCase().replace(/[^A-Z.\s]/g, " ").replace(/\s+/g, " ").trim();
    var exact = /^(?:SCALE\s+)?(?:NTS|N\.T\.S\.|NOT TO SCALE|AS NOTED)$/;
    if (!exact.test(item)) return false;
    if (/^SCALE\s+/.test(item)) return true;
    var prev = String(src || "").slice(Math.max(0, index - 28), index).toUpperCase().replace(/[^A-Z]+/g, " ").trim();
    var prevWord = prev ? prev.split(/\s+/).pop() : "";
    var okPrev = { SCALE: 1, PLAN: 1, ELEVATION: 1, SECTION: 1, NOTES: 1, NOTE: 1, SCHEDULE: 1, SHEET: 1, TITLE: 1, DRAWING: 1, NO: 1, NUMBER: 1, LEGEND: 1, COVER: 1 };
    return !prevWord || !!okPrev[prevWord];
  }

  function parseScales(text, items) {
    var joined = items && items.length ? joinItems(items) : { text: normText(text), map: [] };
    var src = normalizeScaleFeet(joined.text);
    var itemsUse = items && items.length ? items : [];
    var spans = [];
    var out = [];
    var arch = /(?:(SCALE)\s*[:.]?\s*)?(\d+\s+\d+\s*\/\s*\d+|\d+\s*\/\s*\d+|\d+(?:\.\d+)?)\s*(?:"|in(?:ches|ch)?\b\.?)?\s*=\s*(\d+(?:\.\d+)?)\s*(?:'|ft\b|feet\b|foot\b)\.?\s*(?:-\s*(\d+(?:\.\d+)?)(?:\s*(?:"|in(?:ches|ch)?\b\.?))?|(\d+(?:\.\d+)?)\s*(?:"|in(?:ches|ch)?\b\.?))?/gi;
    var m;
    while ((m = arch.exec(src))) {
      var paper = parseInches(m[2]);
      var inch = m[4] != null && m[4] !== "" ? m[4] : (m[5] || "");
      var feet = Number(m[3]) + (inch !== "" ? Number(inch) / 12 : 0);
      if (!(paper > 0) || !(feet > 0) || !plausibleMeasure(paper, feet)) {
        var token = m[2] || "";
        var fracAt = token.search(/\d+\s*\/\s*\d+/);
        if (fracAt > 0) {
          var base = m[0].indexOf(token);
          if (base < 0) base = 0;
          var nextAt = m.index + base + fracAt;
          arch.lastIndex = nextAt > m.index ? nextAt : m.index + 1;
        }
        continue;
      }
      var kind = (Math.abs(paper - 1) < 1e-6 && feet >= 10) ? "engineering" : "architectural";
      var label;
      if (kind === "engineering") label = '1" = ' + (inch !== "" ? (m[3] + "'-" + inch + '"') : (m[3] + "'"));
      else label = fracLabel(paper) + '" = ' + m[3] + "'" + (inch !== "" ? "-" + inch + '"' : "-0\"");
      pushScale(out, spans, {
        kind: kind,
        nts: false,
        explicit: !!m[1],
        headed: !!m[1],
        paperInches: paper,
        realFeet: feet,
        label: label,
        raw: m[0].replace(/\s+/g, " ").trim(),
      }, m.index, m.index + m[0].length, itemsUse, joined.map);
    }
    var rest = blankSpans(src, spans);
    var engBare = /(?:(SCALE)\s*[:.]?\s*)?1\s*(?:"|in(?:ches|ch)?\b\.?)\s*=\s*(\d{2,5})(?!\s*(?:[-'"\d]|in\b|ft\b|feet\b|foot\b))/gi;
    while ((m = engBare.exec(rest))) {
      var bareFeet = Number(m[2]);
      if (!(bareFeet >= 10) || !plausibleMeasure(1, bareFeet)) continue;
      pushScale(out, spans, {
        kind: "engineering",
        nts: false,
        explicit: !!m[1],
        headed: !!m[1],
        paperInches: 1,
        realFeet: bareFeet,
        label: '1" = ' + bareFeet + "'",
        raw: m[0].replace(/\s+/g, " ").trim(),
      }, m.index, m.index + m[0].length, itemsUse, joined.map);
    }
    rest = blankSpans(src, spans);
    /* \b fails after N.T.S. because the period is not a word character, and
       it also lets "nts" match inside instruments. Bound both sides. */
    var nts = /(?:(SCALE)\s*[:.]?\s*)?(?<![A-Za-z0-9.])(NTS|N\.T\.S\.?|NOT\s+TO\s+SCALE|AS\s+NOTED)(?![A-Za-z0-9])/gi;
    while ((m = nts.exec(rest))) {
      var word = m[2].replace(/\s+/g, " ").toUpperCase();
      var ntsLabel = word.indexOf("NOTE") >= 0 ? "AS NOTED" : (word.indexOf("NOT") >= 0 ? "NOT TO SCALE" : "NTS");
      var wordAt = m.index + m[0].toUpperCase().lastIndexOf(m[2].toUpperCase());
      if (wordAt < m.index) wordAt = m.index;
      var ntsItem = itemAt(joined.map, itemsUse, wordAt);
      var ntsText = (ntsItem && ntsItem.str) ? ntsItem.str : m[2];
      var sheetNts = dottedNts(ntsText);
      pushScale(out, spans, {
        kind: "nts",
        nts: true,
        explicit: !!m[1] || word === "NTS" || word.indexOf("N.T.S") === 0,
        headed: !!m[1],
        sheetNts: sheetNts,
        scaleField: sheetNts || ntsScaleField(src, wordAt, m[2].length, ntsText),
        paperInches: 0,
        realFeet: 0,
        ratio: 0,
        label: ntsLabel,
        raw: m[0].replace(/\s+/g, " ").trim(),
      }, wordAt, wordAt + m[2].length, itemsUse, joined.map);
    }
    /* A sheet-information N.T.S. is its own text item. Attach that box even
       when the joined string's periods do not line up with the match. */
    (itemsUse || []).forEach(function (it) {
      if (!dottedNts(it && it.str)) return;
      var rec = {
        kind: "nts",
        nts: true,
        explicit: true,
        headed: false,
        sheetNts: true,
        scaleField: true,
        paperInches: 0,
        realFeet: 0,
        ratio: 0,
        label: "NTS",
        raw: normText(it.str).replace(/\s+/g, " ").trim() || "N.T.S.",
        box: boxOf(it),
        unitsPerPoint: 0,
      };
      out.push(rec);
    });
    rest = blankSpans(src, spans);
    var ratio = /(?:(SCALE)\s*[:.]?\s*)?\b1\s*:\s*(\d{1,5})\b(?!\s*(?:am|pm)\b)/gi;
    while ((m = ratio.exec(rest))) {
      var n = Number(m[2]);
      if (!RATIOS[n]) continue;
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

  function inTitleCorner(box, width, height) {
    if (!box || !(width > 0) || !(height > 0)) return false;
    var c = center(box);
    var rx = c.x / width;
    var ry = c.y / height;
    if (rx >= 0.55 && ry >= 0.55) return true;
    if (rx >= 0.7 && height >= width) return true;
    return false;
  }

  function inTitleBlock(box, width, height) {
    if (inTitleCorner(box, width, height)) return true;
    if (!box || !(width > 0) || !(height > 0)) return false;
    var c = center(box);
    /* A landscape sheet keeps the title block in a band along the bottom,
       across the sheet, not only in the corner. */
    if (width > height && (c.y / height) >= 0.87) return true;
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
    var main = list.filter(function (s) { return s.underMain && !s.nts && s.unitsPerPoint > 0; });
    if (main.length) return main[0];
    var under = list.filter(function (s) { return s.underTitle && !s.nts && s.unitsPerPoint > 0; });
    if (under.length) return under[0];
    var measured = list.filter(function (s) { return !s.nts && s.unitsPerPoint > 0; });
    if (measured.length) return measured[0];
    var noted = list.filter(function (s) { return s.nts; });
    return noted[0] || null;
  }

  function slotLimit(width, height) {
    return Math.max(140, Math.max(width || 0, height || 0) * 0.16);
  }

  function inSlot(scale, width, height, anchor) {
    if (!scale || !scale.box || !inTitleBlock(scale.box, width, height)) return false;
    if (!anchor) return true;
    return dist(scale.box, anchor) <= slotLimit(width, height);
  }

  /* The title-block SCALE cell wins: a measured value there, then NTS
     written in that cell (SCALE: NTS beats a viewport scale). A dotted
     N.T.S. standing alone in the sheet information also beats a viewport
     scale. A bare NTS next to a detail does not. Otherwise the measured
     scale in the title-block slot, then the one under the main view. */
  function pickDefault(scales, width, height, anchor) {
    if (!scales || !scales.length) return null;
    var cellM = scales.filter(function (s) { return s.blockCell && !s.nts && s.unitsPerPoint > 0; });
    if (cellM.length) return chooseScale(cellM);
    var cellN = scales.filter(function (s) { return s.blockCell && s.nts && s.scaleField; });
    if (cellN.length) return chooseScale(cellN);
    var dotted = scales.filter(function (s) { return s.sheetNts && s.nts; });
    if (dotted.length) return chooseScale(dotted);
    var measured = scales.filter(function (s) { return !s.nts && s.unitsPerPoint > 0; });
    var slotM = measured.filter(function (s) { return inSlot(s, width, height, anchor); });
    if (slotM.length) {
      slotM.sort(function (a, b) { return dist(a.box, anchor) - dist(b.box, anchor); });
      return chooseScale(slotM);
    }
    var slotNts = scales.filter(function (s) {
      return s.nts && s.scaleField && inSlot(s, width, height, anchor);
    });
    if (slotNts.length) return chooseScale(slotNts);
    var main = measured.filter(function (s) { return s.underMain; });
    if (main.length) return chooseScale(main);
    var under = measured.filter(function (s) { return s.underTitle; });
    if (under.length) {
      if (anchor) under.sort(function (a, b) { return dist(a.box, anchor) - dist(b.box, anchor); });
      return chooseScale(under);
    }
    if (measured.length) {
      if (anchor) measured.sort(function (a, b) { return dist(a.box, anchor) - dist(b.box, anchor); });
      return chooseScale(measured);
    }
    return null;
  }

  function scaleUnderTitle(scale, title) {
    if (!scale || !scale.box || !title || !title.box) return false;
    var dy = scale.box.y - title.box.y;
    var dx = Math.abs(center(scale.box).x - center(title.box).x);
    return dy >= -10 && dy <= Math.max(56, (title.box.h || 12) * 4.5) && dx <= Math.max(240, title.box.w || 40);
  }

  function mainViewTitle(titles, width, height) {
    var best = null;
    (titles || []).forEach(function (t) {
      if (!t || !t.box) return;
      var font = Math.min(t.box.w || 0, t.box.h || 0);
      if (!(font > 0)) font = t.box.h || 0;
      var drawing = /\b(PLAN|ELEVATION|SECTION|SCHEDULE|DETAIL|DETAILS)\b/.test(t.phrase || "");
      var c = center(t.box);
      var mid = Math.hypot(c.x - (width || 0) / 2, c.y - (height || 0) / 2);
      var score = font * 20 + (drawing ? 80 : 0) - mid / 40;
      if (!t.inBlock) score += 30;
      if (!best || score > best.score) best = { title: t, score: score };
    });
    return best && best.title;
  }

  function markUnderTitles(scales, titles, width, height) {
    var main = mainViewTitle(titles, width, height);
    (scales || []).forEach(function (s) {
      s.underTitle = (titles || []).some(function (t) { return scaleUnderTitle(s, t); });
      s.underMain = !!(main && scaleUnderTitle(s, main));
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

  function fontOf(box) {
    if (!box) return 0;
    var w = box.w || 0;
    var h = box.h || 0;
    if (w > 0 && h > 0) return Math.min(w, h);
    return Math.max(w, h);
  }

  /* SEE SHEET A2.0, DETAIL A1.1, and SIM A2.0 name another sheet.
     SHEET NO. A2.1 in the title block does not. */
  function isReferenceCallout(before) {
    var b = String(before || "").toUpperCase().replace(/[^A-Z0-9]+/g, " ").replace(/\s+/g, " ").trim();
    if (/(?:^|\s)SEE\s+SHEET(?:\s+(?:NO|NUMBER))?$/.test(b)) return true;
    if (/(?:^|\s)(?:SEE|ON|FROM|PER)\s+SHEET$/.test(b)) return true;
    if (/(?:^|\s)(?:SEE|DETAIL|DET|SIMILAR|SIM|REF|REFER|REFERENCE|MATCH|FROM|PER|TYPICAL|TYP|CALLOUT|BUBBLE)$/.test(b)) return true;
    return false;
  }

  var COMPANY = { LLC: 1, INC: 1, CORP: 1, LTD: 1, MFGR: 1, MFG: 1, COMPANY: 1 };

  function companyPhrase(phrase) {
    var words = String(phrase || "").split(/\s+/);
    for (var i = 0; i < words.length; i++) if (COMPANY[words[i]]) return true;
    return false;
  }

  function drawingTitle(phrase) {
    return /\b(PLAN|ELEVATION|SECTION|SCHEDULE|DETAIL|DETAILS|NOTES|NOTE|LEGEND|COVER|FOUNDATION|ROOF|FLOOR|CEILING|FRAMING)\b/.test(phrase || "");
  }

  function plainLabel(str) {
    return String(str || "").toUpperCase().replace(/[^A-Z0-9]+/g, " ").replace(/\s+/g, " ").trim();
  }

  function labelKind(str) {
    var s = plainLabel(str);
    if (s === "SHEET TITLE" || s === "DRAWING TITLE") return "title";
    if (s === "SHEET NO" || s === "SHEET NUMBER" || s === "DWG NO" || s === "DRAWING NO") return "sheet";
    if (s === "SCALE") return "scale";
    if (s === "PROJECT NAME" || s === "PROJECT ADDRESS" || s === "CLIENT NAME" || s === "DATE" || s === "DRAWN BY" || s === "CHECKED BY") return "meta";
    return "";
  }

  /* Stamps and review marks sit in the same band as the sheet title. */
  function stampPhrase(phrase) {
    var p = plainLabel(phrase);
    if (!p) return false;
    if (/^(?:CITY APPROVAL|APPROVED|APPROVED BY|APPROVAL|REVIEWED|REVIEWED BY|REVIEW|SEAL|NOT FOR CONSTRUCTION|PRELIMINARY|VOID|ISSUED FOR REVIEW|ISSUED FOR APPROVAL|NO EXCEPTION TAKEN|NO EXCEPTIONS)$/.test(p)) return true;
    if (/\b(?:APPROVAL|APPROVED|REVIEWED)\b/.test(p) && p.split(" ").length <= 4 && !drawingTitle(p)) return true;
    if (/^\d{1,2} \d{1,2} \d{2,4}$/.test(p)) return true;
    return false;
  }

  function datePhrase(phrase) {
    return /^\d{1,2}[./-]\d{1,2}[./-]\d{2,4}$/.test(String(phrase || "").trim());
  }

  function lineMates(label, items) {
    var ly = label.y + (label.h || 0) / 2;
    var right = label.x + (label.w || 0);
    var row = [];
    (items || []).forEach(function (it) {
      if (!it || it === label) return;
      var text = normText(it.str).replace(/\s+/g, " ").trim();
      if (!text) return;
      var cy = it.y + (it.h || 0) / 2;
      if (Math.abs(cy - ly) > Math.max(label.h || 0, it.h || 0, 8) * 0.7) return;
      if (it.x < right - 6) return;
      row.push({ it: it, text: text });
    });
    row.sort(function (a, b) { return a.it.x - b.it.x; });
    var parts = [];
    var prevRight = right;
    var first = true;
    for (var i = 0; i < row.length; i++) {
      var gap = row[i].it.x - prevRight;
      if (gap > (first ? 220 : 36)) break;
      if (labelKind(row[i].text) || stampPhrase(row[i].text)) break;
      parts.push(row[i]);
      prevRight = row[i].it.x + (row[i].it.w || 0);
      first = false;
    }
    return parts;
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
      var before = src.slice(Math.max(0, at - 32), at).toUpperCase();
      if (isReferenceCallout(before)) continue;
      var labeled = /SHEET\s*(?:NO\.?|NUMBER|#)\s*[:.]?\s*$/.test(before) || /(?:^|[^A-Z])SHEET\s*[:.]?\s*$/.test(before);
      var cy = box ? center(box).y : 0;
      var cx = box ? center(box).x : 0;
      hits.push({
        token: token,
        box: box,
        font: fontOf(box),
        inBlock: inTitleBlock(box, width, height),
        labeled: labeled,
        y: cy,
        x: cx,
      });
    }
    if (hits.length) {
      var pool = hits.filter(function (h) { return h.inBlock; });
      if (!pool.length) pool = hits;
      pool.sort(function (a, b) {
        if ((b.labeled ? 1 : 0) !== (a.labeled ? 1 : 0)) return (b.labeled ? 1 : 0) - (a.labeled ? 1 : 0);
        if (Math.abs((b.font || 0) - (a.font || 0)) > 0.75) return (b.font || 0) - (a.font || 0);
        if (Math.abs(b.y - a.y) > 2) return b.y - a.y;
        return (b.x || 0) - (a.x || 0);
      });
      sheet = pool[0].token;
      anchor = pool[0].box;
    }
    var title = "";
    var titles = [];
    var banned = { SCALE: 1, SHEET: 1, DETAIL: 1, NOTED: 1, NOT: 1, NTS: 1, DOOR: 1, WINDOW: 1 };
    var rawWords = src.split(/\s+/);
    var pos = 0;
    var run = [];
    var runs = [];
    function pushPhrase(words) {
      if (words.length >= 2) {
        runs.push({ phrase: words.map(function (w) { return w.word; }).join(" "), index: words[0].index });
      } else if (words.length === 1 && ONE_TITLE[words[0].word]) {
        runs.push({ phrase: words[0].word, index: words[0].index, single: true });
      }
    }
    function flushRun() {
      var chunk = [];
      run.forEach(function (w) {
        if (COMPANY[w.word]) {
          pushPhrase(chunk);
          chunk = [];
        } else chunk.push(w);
      });
      pushPhrase(chunk);
      run = [];
    }
    function sameLine(a, b) {
      if (!a || !b) return false;
      var dy = Math.abs((a.y + a.h / 2) - (b.y + b.h / 2));
      var gap = b.x - (a.x + (a.w || 0));
      return dy <= Math.max(a.h || 0, b.h || 0, 8) && gap < 36 && gap > -8;
    }
    rawWords.forEach(function (word) {
      if (!word) return;
      var index = src.indexOf(word, pos);
      if (index < 0) index = pos;
      pos = index + word.length;
      var cleaned = word.replace(/[^A-Za-z]/g, "");
      if (/^[A-Z]{2,}$/.test(cleaned) && !banned[cleaned]) {
        var itemIndex = joined.map ? joined.map[index] : null;
        var wbox = boxOf(itemAt(joined.map, items || [], index));
        var prev = run[run.length - 1];
        if (prev && prev.item !== itemIndex && !sameLine(prev.box, wbox)) flushRun();
        run.push({ word: cleaned, index: index, item: itemIndex, box: wbox });
      } else flushRun();
    });
    flushRun();
    var titleBest = null;
    runs.forEach(function (tm) {
      var phrase = tm.phrase;
      if (phrase.length < 4) return;
      if (companyPhrase(phrase) || stampPhrase(phrase) || datePhrase(phrase)) return;
      if (phrase.length > 42 && !drawingTitle(phrase)) return;
      var tbox = boxOf(itemAt(joined.map, items || [], tm.index));
      var inBlock = inTitleBlock(tbox, width, height);
      var near = !!(anchor && tbox && dist(tbox, anchor) <= slotLimit(width, height));
      titles.push({ phrase: phrase, box: tbox, inBlock: inBlock });
      if (tm.single && !inBlock && !near) return;
      if (!inBlock && !near) return;
      var font = fontOf(tbox);
      var d = anchor && tbox ? dist(tbox, anchor) : 1000;
      var tscore = (inBlock ? 10000 : 0) + font * 100 - d;
      if (drawingTitle(phrase)) tscore += 80;
      if (!titleBest || tscore > titleBest.score) titleBest = { phrase: phrase, score: tscore, box: tbox };
    });
    if (titleBest) title = titleBest.phrase;
    var scaleCell = null;
    var scaleScore = -1;
    (items || []).forEach(function (it) {
      var kind = labelKind(it && it.str);
      if (!kind || kind === "meta") return;
      var mates = lineMates(it, items);
      var text = mates.map(function (m) { return m.text; }).join(" ").replace(/\s+/g, " ").trim();
      if (kind === "sheet" && text) {
        var idm = text.toUpperCase().match(/\b((?:FP|[GCLASMPE]))\s*[-.]?\s*(\d{1,3})\s*\.\s*(\d{1,3})\b/);
        if (idm && !isDoorOrRoom(sheetId(idm[1], idm[2], idm[3]))) {
          sheet = sheetId(idm[1], idm[2], idm[3]);
          anchor = boxOf(mates[0].it);
        }
      } else if (kind === "title" && text && !stampPhrase(text) && !companyPhrase(plainLabel(text)) && !datePhrase(text) && !labelKind(text)) {
        title = text;
      } else if (kind === "scale") {
        var box = mates.length ? boxOf(mates[0].it) : boxOf(it);
        var score = (inTitleBlock(boxOf(it), width, height) ? 1000 : 0) + fontOf(boxOf(it));
        if (score >= scaleScore) {
          scaleScore = score;
          scaleCell = { text: text, box: box, items: mates.map(function (m) { return m.it; }) };
        }
      }
    });
    if (!title) {
      var loose = null;
      titles.forEach(function (t) {
        var words = String(t.phrase || "").split(/\s+/);
        if (words.length > 4 || String(t.phrase || "").length > 32) return;
        if (!drawingTitle(t.phrase) || stampPhrase(t.phrase) || companyPhrase(t.phrase)) return;
        var font = fontOf(t.box);
        if (!loose || font > loose.font) loose = { phrase: t.phrase, font: font };
      });
      if (loose) title = loose.phrase;
    }
    return { sheet: sheet, title: title, anchor: anchor, titles: titles, scaleCell: scaleCell };
  }

  function markBlockCell(scales, cell, width, height) {
    var parsed = cell && cell.text ? parseScales(cell.text, cell.items) : [];
    var want = parsed[0] && parsed[0].label;
    (scales || []).forEach(function (s) {
      if (cell && cell.box && s.box && want && s.label === want && dist(s.box, cell.box) <= 140) s.blockCell = true;
      if (s.blockCell) return;
      if (s.nts && s.headed && s.scaleField && inTitleCorner(s.box, width, height)) s.blockCell = true;
    });
  }

  function itemsFromContent(page, content) {
    var vp = page.getViewport({ scale: 1 });
    var viewW = page.view ? (page.view[2] - page.view[0]) : 0;
    var userUnit = page.userUnit > 0 ? page.userUnit : (viewW > 0 ? vp.width / viewW : 1);
    var items = [];
    (content.items || []).forEach(function (it) {
      var str = it && it.str ? String(it.str) : "";
      if (!it || !it.transform) return;
      /* CID 32 is U+0020. On a font with no ToUnicode that glyph is '=' or
         the feet mark, and pdf.js puts it in its own item. Keep a real
         glyph; drop only the zero-width end-of-line markers. */
      if (!str.trim() && !(str.length && (Number(it.width) || 0) > 0)) return;
      var t = it.transform;
      var w = Number(it.width) || 0;
      var h = Number(it.height) || Math.hypot(t[2] || 0, t[3] || 0) || 0;
      var slen = Math.hypot(t[0] || 0, t[1] || 0) || 1;
      var hlen = Math.hypot(t[2] || 0, t[3] || 0) || 1;
      var x1 = t[4] + ((t[0] || 0) / slen) * w + ((t[2] || 0) / hlen) * h;
      var y1 = t[5] + ((t[1] || 0) / slen) * w + ((t[3] || 0) / hlen) * h;
      var p0 = vp.convertToViewportPoint(t[4], t[5]);
      var p1 = vp.convertToViewportPoint(x1, y1);
      var x = Math.min(p0[0], p1[0]);
      var y = Math.min(p0[1], p1[1]);
      items.push({
        str: str,
        x: x,
        y: y,
        w: Math.abs(p1[0] - p0[0]) || 1,
        h: Math.abs(p1[1] - p0[1]) || 1,
        font: it.fontName || "",
      });
    });
    return {
      items: items,
      width: vp.width,
      height: vp.height,
      userUnit: userUnit > 0 ? userUnit : 1,
      rotate: page.rotate || 0,
    };
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
    }).filter(function (it) {
      if (String(it.str || "").trim()) return true;
      return String(it.str || "").length > 0 && (Number(it.w) || 0) > 0;
    });
    var fixed = correctItems(raw);
    var items = fixed.items.map(function (it) {
      return { str: it.str, x: round(it.x), y: round(it.y), w: round(it.w), h: round(it.h) };
    }).filter(function (it) { return it.str.trim(); });
    var text = items.map(function (it) { return it.str; }).join(" ").replace(/\s+/g, " ").trim();
    if (!text && input.text) {
      var whole = bestShift(String(input.text));
      text = (whole.reliable && whole.delta) ? applyShift(input.text, whole) : String(input.text);
      if (whole.delta) fixed.shifted = true;
    }
    text = stripControls(text).replace(/\s+/g, " ").trim();
    var found = detectSheet(items, text, input.width, input.height);
    var scales = parseScales(text, items);
    markUnderTitles(scales, found.titles, input.width, input.height);
    markBlockCell(scales, found.scaleCell, input.width, input.height);
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
    var pageNo = input.page || 1;
    var title = found.title ? sanitizeTitle(found.title, pageNo) : "";
    var generic = "Sheet p" + pageNo;
    if (!title || title === generic) title = found.sheet ? ("Sheet " + found.sheet) : generic;
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
        var snippet = stripControls(hay.slice(start, end)).replace(/\s+/g, " ").trim();
        hits.push({
          page: page.page,
          sheet: stripControls(page.sheet || "").replace(/\s+/g, " ").trim(),
          title: stripControls(page.title || "").replace(/\s+/g, " ").trim(),
          snippet: (start ? "…" : "") + snippet + (end < hay.length ? "…" : ""),
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
    decodeItems: function (items) { return correctItems(items).items; },
    stripControls: stripControls,
    sanitizeTitle: sanitizeTitle,
    sheetFileName: sheetFileName,
    buildPage: buildPage,
    itemsFromContent: itemsFromContent,
    measure: measure,
    measureUser: measureUser,
    search: searchIndex,
    indexCurrent: indexCurrent,
    cacheKey: cacheKey,
    takeoffDoc: takeoffDoc,
    publicPage: publicPage,
  };
})(typeof window !== "undefined" ? window : globalThis);
