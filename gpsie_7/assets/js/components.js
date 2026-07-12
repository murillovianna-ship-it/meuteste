/* =============================================================
 * Dra. Maria Ester Rodrigues, Web Components (Custom Elements, Light DOM)
 * Header, footer e cookie banner reutilizaveis nas 7 paginas.
 *
 * Decisao de arquitetura: Light DOM (sem Shadow DOM) para que o
 * style.css global aplique normalmente nos componentes. O objetivo
 * aqui e reuso de markup, nao encapsulamento de estilo.
 *
 * Uso:
 *   <gpsie-header active="sobre"></gpsie-header>
 *   <gpsie-footer></gpsie-footer>
 *   <gpsie-cookie></gpsie-cookie>
 *
 * O atributo active marca o link atual com aria-current="page".
 * ============================================================= */

(function () {
  "use strict";

  /* ---------------- Definicao de navegacao (fonte unica) ---------------- */
  var NAV_ITEMS = [
    { key: "sobre",       href: "sobre.html",       label: "Sobre" },
    { key: "pesquisa",    href: "pesquisa.html",    label: "Pesquisa" },
    { key: "publicacoes", href: "publicacoes.html", label: "Publicações" },
    { key: "formacao",    href: "formacao.html",    label: "Extensão" },
    { key: "recursos",    href: "recursos.html",    label: "Divulgação" }
  ];

  var LOGO_SVG =
    '<svg viewBox="0 0 44 44" width="44" height="44" aria-hidden="true">' +
    '<circle cx="22" cy="22" r="21" fill="var(--navy)"/>' +
    '<text x="22" y="28" text-anchor="middle" fill="white" font-family="Fraunces, serif" font-size="16" font-weight="500" letter-spacing="0.5">ME</text>' +
    '</svg>';

  /* ---------------- <gpsie-header> ---------------- */
  class GpsieHeader extends HTMLElement {
    connectedCallback() {
      var active = this.getAttribute("active") || "";

      var links = NAV_ITEMS.map(function (item) {
        var current = item.key === active ? ' aria-current="page"' : "";
        return '<li><a href="' + item.href + '"' + current + ">" + item.label + "</a></li>";
      }).join("");

      this.innerHTML =
        '<a class="skip-link" href="#conteudo">Ir para o conteúdo</a>' +
        '<header class="header" data-header>' +
          '<div class="container header__inner">' +
            '<a href="index.html" class="logo" aria-label="Maria Ester Rodrigues, página inicial">' +
              '<span class="logo__mark">' + LOGO_SVG + "</span>" +
              '<span class="logo__text">' +
                '<span class="logo__name">Maria Ester Rodrigues</span>' +
                '<span class="logo__tag">Psicologia &amp; Educação</span>' +
              "</span>" +
            "</a>" +
            '<nav class="nav" aria-label="Navegação principal">' +
              '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-menu" aria-label="Abrir menu" data-nav-toggle>' +
                '<span class="nav-toggle__icon" aria-hidden="true">' +
                  '<svg class="nav-toggle__svg nav-toggle__svg--open" viewBox="0 0 24 24" width="22" height="22"><path d="M4 8h16M4 16h16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"/></svg>' +
                  '<svg class="nav-toggle__svg nav-toggle__svg--close" viewBox="0 0 24 24" width="22" height="22"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"/></svg>' +
                "</span>" +
              "</button>" +
              '<ul class="nav-menu" id="nav-menu" data-nav-menu>' +
                links +
                '<li><a href="contato.html" class="nav-menu__cta">Entrar em contato</a></li>' +
              "</ul>" +
            "</nav>" +
          "</div>" +
        "</header>";
    }
  }

  /* ---------------- <gpsie-footer> ---------------- */
  class GpsieFooter extends HTMLElement {
    connectedCallback() {
      var year = new Date().getFullYear();

      var navLinks = NAV_ITEMS.map(function (item) {
        return '<li><a href="' + item.href + '">' + item.label + "</a></li>";
      }).join("") +
        '<li><a href="trajetoria.html">Trajetória</a></li>' +
        '<li><a href="behaviorismo.html">Behaviorismo</a></li>' +
        '<li><a href="contato.html">Contato</a></li>';

      this.innerHTML =
        '<footer class="footer">' +
          '<div class="container footer__inner">' +
            '<div class="footer__col footer__col--brand">' +
              '<div class="footer__brand">' +
                '<span class="footer__mark" aria-hidden="true">' +
                  '<svg viewBox="0 0 44 44" width="38" height="38">' +
                    '<circle cx="22" cy="22" r="21" fill="none" stroke="var(--border)" stroke-width="1"/>' +
                    '<text x="22" y="28" text-anchor="middle" fill="var(--navy)" font-family="Fraunces, serif" font-size="15" font-weight="500" letter-spacing="0.5">ME</text>' +
                  "</svg>" +
                "</span>" +
                "<div>" +
                  '<p class="footer__name">Maria Ester Rodrigues</p>' +
                  '<p class="footer__desc">Psicóloga, professora e pesquisadora.<br>Psicologia da Educação, Análise do Comportamento e formação docente.</p>' +
                "</div>" +
              "</div>" +
              '<a class="footer__cta" href="contato.html">' +
                "Entrar em contato" +
                '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round"/></svg>' +
              "</a>" +
            "</div>" +
            '<div class="footer__cols">' +
              '<div class="footer__col">' +
                '<p class="footer__title">Navegar</p>' +
                '<ul class="footer__list">' + navLinks + "</ul>" +
              "</div>" +
              '<div class="footer__col">' +
                '<p class="footer__title">Redes</p>' +
                '<ul class="footer__list">' +
                  '<li><a href="https://www.instagram.com/mariaestherrodrigues99/" target="_blank" rel="noopener noreferrer">Instagram pessoal</a></li>' +
                  '<li><a href="https://www.instagram.com/gp.psie/" target="_blank" rel="noopener noreferrer">Instagram GPSIE</a></li>' +
                  '<li><a href="https://www.linkedin.com/in/mariaester99/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>' +
                  '<li><a href="http://lattes.cnpq.br/5988082469441642" target="_blank" rel="noopener noreferrer">Currículo Lattes</a></li>' +
                "</ul>" +
              "</div>" +
            "</div>" +
          "</div>" +
          '<div class="footer__bar">' +
            '<div class="container footer__bar-inner">' +
              '<p class="footer__legal">&copy; ' + year + " Maria Ester Rodrigues. Todos os direitos reservados.</p>" +
              '<div class="footer__credits">' +
                '<span class="footer__credits-text">Feito e produzido por</span>' +
                '<a class="footer__credits-brand" href="https://www.instagram.com/theclawdesign/" target="_blank" rel="noopener noreferrer">Claw Design</a>' +
                '<span class="footer__credits-icons">' +
                  '<a href="https://www.instagram.com/theclawdesign/" target="_blank" rel="noopener noreferrer" aria-label="Instagram do Claw Design">' +
                    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>' +
                  "</a>" +
                  '<a href="https://theclawdesign.com.br" target="_blank" rel="noopener noreferrer" aria-label="Site do Claw Design">' +
                    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18"/></svg>' +
                  "</a>" +
                "</span>" +
              "</div>" +
            "</div>" +
          "</div>" +
        "</footer>";
    }
  }

  /* ---------------- <gpsie-cookie> ---------------- */
  class GpsieCookie extends HTMLElement {
    connectedCallback() {
      this.innerHTML =
        '<div class="cookie" role="dialog" aria-labelledby="cookie-title" aria-describedby="cookie-desc" data-cookie hidden>' +
          '<div class="cookie__inner">' +
            '<div class="cookie__text">' +
              '<p id="cookie-title" class="cookie__title">Este site usa cookies essenciais.</p>' +
              '<p id="cookie-desc" class="cookie__desc">Utilizamos apenas cookies necessários ao funcionamento do site, em conformidade com a LGPD (Lei 13.709/2018). Nenhum dado pessoal é enviado a terceiros.</p>' +
            "</div>" +
            '<div class="cookie__actions">' +
              '<button type="button" class="btn btn--ghost btn--sm" data-cookie-reject>Somente essenciais</button>' +
              '<button type="button" class="btn btn--primary btn--sm" data-cookie-accept>Aceitar</button>' +
            "</div>" +
          "</div>" +
        "</div>";
    }
  }

  /* ---------------- Registro ---------------- */
  if ("customElements" in window) {
    customElements.define("gpsie-header", GpsieHeader);
    customElements.define("gpsie-footer", GpsieFooter);
    customElements.define("gpsie-cookie", GpsieCookie);
  }
})();
