# Dra. Maria Ester Rodrigues, site institucional pessoal

Site pessoal da Dra. Maria Ester Rodrigues, psicóloga, professora e pesquisadora
em Psicologia da Educação e Análise do Comportamento (UNIOESTE, Cascavel PR).

## Arquitetura

Site estatico multipagina, HTML + CSS + JavaScript vanilla. Sem build tooling.

### Paginas
- index.html        Home, apresentacao, areas, destaques
- sobre.html        Perfil, formacao academica, areas de atuacao
- pesquisa.html     Linha de pesquisa no GPSIE e projetos
- publicacoes.html  Livros, artigos (com links) e capitulos
- formacao.html     Extensao: GEACE, oficinas e cursos
- recursos.html     Divulgacao cientifica, entrevistas e lives
- contato.html      Formulario e canais diretos

### Componentes (Web Components, Light DOM)
`assets/js/components.js`: `<gpsie-header active="chave">`, `<gpsie-footer>`, `<gpsie-cookie>`.
Editar menu/rodape em um unico arquivo propaga para as 7 paginas.
(O prefixo `gpsie-` nos custom elements e apenas o nome tecnico das tags,
nao aparece para o usuario final.)

## Paleta
Azul institucional (#2C6E9E) como eixo, vermelho editorial (#C63F42) e amarelo
(#F2C94C) como acentos, branco e gelo como base. Tokens em `:root` no style.css.

## Conteudo
Baseado no documento oficial da cliente (Modelo 2 como base textual,
complementado com dados do Modelo 1). Links de artigos e livros preservados.

## Pendencias antes do deploy
1. Dominio real nos `<link rel="canonical">` e no `sitemap.xml`
   (atualmente `https://mariaesterrodrigues.com.br/`).
2. Foto do hero: `assets/img/coordenacao.{webp,jpg}` (a atual pode ser
   substituida pela foto profissional definitiva).
3. Numero de WhatsApp em `assets/js/main.js` se o formulario for usar WhatsApp;
   hoje o form usa mailto como fallback.
4. Capas de livro: usam mock tipografico na paleta. Se a cliente fornecer
   as capas oficiais em alta resolucao, substituir os elementos `.book__cover`.

## Cache busting
CSS e JS versionados via `?v=N` nas paginas. Incremente N ao publicar mudancas.

---
Feito e produzido por Claw Design.
