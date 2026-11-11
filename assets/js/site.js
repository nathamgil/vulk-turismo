/* Vulk Turismo — partes comuns do site: topo, rodapé, WhatsApp, cards e animações.
   Cada página tem <div id="topo"></div> e <div id="rodape"></div>; este arquivo preenche.
   Para o topo transparente sobre foto, use <body data-topo="transp">. */
(function () {
  const V = window.VULK;
  const cfg = V.ler('config');
  const pagina = (location.pathname.split('/').pop() || 'index.html').replace('.html', '') || 'index';

  const ICONE = {
    aviao: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg>',
    seta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    zap: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z"/></svg>',
    menu: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h10"/></svg>'
  };

  const links = [
    ['index', 'Início'], ['pacotes', 'Pacotes'], ['destinos', 'Destinos'],
    ['corporativo', 'Corporativo'], ['sobre', 'A Vulk'], ['duvidas', 'Dúvidas']
  ];

  function zapLink(texto) {
    return 'https://wa.me/' + cfg.whatsapp + '?text=' + encodeURIComponent(texto || 'Olá, Vulk! Quero planejar uma viagem.');
  }

  function montarTopo() {
    const el = document.getElementById('topo'); if (!el) return;
    const modo = document.body.dataset.topo === 'transp' ? 'transp' : 'sempre';
    el.outerHTML = `
    <header class="topo ${modo}" id="topoSite">
      <div class="wrap">
        <a class="marca" href="index.html" aria-label="Vulk Turismo, início"><img src="img/logo.png" alt="Vulk Turismo"></a>
        <nav id="menu" aria-label="Principal">
          <button class="fechar" aria-label="Fechar menu">×</button>
          ${links.map(([h, t]) => `<a href="${h}.html" class="${pagina === h || (pagina === 'pacote' && h === 'pacotes') ? 'ativo' : ''}">${t}</a>`).join('')}
          <a class="btn btn-ouro cta" href="cotacao.html">Fazer cotação</a>
        </nav>
        <button class="menu-btn" aria-label="Abrir menu" aria-controls="menu">${ICONE.menu}</button>
      </div>
    </header>`;
    const topo = document.getElementById('topoSite');
    const nav = document.getElementById('menu');
    topo.querySelector('.menu-btn').onclick = () => nav.classList.add('aberto');
    nav.querySelector('.fechar').onclick = () => nav.classList.remove('aberto');
    const rolar = () => topo.classList.toggle('solido', scrollY > 60);
    addEventListener('scroll', rolar, { passive: true }); rolar();
  }

  function montarRodape() {
    const el = document.getElementById('rodape'); if (!el) return;
    const anos = new Date().getFullYear() - 2010;
    el.outerHTML = `
    <footer class="rodape-site">
      <div class="wrap">
        <div class="cols">
          <div>
            <img class="logo" src="img/logo.png" alt="Vulk Turismo">
            <p style="margin-top:18px;max-width:30ch">${cfg.slogan} Há ${anos} anos planejando viagens a partir de Salvador.</p>
          </div>
          <div>
            <h4>Navegue</h4>
            ${links.map(([h, t]) => `<a href="${h}.html">${t}</a>`).join('')}
            <a href="cotacao.html">Cotação</a>
          </div>
          <div>
            <h4>Fale com a gente</h4>
            <a href="${zapLink()}" target="_blank" rel="noopener">WhatsApp ${cfg.telefoneExibicao}</a>
            <a href="https://instagram.com/${cfg.instagram}" target="_blank" rel="noopener">@${cfg.instagram}</a>
            <a href="mailto:${cfg.email}">${cfg.email}</a>
          </div>
          <div>
            <h4>Endereço</h4>
            <p>${cfg.endereco}<br>${cfg.bairro}<br>CEP ${cfg.cep}</p>
            <p style="margin-top:10px;font-size:.9rem;color:#8fa6ad">${cfg.horario}</p>
          </div>
        </div>
        <div class="base">
          <span>© ${new Date().getFullYear()} Vulk Turismo LTDA · CNPJ ${cfg.cnpj}</span>
          <span><a href="admin/" style="display:inline">Área da equipe</a> · Site por Zync</span>
        </div>
      </div>
    </footer>
    <a class="zap" href="${zapLink()}" target="_blank" rel="noopener" aria-label="Conversar no WhatsApp">${ICONE.zap}</a>`;
  }

  function cardPacote(p) {
    return `
    <a class="pacote rv" href="pacote.html?id=${p.id}">
      <div class="foto"><img src="img/${p.img}.jpg" alt="${p.titulo}" loading="lazy"><span class="selo">${p.estilo}</span></div>
      <div class="info">
        <h3>${p.titulo}</h3>
        <div class="meta">${p.destino} · ${p.noites} noites</div>
        <p>${p.resumo}</p>
      </div>
      <div class="rodape">
        <div class="preco"><small>${p.preco ? 'a partir de, por pessoa' : 'valor'}</small>${V.fmtBRL(p.preco)}</div>
        <span class="seta">${ICONE.seta}</span>
      </div>
    </a>`;
  }

  function revelar(raiz) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); } }), { threshold: .12 });
    (raiz || document).querySelectorAll('.rv:not(.vis)').forEach((n) => io.observe(n));
  }

  // Grava uma cotação vinda do site para aparecer no painel
  function registrarCotacao(dados) {
    const lista = V.ler('cotacoes');
    const agora = new Date();
    const c = Object.assign({ id: V.uid('c'), criadaEm: agora.toISOString().slice(0, 16), status: 'nova', valor: null, canal: 'site' }, dados);
    lista.unshift(c); V.gravar('cotacoes', lista);
    return c;
  }

  window.VULK_SITE = { cfg, ICONE, zapLink, cardPacote, revelar, registrarCotacao };

  document.addEventListener('DOMContentLoaded', () => { montarTopo(); montarRodape(); revelar(); });
})();
