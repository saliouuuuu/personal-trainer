/* ============================================================
   FILIPPO MONTAGNA — PERSONAL COACH
   Interazioni della landing. Nessuna dipendenza.
   - Reveal del nome in hero all'avvio
   - Scroll reveal con IntersectionObserver
   - Menu overlay + focus trap
   - Micro-interazioni sulle card (alone che segue il puntatore)
   - Parallasse leggera sulla foto hero
   - Form guida -> messaggio WhatsApp precompilato
   Rispetta prefers-reduced-motion.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- CONFIGURAZIONE ----------
     Sostituisci WHATSAPP con il numero reale di Filippo,
     in formato internazionale senza "+" e senza spazi.
     Esempio: "393401234567"
  ------------------------------------- */
  var CONFIG = {
    WHATSAPP: "393000000000",
    INSTAGRAM: "filo_personalcoach"
  };

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ============================================================
     1. Immagini con fallback
     Se la foto reale non è ancora stata caricata nel repo,
     mostra il placeholder grafico invece di un riquadro rotto.
     ============================================================ */
  (function imageFallback() {
    $$("img[data-fallback]").forEach(function (img) {
      var swap = function () {
        var fb = img.getAttribute("data-fallback");
        if (fb && img.src.indexOf(fb) === -1) img.src = fb;
      };
      img.addEventListener("error", swap);
      // Immagine già fallita prima che lo script fosse attivo
      if (img.complete && img.naturalWidth === 0) swap();
    });
  })();

  /* ============================================================
     2. Reveal del nome in hero
     ============================================================ */
  (function heroIntro() {
    var start = function () {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { document.body.classList.add("is-ready"); });
      });
    };
    // Attende i font per evitare che il nome "salti" a caricamento avvenuto
    if (document.fonts && document.fonts.ready) {
      var done = false;
      var go = function () { if (!done) { done = true; start(); } };
      document.fonts.ready.then(go);
      setTimeout(go, 900); // rete lenta: non lasciare l'hero vuoto
    } else {
      start();
    }
  })();

  /* ============================================================
     3. Scroll reveal
     ============================================================ */
  (function scrollReveal() {
    var items = $$("[data-reveal]");
    if (!items.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

    items.forEach(function (el) { io.observe(el); });
  })();

  /* ============================================================
     4. Menu overlay
     ============================================================ */
  (function overlayMenu() {
    var burger = $("#burger");
    var menu = $("#menu");
    if (!burger || !menu) return;

    var lastFocus = null;

    var setState = function (open) {
      menu.classList.toggle("is-open", open);
      menu.setAttribute("aria-hidden", open ? "false" : "true");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Chiudi il menu" : "Apri il menu");
      document.body.classList.toggle("is-locked", open);

      if (open) {
        lastFocus = document.activeElement;
        var first = menu.querySelector("a");
        if (first) setTimeout(function () { first.focus(); }, 120);
      } else if (lastFocus) {
        lastFocus.focus();
      }
    };

    burger.addEventListener("click", function () {
      setState(!menu.classList.contains("is-open"));
    });

    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setState(false);
    });

    document.addEventListener("keydown", function (e) {
      if (!menu.classList.contains("is-open")) return;

      if (e.key === "Escape") { setState(false); return; }

      if (e.key === "Tab") {
        var focusables = [burger].concat($$("a", menu));
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    });
  })();

  /* ============================================================
     5. Nav compatta + CTA fissa allo scroll
     ============================================================ */
  (function scrollChrome() {
    var nav = $("#nav");
    var sticky = $(".stickyCta");
    var ticking = false;

    var update = function () {
      var y = window.pageYOffset;
      if (nav) nav.classList.toggle("is-stuck", y > 60);
      if (sticky) sticky.classList.toggle("is-visible", y > window.innerHeight * 0.85);
      ticking = false;
    };

    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });

    update();
  })();

  /* ============================================================
     6. Parallasse leggera sulla foto hero
     ============================================================ */
  (function heroParallax() {
    var img = $("#heroImg");
    var hero = $(".hero");
    if (!img || !hero || reduceMotion) return;
    if (window.matchMedia("(hover: none)").matches) return; // niente parallasse su touch

    var ticking = false;

    var update = function () {
      var y = window.pageYOffset;
      if (y < window.innerHeight) {
        img.style.transform = "scale(1.06) translate3d(0," + (y * 0.16).toFixed(2) + "px,0)";
      }
      ticking = false;
    };

    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
  })();

  /* ============================================================
     7. Card: alone che segue il puntatore + stato tap su mobile
     ============================================================ */
  (function cardGlow() {
    var cards = $$(".card");
    if (!cards.length) return;

    cards.forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - r.left) + "px");
        card.style.setProperty("--my", (e.clientY - r.top) + "px");
      });

      // Su touch il :hover non esiste: si attiva al tocco
      card.addEventListener("touchstart", function () {
        cards.forEach(function (c) { c.classList.remove("is-tapped"); });
        card.classList.add("is-tapped");
      }, { passive: true });
    });

    document.addEventListener("touchstart", function (e) {
      if (!e.target.closest(".card")) {
        cards.forEach(function (c) { c.classList.remove("is-tapped"); });
      }
    }, { passive: true });
  })();

  /* ============================================================
     8. Link WhatsApp
     ============================================================ */
  var waLink = function (text) {
    return "https://wa.me/" + CONFIG.WHATSAPP + "?text=" + encodeURIComponent(text);
  };

  (function whatsappLinks() {
    var msg = "Ciao Filippo! Ho visto il tuo sito e vorrei parlarti del mio percorso di allenamento.";
    $$("[data-wa]").forEach(function (a) {
      a.href = waLink(msg);
      a.target = "_blank";
      a.rel = "noopener";
    });
  })();

  /* ============================================================
     9. Form guida -> WhatsApp precompilato
     ============================================================ */
  (function guideForm() {
    var form = $("#guideForm");
    if (!form) return;

    var nameInput = $("#guideName");
    var levelInput = $("#guideLevel");

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var nome = (nameInput.value || "").trim();
      if (!nome) {
        nameInput.setAttribute("aria-invalid", "true");
        nameInput.focus();
        return;
      }
      nameInput.removeAttribute("aria-invalid");

      var livello = levelInput.options[levelInput.selectedIndex].value;
      var msg = "Ciao Filippo, sono " + nome + ". " + livello +
                " e vorrei ricevere la guida \"Da dove partire con l'allenamento\".";

      window.open(waLink(msg), "_blank", "noopener");
    });

    nameInput.addEventListener("input", function () {
      nameInput.removeAttribute("aria-invalid");
    });
  })();

  /* ============================================================
     10. Anno corrente nel footer
     ============================================================ */
  (function year() {
    var el = $("#year");
    if (el) el.textContent = new Date().getFullYear();
  })();

})();
