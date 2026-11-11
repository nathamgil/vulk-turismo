/* Vulk Turismo — cotação em etapas com prévia de bilhete ao vivo */
(function () {
  const V = window.VULK, S = window.VULK_SITE;
  const $ = (id) => document.getElementById(id);
  const form = $('formCot');
  const etapas = [...form.querySelectorAll('.etapa')];
  const barras = [...form.querySelectorAll('.etapas-nav span')];
  const HORARIOS = ['Madrugada', 'Começo da manhã', 'Manhã', 'Almoço', 'Tarde', 'Noite'];
  const so = (v) => String(v || '').replace(/\D/g, '');
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const hojeISO = (() => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); })();
  let atual = 0;

  $('pAviao').outerHTML = S.ICONE.aviao;
  $('zapCta').href = S.zapLink('Olá, Vulk! Quero ajuda para planejar uma viagem.');
  $('horarios').innerHTML = HORARIOS.map((h) => `<button type="button" class="chip" aria-pressed="false" data-h="${h}">${h}</button>`).join('');
  $('ida').min = hojeISO; $('volta').min = hojeISO;

  // Sugestões de destino a partir dos pacotes publicados
  const pacotes = V.ler('pacotes').filter((p) => p.publicado);
  $('sugestoes').innerHTML = pacotes.map((p) => `<option value="${esc(p.titulo + ', ' + p.destino)}">`).join('');

  // Pré-preenchimento: ?pacote= ou ?destino=
  const qs = new URLSearchParams(location.search);
  let pacoteId = null;
  const pq = qs.get('pacote');
  if (pq) { const p = pacotes.find((x) => x.id === pq); if (p) { pacoteId = p.id; $('destino').value = p.titulo + ', ' + p.destino; $('obs').value = `Interesse no pacote "${p.titulo}" (${p.noites} noites).`; } }
  if (!pacoteId && qs.get('destino')) $('destino').value = qs.get('destino').slice(0, 120);

  // Código de 3 letras para o bilhete
  const IATA = { salvador: 'SSA', 'são paulo': 'GRU', 'sao paulo': 'GRU', 'rio de janeiro': 'GIG', brasília: 'BSB', brasilia: 'BSB', recife: 'REC', fortaleza: 'FOR', maceió: 'MCZ', maceio: 'MCZ', natal: 'NAT', 'são luís': 'SLZ', lisboa: 'LIS', porto: 'OPO', paris: 'CDG', orlando: 'MCO', miami: 'MIA', 'nova york': 'JFK', cancún: 'CUN', cancun: 'CUN', santiago: 'SCL', bariloche: 'BRC', 'buenos aires': 'EZE', londres: 'LHR', roma: 'FCO', madri: 'MAD', 'fernando de noronha': 'FEN', 'lençóis maranhenses': 'SLZ', maragogi: 'MCZ', tóquio: 'NRT' };
  function codigo(txt) {
    const t = String(txt || '').trim(); if (!t) return '';
    const m = t.match(/\(([A-Za-z]{3})\)/); if (m) return m[1].toUpperCase();
    const low = t.toLowerCase();
    for (const k in IATA) if (low.startsWith(k)) return IATA[k];
    return t.normalize('NFD').replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase();
  }
  const nomeCidade = (t) => String(t || '').replace(/\s*\([^)]*\)\s*/g, ' ').split(',')[0].trim();

  function val() {
    return {
      tipo: form.tipo.value,
      origem: $('origem').value.trim(),
      destino: $('destino').value.trim(),
      ida: $('ida').value,
      volta: form.tipo.value === 'Somente ida' ? '' : $('volta').value,
      bagagem: form.bagagem.value,
      horarios: [...document.querySelectorAll('#horarios .chip[aria-pressed="true"]')].map((b) => b.dataset.h),
      nome: $('nome').value.trim(),
      whatsapp: $('whatsapp').value.trim(),
      passageiros: Math.max(1, parseInt($('passageiros').value, 10) || 1),
      obs: $('obs').value.trim()
    };
  }

  function preencher(id, texto, vazio) {
    const el = $(id); el.textContent = texto || vazio; el.classList.toggle('vazio-campo', !texto);
  }
  function previa() {
    const d = val();
    const soIda = d.tipo === 'Somente ida';
    $('pTipo').textContent = d.tipo + (pacoteId ? ' · pacote' : '');
    preencher('pOrig', codigo(d.origem), '???');
    preencher('pDest', codigo(d.destino), '???');
    preencher('pOrigNome', nomeCidade(d.origem), 'Origem');
    preencher('pDestNome', nomeCidade(d.destino), 'Destino');
    preencher('pIda', d.ida ? V.fmtData(d.ida) : '', '—');
    preencher('pVolta', soIda ? '' : (d.volta ? V.fmtData(d.volta) : ''), soIda ? 'Só ida' : '—');
    $('pBag').textContent = d.bagagem === 'Despachada' ? 'Despachada' : 'Só de mão';
    preencher('pNome', d.nome, 'Seu nome');
    preencher('pHor', d.horarios.length ? (d.horarios.length > 1 ? d.horarios.length + ' faixas' : d.horarios[0]) : '', 'Livre');
    $('pPax').textContent = String(d.passageiros).padStart(2, '0');
    $('campoVolta').style.display = soIda ? 'none' : '';
  }

  // Interações
  form.addEventListener('input', previa);
  form.addEventListener('change', previa);
  $('horarios').addEventListener('click', (e) => {
    const b = e.target.closest('.chip'); if (!b) return;
    b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true'); previa();
  });
  form.querySelectorAll('[data-pax]').forEach((b) => b.addEventListener('click', () => {
    const i = $('passageiros'); i.value = Math.min(99, Math.max(1, (parseInt(i.value, 10) || 1) + Number(b.dataset.pax))); previa();
  }));
  $('whatsapp').addEventListener('input', (e) => {
    const d = so(e.target.value).slice(0, 11);
    e.target.value = d.length > 10 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}` : d.length > 6 ? `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}` : d.length > 2 ? `(${d.slice(0, 2)}) ${d.slice(2)}` : d;
  });
  $('ida').addEventListener('change', () => { $('volta').min = $('ida').value || hojeISO; });

  function validar(n) {
    const d = val(), erros = [];
    const etapa = etapas[n];
    etapa.querySelectorAll('.campo').forEach((c) => c.classList.remove('erro'));
    const marca = (id, msg) => { const c = $(id).closest('.campo'); if (c) c.classList.add('erro'); erros.push(msg); };
    if (n === 1) {
      if (!d.origem) marca('origem', 'Informe a cidade de origem.');
      if (!d.destino) marca('destino', 'Informe o destino (ou “a definir”).');
    }
    if (n === 2) {
      if (!d.ida) marca('ida', 'Escolha a data de ida.');
      else if (d.ida < hojeISO) marca('ida', 'A data de ida já passou.');
      if (d.tipo !== 'Somente ida') {
        if (!d.volta) marca('volta', 'Escolha a data de volta.');
        else if (d.ida && d.volta < d.ida) marca('volta', 'A volta precisa ser depois da ida.');
      }
    }
    if (n === 5) {
      if (d.nome.length < 2) marca('nome', 'Diga seu nome.');
      if (so(d.whatsapp).length < 10) marca('whatsapp', 'WhatsApp com DDD.');
    }
    etapa.querySelector('.msg-erro').textContent = erros.join(' ');
    if (erros.length) { const f = etapa.querySelector('.erro input'); if (f) f.focus(); }
    return !erros.length;
  }

  function mostrar(n, foco) {
    atual = n;
    etapas.forEach((e, i) => e.classList.toggle('atual', i === n));
    barras.forEach((b, i) => b.classList.toggle('feito', i <= n));
    $('voltar').hidden = n === 0;
    $('avancar').textContent = n === etapas.length - 1 ? 'Enviar cotação' : 'Continuar';
    $('avancar').className = 'btn ' + (n === etapas.length - 1 ? 'btn-ouro' : 'btn-petroleo');
    if (foco) {
      const topo = form.getBoundingClientRect().top + scrollY - 110;
      if (scrollY > topo) scrollTo({ top: topo, behavior: 'smooth' });
      const alvo = etapas[n].querySelector('input:not([type=radio]), input:checked, button.chip');
      if (alvo) setTimeout(() => alvo.focus({ preventScroll: true }), 50);
    }
  }
  $('voltar').addEventListener('click', () => mostrar(Math.max(0, atual - 1), true));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validar(atual)) return;
    if (atual < etapas.length - 1) { mostrar(atual + 1, true); return; }
    enviar();
  });

  function enviar() {
    const d = val();
    const dados = {
      nome: d.nome, whatsapp: so(d.whatsapp), tipo: d.tipo, origem: d.origem, destino: d.destino,
      ida: d.ida, volta: d.volta, passageiros: d.passageiros, bagagem: d.bagagem, horarios: d.horarios,
      obs: d.obs, canal: 'site'
    };
    if (pacoteId) dados.pacote = pacoteId;
    const c = S.registrarCotacao(dados);
    const loc = c.id.toUpperCase();
    const linhas = [
      `Olá, Vulk! Quero uma cotação. Código ${loc}`,
      '',
      `✈ ${d.tipo}: ${d.origem} → ${d.destino}`,
      `Ida: ${V.fmtData(d.ida)}` + (d.volta ? ` · Volta: ${V.fmtData(d.volta)}` : ''),
      `Passageiros: ${d.passageiros}`,
      `Bagagem: ${d.bagagem}`,
      `Horário preferido: ${d.horarios.length ? d.horarios.join(', ') : 'sem preferência'}`,
      d.obs ? `Observações: ${d.obs}` : '',
      '',
      `Nome: ${d.nome}`,
      `WhatsApp: ${d.whatsapp}`
    ];
    const url = S.zapLink(linhas.filter((l, i) => l !== '' || (i === 1 || i === 8)).join('\n'));
    window.open(url, '_blank', 'noopener');

    $('colForm').innerHTML = `
      <div class="sucesso" role="status">
        <div class="cab"><span class="mono">Status · Confirmado</span><h2>Cotação <em style="color:var(--ouro-claro)">enviada</em></h2></div>
        <div class="corpo-s">
          <div><div class="mono" style="color:var(--cinza);margin-bottom:8px">Código da cotação · localizador</div><div class="localizador">${esc(loc)}</div></div>
          <p>Obrigado, ${esc(d.nome.split(' ')[0])}. A Vulk recebeu seu pedido para <strong style="color:var(--petroleo)">${esc(d.destino)}</strong> e responde no WhatsApp ${esc(d.whatsapp)} com as opções. Guarde o código para falar sobre essa cotação.</p>
          <div class="acoes">
            <a class="btn btn-zap" href="${url}" target="_blank" rel="noopener">${S.ICONE.zap} Abrir o WhatsApp de novo</a>
            <a class="btn btn-linha" href="pacotes.html">Ver pacotes</a>
          </div>
        </div>
      </div>`;
    document.querySelector('.previa .rotulo-previa').textContent = 'Seu bilhete · ' + loc;
    $('colForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  previa();
  mostrar(0, false);
})();
