(function () {
  "use strict";

  var header = document.querySelector(".header");
  var navToggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  var navBackdrop = document.getElementById("nav-backdrop");
  var yearEl = document.getElementById("year");
  var form = document.getElementById("contact-form");
  var formStatus = document.getElementById("form-status");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  function onScroll() {
    if (!header) return;
    var threshold = header.classList.contains("header--page") ? 8 : 40;
    header.classList.toggle("is-scrolled", window.scrollY > threshold);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (header && header.classList.contains("header--page")) {
    header.classList.add("is-scrolled");
  }

  function setNavOpen(open) {
    if (!nav || !navToggle) return;
    nav.classList.toggle("is-open", open);
    navToggle.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
    if (navBackdrop) {
      navBackdrop.classList.toggle("is-visible", open);
      navBackdrop.setAttribute("aria-hidden", open ? "false" : "true");
    }
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      setNavOpen(!nav.classList.contains("is-open"));
    });

    if (navBackdrop) {
      navBackdrop.addEventListener("click", function () {
        setNavOpen(false);
      });
    }

    nav.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function () {
        setNavOpen(false);
      });
    });
  }

  /* Intersection Observer — reveal */
  var prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReduced) {
    var revealEls = document.querySelectorAll("[data-reveal]");
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var delay = el.getAttribute("data-reveal-delay");
          if (delay) {
            el.style.transitionDelay = delay + "ms";
          }
          el.classList.add("is-visible");
          io.unobserve(el);
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* Count-up animation */
  function animateCount(el, target, duration) {
    var start = 0;
    var startTime = null;

    function step(ts) {
      if (!startTime) startTime = ts;
      var p = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(start + (target - start) * eased));
      if (p < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  var countEls = document.querySelectorAll("[data-count]");
  if (!prefersReduced && countEls.length) {
    var countIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var target = parseInt(el.getAttribute("data-count"), 10);
          if (!isNaN(target)) {
            animateCount(el, target, 1600);
          }
          countIo.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
    countEls.forEach(function (el) {
      countIo.observe(el);
    });
  } else {
    countEls.forEach(function (el) {
      var t = el.getAttribute("data-count");
      if (t) el.textContent = t;
    });
  }

  /* Contact form — AJAX when PHP available */
  if (form && formStatus) {
    form.addEventListener("submit", function (e) {
      var hp = form.querySelector(".hp");
      if (hp && hp.value !== "") {
        e.preventDefault();
        return;
      }

      if (form.getAttribute("action") && form.getAttribute("action").indexOf(".php") !== -1) {
        e.preventDefault();
        formStatus.textContent = "Sending…";
        formStatus.classList.remove("is-success", "is-error");

        var fd = new FormData(form);
        fetch(form.getAttribute("action"), {
          method: "POST",
          body: fd,
          headers: { Accept: "application/json" },
        })
          .then(function (res) {
            return res.json().catch(function () {
              return { ok: false, message: "Invalid response." };
            });
          })
          .then(function (data) {
            if (data.ok) {
              formStatus.textContent = data.message || "Thank you — we will get back to you shortly.";
              formStatus.classList.add("is-success");
              form.reset();
            } else {
              formStatus.textContent = data.message || "Something went wrong. Please call or WhatsApp us.";
              formStatus.classList.add("is-error");
            }
          })
          .catch(function () {
            formStatus.textContent =
              "Could not send. Please email batoor480@gmail.com or use WhatsApp.";
            formStatus.classList.add("is-error");
          });
      }
    });
  }
})();
