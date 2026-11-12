/* ISAW News embed script.
   On any page, put a div where the wire should appear, then load this script once:

   <div data-isaw-embed data-region="uk" data-limit="8" data-theme="auto"></div>
   <script async src="https://isawnews.com/embed.js"></script>

   Options (all optional), written as data- attributes on the div:
     data-view      wire (default) or tv
     data-region    all, uk or us
     data-limit     how many stories to show (wire)
     data-hours     only stories from the last N hours (up to 168)
     data-min       only stories rated N stars or more (1 to 5)
     data-theme     light, dark or auto
     data-controls  0 hides search and the region switch
     data-head      0 hides the ISAW News title bar
     data-credit    0 hides the small "Powered by" line
     data-bg        transparent, or a hex colour such as ffffff
     data-accent    hex colour such as ffd100
     data-skin      tv only: isaw, cyfr, adc, harbour, signal, daylight
     data-secs      tv only: seconds per story
     data-height    wire only: starting height in px (it resizes itself)
     data-max-width the widest the frame may get, for example 720px
*/
(function () {
  var me = document.currentScript;
  var base = "https://isawnews.com/";
  try { if (me && me.src) base = new URL(".", me.src).href; } catch (e) {}
  var origin = new URL(base).origin;
  var PASS = ["region", "limit", "hours", "min", "theme", "controls", "head", "credit", "bg", "accent", "skin", "secs"];
  var frames = {}, count = 0;

  function build(host) {
    if (host.getAttribute("data-isaw-ready")) return;
    host.setAttribute("data-isaw-ready", "1");
    var view = (host.getAttribute("data-view") || "wire").toLowerCase() === "tv" ? "tv" : "wire";
    var id = "isaw" + (++count);
    var q = new URLSearchParams();
    q.set("embed", "1");
    PASS.forEach(function (k) {
      var v = host.getAttribute("data-" + k);
      if (v !== null && v !== "") q.set(k, v.replace(/^#/, ""));
    });
    if (view === "wire") q.set("id", id);
    var f = document.createElement("iframe");
    f.src = base + (view === "tv" ? "tv.html" : "") + "?" + q.toString();
    f.title = "ISAW News";
    f.loading = "lazy";
    f.setAttribute("allowtransparency", "true");
    f.style.cssText = "display:block;width:100%;border:0;max-width:" + (host.getAttribute("data-max-width") || "100%") + ";";
    if (view === "tv") {
      f.style.aspectRatio = "16 / 9";
      f.allow = "fullscreen";
      f.setAttribute("allowfullscreen", "");
    } else {
      f.style.height = (parseInt(host.getAttribute("data-height"), 10) || 640) + "px";
      frames[id] = f;
    }
    host.appendChild(f);
  }

  window.addEventListener("message", function (e) {
    if (e.origin !== origin || !e.data || e.data.isaw !== "embed-height") return;
    var f = frames[e.data.id];
    if (f && e.data.height > 0) f.style.height = Math.max(120, e.data.height) + "px";
  });

  function run() { Array.prototype.forEach.call(document.querySelectorAll("[data-isaw-embed]"), build); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run); else run();
  window.ISAWEmbed = { run: run };
})();
