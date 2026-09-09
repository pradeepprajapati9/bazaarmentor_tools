/* BazaarMentor — boot screen, scroll reveal, sticky nav, counters, typing, WhatsApp form */

// WhatsApp number (country code, no + and no spaces).
var WHATSAPP_NUMBER = "919953183126";

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- boot screen --- */
  var boot = document.getElementById("boot");
  if (boot) {
    var fill = boot.querySelector(".b-fill");
    var pct = boot.querySelector(".b-pct");
    var msg = boot.querySelector(".b-msg");
    var lines = [
      "Loading billing engine",
      "Syncing stock ledger",
      "Connecting WhatsApp channel",
      "Ready"
    ];
    if (reduced) {
      boot.classList.add("done");
    } else {
      var p = 0;
      var timer = setInterval(function () {
        p = Math.min(p + Math.random() * 16 + 6, 100);
        fill.style.width = p + "%";
        pct.textContent = Math.round(p) + "%";
        msg.textContent = lines[Math.min(Math.floor(p / 26), lines.length - 1)];
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(function () { boot.classList.add("done"); }, 340);
        }
      }, 190);
      // never trap the visitor if something stalls
      setTimeout(function () { clearInterval(timer); boot.classList.add("done"); }, 4000);
    }
  }

  /* --- reveal on scroll --- */
  var reveals = document.querySelectorAll(".reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* --- sticky navbar --- */
  var nav = document.querySelector(".navbar-bm");
  if (nav) {
    var onScroll = function () { nav.classList.toggle("is-stuck", window.scrollY > 24); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* --- animated counters --- */
  var runCounter = function (el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduced) { el.textContent = target + suffix; return; }
    var start = null, dur = 1400;
    var tick = function (ts) {
      if (!start) start = ts;
      var prog = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - prog, 3))) + suffix;
      if (prog < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    if (!("IntersectionObserver" in window)) {
      counters.forEach(runCounter);
    } else {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { runCounter(entry.target); cio.unobserve(entry.target); }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { cio.observe(el); });
    }
  }

  /* --- typing headline --- */
  var typeEl = document.getElementById("typed");
  if (typeEl) {
    var words = (typeEl.getAttribute("data-words") || "").split("|");
    if (reduced || !words[0]) {
      typeEl.textContent = words[0] || "";
    } else {
      var wi = 0, ci = 0, deleting = false;
      var type = function () {
        var w = words[wi];
        typeEl.textContent = w.substring(0, ci);
        if (!deleting && ci < w.length) { ci++; setTimeout(type, 55); }
        else if (!deleting) { deleting = true; setTimeout(type, 1900); }
        else if (ci > 0) { ci--; setTimeout(type, 26); }
        else { deleting = false; wi = (wi + 1) % words.length; setTimeout(type, 260); }
      };
      type();
    }
  }

  /* --- cursor glow inside cards --- */
  if (!reduced) {
    document.querySelectorAll(".card-bm").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - r.left) + "px");
        card.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }

  /* --- year --- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* --- enquiry form -> WhatsApp --- */
  var form = document.getElementById("enquiryForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var text =
        "Hi BazaarMentor, I saw your website.\n\n" +
        "Name: " + document.getElementById("name").value + "\n" +
        "Business: " + document.getElementById("business").value + "\n" +
        "Need: " + document.getElementById("need").value + "\n\n" +
        document.getElementById("problem").value;
      window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text), "_blank");
    });
  }
})();
