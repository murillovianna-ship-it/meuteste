/* =============================================================
 * Dra. Maria Ester Rodrigues, camada de interacao compartilhada
 * Vanilla JS, zero dependencias.
 *
 * SEGURANCA: nunca colocar tokens, chaves de API ou dados
 * sensiveis aqui. Arquivo servido ao cliente, visivel a qualquer um.
 * Apenas informacoes publicas de contato podem ficar em CONFIG.
 *
 * Ordem de execucao: os Custom Elements (components.js) injetam
 * header/footer/cookie via innerHTML no connectedCallback. Este
 * arquivo aguarda a definicao desses elementos antes de ligar os
 * listeners, garantindo que os nós ja existam no DOM.
 * ============================================================= */

(function () {
  "use strict";

  var CONFIG = {
    WHATSAPP_NUMBER: "554591337595",
    EMAIL_FALLBACK: "mariaester.rodrigues@gmail.com",
    COOKIE_KEY: "gpsie_cookie_consent_v1",
    REDUCED_MOTION: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    DESKTOP_BP: 900
  };

  /* ---------------- Utils ---------------- */
  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }
  function on(el, ev, fn, opts) {
    if (el) el.addEventListener(ev, fn, opts || false);
  }
  function safeGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function safeSet(key, val) {
    try { window.localStorage.setItem(key, val); return true; } catch (e) { return false; }
  }

  /* ---------------- Bootstrap ---------------- */
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  /* Aguarda os Custom Elements estarem definidos e montados.
   * Se o browser nao suportar customElements, o fallback inicializa
   * na sequencia normal (paginas ainda funcionam sem os componentes). */
  function whenComponentsReady(fn) {
    if (!("customElements" in window)) { fn(); return; }
    Promise.all([
      customElements.whenDefined("gpsie-header"),
      customElements.whenDefined("gpsie-footer"),
      customElements.whenDefined("gpsie-cookie")
    ]).then(function () {
      /* Um rAF garante que connectedCallback ja escreveu o innerHTML */
      requestAnimationFrame(fn);
    }).catch(function () { fn(); });
  }

  ready(function () {
    whenComponentsReady(function () {
      initMobileNav();
      initHeaderState();
      initSmoothScroll();
      initCookieBanner();
      initFooterReveal();
      initScrollReveal();
    });
    /* Form so existe na pagina de contato; roda sem depender de componentes */
    initContactForm();
  });

  /* ---------------- 1. Menu mobile ---------------- */
  function initMobileNav() {
    var toggle = qs("[data-nav-toggle]");
    var menu = qs("[data-nav-menu]");
    if (!toggle || !menu) return;

    var open = false;

    function setState(next) {
      open = !!next;
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      menu.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    }

    on(toggle, "click", function () { setState(!open); });

    qsa("a", menu).forEach(function (a) {
      on(a, "click", function () { if (open) setState(false); });
    });

    on(document, "keydown", function (e) {
      if (e.key === "Escape" && open) setState(false);
    });

    var rafId = null;
    on(window, "resize", function () {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(function () {
        if (window.innerWidth >= CONFIG.DESKTOP_BP && open) setState(false);
      });
    });
  }

  /* ---------------- 2. Header state (sombra ao rolar) ---------------- */
  function initHeaderState() {
    var header = qs("[data-header]");
    if (!header) return;
    var ticking = false;

    function apply() {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
      ticking = false;
    }

    on(window, "scroll", function () {
      if (!ticking) { requestAnimationFrame(apply); ticking = true; }
    }, { passive: true });

    apply();
  }

  /* ---------------- 3. Smooth scroll com offset do header ---------------- */
  function initSmoothScroll() {
    var header = qs("[data-header]");

    qsa('a[href^="#"]').forEach(function (link) {
      on(link, "click", function (e) {
        var id = link.getAttribute("href");
        if (!id || id === "#" || id.length < 2) return;

        var target;
        try { target = document.querySelector(id); }
        catch (err) { return; }
        if (!target) return;

        e.preventDefault();
        var headerH = header ? header.offsetHeight : 0;
        var top = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
        window.scrollTo({ top: top, behavior: CONFIG.REDUCED_MOTION ? "auto" : "smooth" });
      });
    });
  }

  /* ---------------- 4. Formulario de contato, WhatsApp ---------------- */
  function initContactForm() {
    var form = qs("[data-contact-form]");
    var statusEl = qs("[data-form-status]");
    if (!form) return;

    function setStatus(msg, isError) {
      if (!statusEl) return;
      statusEl.textContent = msg;
      statusEl.classList.toggle("is-error", !!isError);
    }

    function validEmail(v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    }

    on(form, "submit", function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        setStatus("Preencha os campos obrigatórios.", true);
        return;
      }

      var data = new FormData(form);
      var nome = String(data.get("nome") || "").trim();
      var inst = String(data.get("instituicao") || "").trim();
      var email = String(data.get("email") || "").trim();
      var tel = String(data.get("telefone") || "").trim();
      var assunto = String(data.get("assunto") || "").trim();
      var mensagem = String(data.get("mensagem") || "").trim();

      if (!validEmail(email)) {
        setStatus("Informe um e-mail válido.", true);
        return;
      }

      var lines = [
        "Olá! Vim pelo site da Dra. Maria Ester Rodrigues.",
        "",
        "Nome: " + nome,
        inst ? "Instituição: " + inst : null,
        "E-mail: " + email,
        tel ? "Telefone: " + tel : null,
        "Assunto: " + assunto,
        "",
        "Mensagem:",
        mensagem
      ].filter(Boolean);

      var body = lines.join("\n");
      var isPlaceholder = CONFIG.WHATSAPP_NUMBER === "5545999999999";
      var validNumber = /^\d{10,14}$/.test(CONFIG.WHATSAPP_NUMBER);

      if (!isPlaceholder && validNumber) {
        var waUrl = "https://wa.me/" + CONFIG.WHATSAPP_NUMBER + "?text=" + encodeURIComponent(body);
        window.open(waUrl, "_blank", "noopener,noreferrer");
        setStatus("Abrindo WhatsApp em nova aba. Se nada acontecer, verifique bloqueadores de pop-up.");
      } else {
        var subject = "[Site Maria Ester Rodrigues] " + assunto;
        var mailto = "mailto:" + CONFIG.EMAIL_FALLBACK +
          "?subject=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(body);
        window.location.href = mailto;
        setStatus("Abrindo cliente de e-mail.");
      }

      form.reset();
      setTimeout(function () { setStatus(""); }, 8000);
    });
  }

  /* ---------------- 5. Cookie banner (LGPD) ---------------- */
  function initCookieBanner() {
    var banner = qs("[data-cookie]");
    if (!banner) return;
    var accept = qs("[data-cookie-accept]");
    var reject = qs("[data-cookie-reject]");

    var current = safeGet(CONFIG.COOKIE_KEY);
    if (current === "accepted" || current === "rejected") return;

    setTimeout(function () {
      banner.hidden = false;
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { banner.classList.add("is-visible"); });
      });
    }, 700);

    function dismiss(value) {
      safeSet(CONFIG.COOKIE_KEY, value);
      banner.classList.remove("is-visible");
      setTimeout(function () { banner.hidden = true; }, 400);
    }

    on(accept, "click", function () { dismiss("accepted"); });
    on(reject, "click", function () { dismiss("rejected"); });
  }

  /* ---------------- 6. Footer reveal (desktop) ----------------
   * Fixa o rodape atras do conteudo e expoe sua altura em --footer-h
   * para o CSS reservar o espaco no <main>. Recalcula em resize e
   * quando o conteudo do footer muda (ResizeObserver). So ativa em
   * viewports >= 1024px; abaixo disso remove a classe e a variavel,
   * devolvendo o fluxo normal (mobile intacto). */
  function initFooterReveal() {
    var footer = qs(".footer");
    if (!footer) return;

    var MIN_W = 1024;

    function apply() {
      if (window.innerWidth >= MIN_W) {
        var h = footer.offsetHeight;
        document.documentElement.style.setProperty("--footer-h", h + "px");
        document.body.classList.add("has-fixed-footer");
      } else {
        document.body.classList.remove("has-fixed-footer");
        document.documentElement.style.removeProperty("--footer-h");
      }
    }

    apply();

    var rafId = null;
    on(window, "resize", function () {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(apply);
    });

    if ("ResizeObserver" in window) {
      new ResizeObserver(function () { apply(); }).observe(footer);
    }
  }

  /* ---------------- 7. Scroll reveal (microinteracao) ----------------
   * Progressive enhancement: elementos .reveal comecam 100% visiveis no
   * HTML (bom para SEO e no-JS). So quando confirmamos suporte a
   * IntersectionObserver e que a pessoa NAO pediu reduced-motion, a
   * classe .reveal--armed e adicionada, tornando o elemento oculto ate
   * entrar na viewport, quando .is-visible o revela com fade + slide. */
  function initScrollReveal() {
    if (CONFIG.REDUCED_MOTION || !("IntersectionObserver" in window)) return;

    var items = qsa(".reveal");
    if (!items.length) return;

    items.forEach(function (el) { el.classList.add("reveal--armed"); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

    items.forEach(function (el) { io.observe(el); });
  }
})();
