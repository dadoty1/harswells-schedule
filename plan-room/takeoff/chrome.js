/* Plan Room exit chrome. Loaded by the published viewer, and imported by the
   Vite host so a later rebuild keeps the same behavior.
   Back, Close, Escape, and the browser/iOS back gesture leave the sheet.
   Takeoff edits keep the 600 ms debounce and are flushed before the page goes. */

export function installPlanChrome() {
  if (window.__hwsPlanChrome) return;
  window.__hwsPlanChrome = 1;
  var params = new URLSearchParams(location.search);
  var STATE = "hwsPlan";
  var closing = false;
  var left = false;

  function jobHash() {
    var job = params.get("job") || "";
    var hash = params.get("back") || (job ? "#/job/" + job + "/plans" : "#/plans");
    if (hash.charAt(0) !== "#") hash = "#" + hash;
    return hash;
  }
  function backUrl() {
    var home = new URL("../../index.html", location.href);
    home.hash = jobHash();
    return home.href;
  }
  function sameOriginReferrer() {
    try {
      if (!document.referrer) return false;
      return new URL(document.referrer).origin === location.origin;
    } catch (e) {
      return false;
    }
  }
  function stillOnPlan() {
    return /plan-room\/takeoff/i.test(location.pathname);
  }
  function flushTakeoff() {
    var viewer = window.HWSPlanViewer;
    if (!viewer || typeof viewer.runAction !== "function") return Promise.resolve();
    return Promise.resolve(viewer.runAction("persistence.save")).catch(function () {});
  }
  function leaveNow() {
    if (left) return;
    left = true;
    var target = backUrl();
    if (sameOriginReferrer() && history.length > 1) {
      history.back();
      window.setTimeout(function () {
        if (stillOnPlan()) location.replace(target);
      }, 400);
      return;
    }
    location.replace(target);
  }
  function requestClose() {
    if (closing || left) return;
    closing = true;
    flushTakeoff().then(function () {
      if (history.state && history.state[STATE] === 1) {
        history.back();
        return;
      }
      leaveNow();
    });
  }

  if (!history.state || history.state[STATE] !== 1) {
    history.pushState({ hwsPlan: 1 }, "", location.href);
  }
  window.addEventListener("popstate", function () {
    if (left) return;
    if (!closing) {
      closing = true;
      flushTakeoff().then(leaveNow);
      return;
    }
    leaveNow();
  });
  window.addEventListener("pageshow", function (ev) {
    if (!ev.persisted) return;
    left = false;
    closing = false;
    if (!history.state || history.state[STATE] !== 1) {
      history.pushState({ hwsPlan: 1 }, "", location.href);
    }
  });

  var back = document.getElementById("hws-back");
  if (back) {
    back.href = backUrl();
    back.addEventListener("click", function (ev) {
      ev.preventDefault();
      requestClose();
    });
  }
  var closeBtn = document.getElementById("hws-close");
  if (closeBtn) closeBtn.addEventListener("click", function () { requestClose(); });

  document.addEventListener("keydown", function (ev) {
    if (ev.key !== "Escape" || ev.defaultPrevented) return;
    var dialog = document.querySelector(".hws-cal-dialog");
    if (dialog) {
      var cancel = dialog.querySelector("[data-cancel]");
      if (cancel) cancel.click();
      return;
    }
    var tag = ev.target && ev.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    ev.preventDefault();
    requestClose();
  });

  function bindPanel(id, className) {
    var btn = document.getElementById(id);
    if (!btn) return;
    btn.onclick = function () {
      var el = document.querySelector(".mpdf-root");
      if (el) el.classList.toggle(className);
    };
  }
  bindPanel("hws-sheets", "hws-left");
  bindPanel("hws-takeoff", "hws-right");

  var title = document.getElementById("hws-title");
  function sheetLabel() {
    var name = params.get("name") || "";
    name = name.replace(/\.pdf$/i, "");
    if (name) return name;
    if (params.get("sample") === "1") {
      var demo = params.get("demo") || "";
      if (demo === "tile") return "Tile and wall sample";
      if (demo === "auto") return "Auto takeoff sample";
      return "Sample plan";
    }
    var status = document.getElementById("hws-status");
    var text = status ? String(status.textContent || "").trim() : "";
    if (text && text !== "Plan Room" && text.indexOf("Loading") !== 0) return text;
    return "Plan";
  }
  function paintTitle() {
    if (!title) return;
    var label = sheetLabel();
    title.textContent = label;
    document.title = label + " · Plan Room";
  }
  paintTitle();
  var statusEl = document.getElementById("hws-status");
  if (statusEl && !params.get("name")) {
    new MutationObserver(paintTitle).observe(statusEl, { childList: true, characterData: true, subtree: true });
  }

  var toolsBtn = document.getElementById("hws-tools");
  var narrow = window.matchMedia("(max-width: 800px)");
  function toolsOpen() {
    return !!(toolsBtn && toolsBtn.getAttribute("aria-pressed") === "true");
  }
  function syncTools() {
    var open = toolsOpen();
    document.body.classList.toggle("hws-tools-off", narrow.matches && !open);
    if (toolsBtn) toolsBtn.setAttribute("aria-pressed", open ? "true" : "false");
  }
  if (toolsBtn) {
    if (narrow.matches) toolsBtn.setAttribute("aria-pressed", "false");
    else toolsBtn.setAttribute("aria-pressed", "true");
    toolsBtn.addEventListener("click", function () {
      toolsBtn.setAttribute("aria-pressed", toolsOpen() ? "false" : "true");
      syncTools();
    });
  }
  if (narrow.addEventListener) narrow.addEventListener("change", syncTools);
  syncTools();

  var rotateButtonRef = null;
  function pinToolbarExtras(toolbar) {
    if (!toolbar || toolbar.querySelector("[data-hws-extra]")) return;
    var nav = document.createElement("div");
    nav.className = "mpdf-tb-group";
    nav.dataset.group = "hws-nav";
    nav.dataset.hwsExtra = "1";
    nav.setAttribute("role", "group");
    nav.setAttribute("aria-label", "Sheets and takeoff");
    ["hws-sheets", "hws-takeoff"].forEach(function (id) {
      var src = document.getElementById(id);
      if (!src) return;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "mpdf-tb-btn";
      btn.textContent = src.textContent;
      btn.setAttribute("aria-label", src.getAttribute("aria-label") || src.textContent);
      btn.addEventListener("click", function () { src.click(); });
      nav.appendChild(btn);
    });
    /* Empty until a Rotate page control is mounted. A viewer tool in any
       group also stays on this scrolling row. */
    var rotate = document.createElement("div");
    rotate.className = "mpdf-tb-group";
    rotate.dataset.group = "rotate";
    rotate.id = "hws-rotate-slot";
    rotate.setAttribute("aria-label", "Rotate page");
    /* The viewer rebuilds its toolbar, so keep the one Rotate page button
       (its click is bound once at load) and move it into each new slot. */
    var rotateBtn = rotateButtonRef || document.getElementById("hws-rotate");
    if (rotateBtn) {
      rotateButtonRef = rotateBtn;
      rotateBtn.classList.add("mpdf-tb-btn");
      rotate.appendChild(rotateBtn);
    }
    toolbar.insertBefore(rotate, toolbar.firstChild);
    toolbar.insertBefore(nav, toolbar.firstChild);
  }

  function currentPage() {
    var input = document.querySelector(".mpdf-page-input");
    return input && input.value ? String(input.value) : "1";
  }
  function armBanner(bar) {
    if (!bar || bar.querySelector("[data-hws-dismiss]")) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "hws-scale-x";
    btn.dataset.hwsDismiss = "1";
    btn.setAttribute("aria-label", "Dismiss");
    btn.textContent = "×";
    btn.addEventListener("click", function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      /* CSS hides [data-dismissed]. Do not toggle the hidden attribute:
         the viewer shows the banner again on page:changed, and fighting
         that with a hidden observer resizes the sheet until WebKit dies. */
      bar.dataset.dismissed = currentPage();
    });
    bar.appendChild(btn);
  }
  function clearStaleDismiss(page) {
    document.querySelectorAll(".hws-scale[data-dismissed]").forEach(function (bar) {
      if (bar.dataset.dismissed !== page) delete bar.dataset.dismissed;
    });
  }
  function armBanners() {
    document.querySelectorAll(".hws-scale").forEach(armBanner);
  }
  function bindPageWatch() {
    var viewer = window.HWSPlanViewer;
    if (!viewer || !viewer.bus || typeof viewer.bus.on !== "function" || viewer.bus.__hwsDismiss) return false;
    viewer.bus.__hwsDismiss = 1;
    viewer.bus.on("page:changed", function (ev) {
      var page = String(ev && ev.page != null ? ev.page : currentPage());
      clearStaleDismiss(page);
    });
    return true;
  }
  armBanners();
  var viewerHost = document.getElementById("viewer");
  if (viewerHost) {
    new MutationObserver(function () {
      document.querySelectorAll(".mpdf-toolbar").forEach(pinToolbarExtras);
    }).observe(viewerHost, { childList: true, subtree: true });
  }
  new MutationObserver(armBanners).observe(document.body, { childList: true });
  var pageTries = 0;
  var pageTimer = setInterval(function () {
    pageTries += 1;
    if (bindPageWatch() || pageTries > 50) clearInterval(pageTimer);
  }, 200);

  /* Phone: the Sheets drawer covers the Tools row, so picking a sheet or tapping
     outside the drawer closes it (the top-bar Sheets button is hidden here). */
  document.addEventListener("click", function (ev) {
    if (window.innerWidth > 800) return;
    var root = document.querySelector(".mpdf-root");
    if (!root || !root.classList.contains("hws-left")) return;
    var t = ev.target;
    if (!t || !t.closest) return;
    var picked = t.closest(".mpdf-sheet-card");
    var inside = t.closest(".mpdf-side-left") || t.closest("#hws-bar") || t.closest("[data-hws-extra]");
    if (picked || !inside) {
      window.setTimeout(function () { root.classList.remove("hws-left"); }, 0);
    }
  }, true);

  var bar = document.getElementById("hws-bar");
  if (bar) bar.dataset.hwsChrome = "1";
}

installPlanChrome();
