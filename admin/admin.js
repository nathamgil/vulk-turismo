/* Vulk Turismo · painel — login de demonstração, navegação e sincronização com o site */
(function () {
  const A = window.ADM, e = A.esc;
  const SESSAO = 'vulk-adm:sessao';
  const ITENS = [
    { id: 'visao', rot: 'Visão geral', curto: 'Início', ico: 'visao' },
    { id: 'cotacoes', rot: 'Cotações', curto: 'Cotações', ico: 'cotacoes' },
    { id: 'pacotes', rot: 'Pacotes', curto: 'Pacotes', ico: 'pacotes' },
    { id: 'clientes', rot: 'Clientes', curto: 'Clientes', ico: 'clientes' },
    { id: 'embarques', rot: 'Embarques', curto: 'Embarques', ico: 'embarques' },
    { id: 'vendas', rot: 'Vendas', curto: 'Vendas', ico: 'vendas' },
    { id: 'conteudo', rot: 'Conteúdo do site', curto: 'Conteúdo', ico: 'conteudo' }
  ];
  const NO_CELULAR = ['visao', 'cotacoes', 'clientes', 'embarques'];
  const $ = (s) => document.querySelector(s);
  let atual = 'visao', arg = null;

  const logado = () => { try { return !!sessionStorage.getItem(SESSAO); } catch (x) { return A._sessao; } };
  function entrar() { try { sessionStorage.setItem(SESSAO, JSON.stringify({ email: 'equipe@vulkturismo.com.br', em: Date.now() })); } catch (x) { A._sessao = true; } iniciar(); }
  async function sair() {
    if (!(await A.confirmar('Sair do painel?', 'Seus dados continuam salvos neste navegador.', 'Sair'))) return;
    try { sessionStorage.removeItem(SESSAO); } catch (x) { A._sessao = false; }
    A.fecharGaveta(); $('#app').hidden = true; $('#login').hidden = false; document.title = 'Entrar · Painel Vulk Turismo';
  }

  function contadores() {
    const cot = A.ler('cotacoes').filter((c) => c.status === 'nova').length;
    const al = A.alertasHoje();
    return { cotacoes: cot ? { n: cot, t: `${cot} nova(s)` } : null, embarques: al.emb.length ? { n: al.emb.length, t: 'nesta semana', alerta: al.emb.some((x) => x.n <= 3) } : null, clientes: al.pass.length + al.aniv.length ? { n: al.pass.length + al.aniv.length, t: 'alertas' } : null };
  }
  function desenharNav() {
    const c = contadores();
    const badge = (id) => c[id] ? `<span class="cont${c[id].alerta ? ' alerta' : ''}" title="${e(c[id].t)}">${c[id].n}</span>` : '';
    $('#nav').innerHTML = ITENS.map((i) => `<a class="nav-item${atual === i.id ? ' ativo' : ''}" href="#/${i.id}"${atual === i.id ? ' aria-current="page"' : ''}><span class="ico">${A.ico(i.ico)}</span><span>${e(i.rot)}</span>${badge(i.id)}<span class="sr">${c[i.id] ? c[i.id].t : ''}</span></a>`).join('');
    const maisAtivo = !NO_CELULAR.includes(atual);
    $('#barra-inferior').innerHTML = ITENS.filter((i) => NO_CELULAR.includes(i.id)).map((i) => `<a class="${atual === i.id ? 'ativo' : ''}" href="#/${i.id}"><span class="ico">${A.ico(i.ico)}</span>${e(i.curto)}${c[i.id] ? `<span class="cont">${c[i.id].n}</span>` : ''}</a>`).join('') +
      `<button type="button" id="btn-mais" class="${maisAtivo ? 'ativo' : ''}" aria-expanded="false"><span class="ico">${A.ico('menu')}</span>Mais</button>`;
    $('#menu-mais').innerHTML = ITENS.filter((i) => !NO_CELULAR.includes(i.id)).map((i) => `<a class="${atual === i.id ? 'ativo' : ''}" href="#/${i.id}"><span class="ico">${A.ico(i.ico)}</span>${e(i.rot)}</a>`).join('') +
      `<a href="../index.html" target="_blank" rel="noopener"><span class="ico">${A.ico('externo')}</span>Ver o site</a>`;
    $('#btn-mais').onclick = (ev) => { ev.stopPropagation(); const m = $('#menu-mais'); m.hidden = !m.hidden; ev.currentTarget.setAttribute('aria-expanded', !m.hidden); };
  }

  function rota() {
    const [, t, a] = (location.hash || '#/visao').split('/');
    atual = A.telas[t] ? t : 'visao'; arg = a ? decodeURIComponent(a) : null;
    $('#menu-mais').hidden = true;
    render(true);
  }
  function render(topo) {
    if (!logado()) return;
    const tela = A.telas[atual];
    document.title = `${tela.titulo} · Painel Vulk Turismo`;
    $('#titulo-mobile').textContent = tela.titulo;
    desenharNav();
    const y = window.scrollY;
    tela.render($('#tela'), topo ? arg : null);
    A.pintarIcones($('#tela'));
    if (topo) { window.scrollTo(0, 0); } else window.scrollTo(0, y);
  }
  A.atualizar = () => render(false);

  function iniciar() {
    $('#login').hidden = true; $('#app').hidden = false;
    A.pintarIcones(document);
    rota();
  }

  /* ---------- Eventos ---------- */
  window.addEventListener('hashchange', () => { if (A.gavetaAberta) A.fecharGaveta(); rota(); });
  $('#form-login').addEventListener('submit', (ev) => { ev.preventDefault(); entrar(); A.toast('Bem-vindo ao painel da Vulk', 'usuario'); });
  $('#btn-sair').onclick = sair;
  $('#btn-sair-m').onclick = sair;
  $('#veu').onclick = A.fecharGaveta;
  document.addEventListener('click', (ev) => { const m = $('#menu-mais'); if (!m.hidden && !ev.target.closest('#menu-mais')) m.hidden = true; });

  /* O site (outra aba) gravou algo: atualiza sem perder o que está sendo digitado */
  let novasAntes = A.ler('cotacoes').filter((c) => c.status === 'nova').length;
  window.addEventListener('storage', (ev) => {
    if (!ev.key || !ev.key.startsWith('vulk:') || !logado()) return;
    if (ev.key === 'vulk:cotacoes') {
      const novas = A.ler('cotacoes').filter((c) => c.status === 'nova').length;
      if (novas > novasAntes) A.toast('Nova cotação recebida pelo site!', 'sino');
      novasAntes = novas;
    }
    const foco = document.activeElement;
    if (foco && foco.closest('#tela') && /INPUT|TEXTAREA|SELECT/.test(foco.tagName)) { desenharNav(); return; }
    A.atualizar();
  });
  window.addEventListener('vulk:mudou', (ev) => { if (ev.detail === 'cotacoes') novasAntes = A.ler('cotacoes').filter((c) => c.status === 'nova').length; });

  if (logado()) iniciar(); else { $('#login').hidden = false; document.title = 'Entrar · Painel Vulk Turismo'; }
})();
