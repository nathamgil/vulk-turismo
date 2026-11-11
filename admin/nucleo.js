/* Vulk Turismo · painel — utilidades comuns (ícones, datas, gaveta, modal, toasts) */
(function () {
  const V = window.VULK;
  const A = (window.ADM = { telas: {} });

  /* ---------- Ícones (traço fino) ---------- */
  const P = {
    visao: '<rect x="3" y="3" width="7.5" height="9" rx="1.5"/><rect x="13.5" y="3" width="7.5" height="5" rx="1.5"/><rect x="13.5" y="11" width="7.5" height="10" rx="1.5"/><rect x="3" y="15" width="7.5" height="6" rx="1.5"/>',
    cotacoes: '<path d="M3 8a2 2 0 0 0 2-2V5h14v1a2 2 0 0 0 2 2v8a2 2 0 0 0-2 2v1H5v-1a2 2 0 0 0-2-2z"/><path d="M14 5v14" stroke-dasharray="2 2.2"/>',
    pacotes: '<path d="M4 8h16v12H4z"/><path d="M9 8V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/><path d="M4 13h16"/>',
    clientes: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.8c1.8.7 3 2.4 3.5 5.2"/>',
    embarques: '<path d="M2.5 19h19"/><path d="m3.4 12.6 2.2-.6 2.4 2.3 3.6-1L8.3 6.6l2.3-.6 5.7 5.3 3.8-1a1.8 1.8 0 0 1 .9 3.5L6.8 17.4a2 2 0 0 1-2-.6z"/>',
    vendas: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    conteudo: '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
    externo: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    sair: '<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 17l-5-5 5-5M5 12h11"/>',
    aviao: '<path d="M21 15.5v-1.8l-8-5V4a1.5 1.5 0 0 0-3 0v4.7l-8 5v1.8l8-2.5V18l-2 1.5V21l3.5-1 3.5 1v-1.5L13 18v-5z" fill="currentColor" stroke="none"/>',
    busca: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    mais: '<path d="M12 5v14M5 12h14"/>',
    fechar: '<path d="M6 6l12 12M18 6 6 18"/>',
    zap: '<path d="M3.5 20.5l1.3-4A8.5 8.5 0 1 1 8 19.6z"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2.2-1-1 .9a5 5 0 0 1-2.6-2.6l.9-1-1-2.2z"/>',
    doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
    usuario: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
    lixo: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    copiar: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
    estrela: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    olho: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    editar: '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/>',
    cima: '<path d="m6 15 6-6 6 6"/>',
    baixo: '<path d="m6 9 6 6 6-6"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    bolo: '<path d="M4 21h16v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2z"/><path d="M4 15.5c1.3 1 2.7 1 4 0s2.7-1 4 0 2.7 1 4 0 2.7-1 4 0M12 11V7"/><path d="M12 3.5c.8.9 1 1.7 0 2.5-1-.8-.8-1.6 0-2.5z"/>',
    passaporte: '<rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="10" r="3.2"/><path d="M8.8 10h6.4M12 6.8c1 .9 1 5.5 0 6.4M12 6.8c-1 .9-1 5.5 0 6.4M9 17h6"/>',
    alerta: '<path d="M12 3 2 20h20z"/><path d="M12 10v4.5M12 17.5v.5"/>',
    kanban: '<rect x="3" y="4" width="5" height="16" rx="1.2"/><rect x="10" y="4" width="5" height="10" rx="1.2"/><rect x="17" y="4" width="4" height="13" rx="1.2"/>',
    lista: '<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.5M3.5 12h.5M3.5 18h.5"/>',
    baixar: '<path d="M12 4v11M7 10l5 5 5-5M4 20h16"/>',
    impressora: '<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>',
    calendario: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    seta: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    restaurar: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
    sino: '<path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>'
  };
  A.ico = (n, extra) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra || ''}>${P[n] || ''}</svg>`;
  A.pintarIcones = (raiz) => (raiz || document).querySelectorAll('[data-ico]').forEach((el) => { if (!el.firstElementChild) el.innerHTML = A.ico(el.dataset.ico); });

  /* ---------- Texto e números ---------- */
  A.esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  A.brl = (v) => v == null || v === '' ? '—' : Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  A.brlCurto = (v) => { v = Number(v) || 0; if (v >= 1e6) return 'R$ ' + (v / 1e6).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' mi'; if (v >= 1e4) return 'R$ ' + Math.round(v / 1e3) + ' mil'; return A.brl(v); };
  A.data = V.fmtData;
  A.digitos = (s) => String(s || '').replace(/\D/g, '');
  A.iniciais = (n) => String(n || '?').split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
  A.zapNum = (n) => { const d = A.digitos(n); return d.length <= 11 ? '55' + d : d; };
  A.zap = (num, texto) => `https://wa.me/${A.zapNum(num)}?text=${encodeURIComponent(texto)}`;
  A.telFmt = (n) => { const d = A.digitos(n).replace(/^55(?=\d{10,11}$)/, ''); return d.length === 11 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}` : d.length === 10 ? `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}` : n || '—'; };
  A.primeiroNome = (n) => String(n || '').split(' ')[0];

  /* ---------- Datas ---------- */
  A.hoje = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  A.isoHoje = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  A.agoraIso = () => { const d = new Date(); return A.isoHoje() + 'T' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
  A.parse = (iso) => { if (!iso) return null; const [a, m, d] = iso.slice(0, 10).split('-').map(Number); return new Date(a, m - 1, d); };
  A.diasAte = (iso) => { const d = A.parse(iso); return d ? Math.round((d - A.hoje()) / 864e5) : null; };
  A.dataHora = (iso) => { if (!iso) return '—'; return A.data(iso) + (iso.length > 10 ? ' · ' + iso.slice(11, 16) : ''); };
  A.ha = (iso) => {
    if (!iso) return '';
    const t = new Date(iso.length > 10 ? iso : iso + 'T12:00');
    const min = Math.max(0, Math.round((Date.now() - t) / 6e4));
    if (min < 1) return 'agora';
    if (min < 60) return `há ${min} min`;
    const h = Math.round(min / 60);
    if (h < 24) return `há ${h} h`;
    const d = Math.round(h / 24);
    if (d === 1) return 'ontem';
    if (d < 30) return `há ${d} dias`;
    return 'há ' + Math.round(d / 30) + (Math.round(d / 30) === 1 ? ' mês' : ' meses');
  };
  A.falta = (n) => n === 0 ? 'hoje' : n === 1 ? 'amanhã' : n > 0 ? `faltam ${n} dias` : n === -1 ? 'ontem' : `há ${-n} dias`;
  A.MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  A.MESES_LONGOS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  A.dataCurta = (iso) => { const d = A.parse(iso); return d ? `${String(d.getDate()).padStart(2, '0')} ${A.MESES[d.getMonth()]}` : '—'; };
  /* Próximo aniversário (dias até), ignorando o ano */
  A.diasAniver = (nasc) => {
    if (!nasc) return null;
    const [, m, d] = nasc.slice(0, 10).split('-').map(Number);
    const h = A.hoje(); let p = new Date(h.getFullYear(), m - 1, d);
    if (p < h) p = new Date(h.getFullYear() + 1, m - 1, d);
    return Math.round((p - h) / 864e5);
  };
  A.idade = (nasc) => { if (!nasc) return null; const n = A.parse(nasc), h = A.hoje(); let i = h.getFullYear() - n.getFullYear(); if (h.getMonth() < n.getMonth() || (h.getMonth() === n.getMonth() && h.getDate() < n.getDate())) i--; return i; };
  /* Selo do passaporte: vencido / < 6 meses / ok */
  A.passaporte = (c) => {
    if (!c.passaporteValidade) return { tipo: 'nenhum', rot: c.passaporte ? 'Validade não informada' : 'Sem passaporte', cls: 'chip-linha' };
    const n = A.diasAte(c.passaporteValidade);
    if (n < 0) return { tipo: 'vencido', rot: 'Vencido', cls: 'chip-erro', n };
    if (n < 183) return { tipo: 'vence', rot: `Vence em ${n} dias`, cls: 'chip-alerta', n };
    return { tipo: 'ok', rot: 'Em dia', cls: 'chip-ok', n };
  };

  /* ---------- Rota / IATA ---------- */
  A.iata = (s) => { const m = /\(([A-Z]{3})\)/.exec(s || ''); return m ? m[1] : String(s || '???').normalize('NFD').replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase(); };
  A.cidade = (s) => String(s || '').replace(/\s*\([A-Z]{3}\)\s*/, '').trim() || '—';
  A.rotaTxt = (c) => `${A.iata(c.origem)} → ${A.iata(c.destino)}`;
  A.rotaHTML = (c) => `<div class="esq"><span class="iata">${A.esc(A.iata(c.origem))}</span><span class="cid">${A.esc(A.cidade(c.origem))}</span></div>
    <span class="tk-aviao">${A.ico('aviao')}</span>
    <div class="dir"><span class="iata">${A.esc(A.iata(c.destino))}</span><span class="cid">${A.esc(A.cidade(c.destino))}</span></div>`;

  /* ---------- Status e canais ---------- */
  A.STATUS = [
    { id: 'nova', rot: 'Nova', cor: '#1f4f8a' },
    { id: 'cotando', rot: 'Cotando', cor: '#b07a12' },
    { id: 'proposta', rot: 'Proposta enviada', cor: '#6b3fa0' },
    { id: 'fechada', rot: 'Fechada', cor: '#22603f' },
    { id: 'perdida', rot: 'Perdida', cor: '#8c817a' }
  ];
  A.statusRot = (id) => (A.STATUS.find((s) => s.id === id) || { rot: id }).rot;
  A.stPill = (id) => `<span class="st-pill st-${A.esc(id)}">${A.esc(A.statusRot(id))}</span>`;
  A.CANAIS = [
    { id: 'site', rot: 'Site', cor: '#0a2f3a' },
    { id: 'instagram', rot: 'Instagram', cor: '#b8873c' },
    { id: 'whatsapp', rot: 'WhatsApp', cor: '#2f8a5a' },
    { id: 'indicação', rot: 'Indicação', cor: '#5b7fa8' },
    { id: 'corporativo', rot: 'Corporativo', cor: '#7a4f8f' }
  ];
  A.canalRot = (id) => (A.CANAIS.find((c) => c.id === id) || { rot: id || 'Site' }).rot;
  A.canalChip = (id) => { const c = A.CANAIS.find((x) => x.id === id) || A.CANAIS[0]; return `<span class="chip" style="background:color-mix(in srgb,${c.cor} 13%,#fff);color:${c.cor === '#b8873c' ? '#8a5f22' : c.cor}">${A.esc(c.rot)}</span>`; };
  A.codCot = (c) => 'VK-' + String(c.id).replace(/^c/, '').slice(-4).toUpperCase();

  A.IMAGENS = ['airport', 'airport-2', 'atacama', 'bariloche', 'buenosaires', 'business', 'business-2', 'cancun', 'fuji', 'hallstatt', 'hillier', 'hotel', 'komodo', 'lencois', 'lisboa', 'map', 'maragogi', 'namibia', 'noronha', 'orlando', 'pamukkale', 'paris', 'passport', 'passport-2', 'porto', 'santiago'];

  /* ---------- Coleções extras do painel (padrão tratado aqui) ---------- */
  A.ler = (n) => {
    if (n === 'vendasMeta') { const v = safe(n); return Object.assign({ meta: 60000, comissao: 10 }, v || {}); }
    if (n === 'vendasHist') { return safe(n) || histPadrao(); }
    return V.ler(n);
  };
  A.gravar = (n, v) => V.gravar(n, v);
  function safe(n) { try { const v = localStorage.getItem('vulk:' + n); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
  /* Vendas dos meses anteriores (fictícias, para o gráfico da demo não começar vazio) */
  function histPadrao() {
    const h = A.hoje(), base = [42800, 51300, 38900, 63200, 55700];
    return base.map((v, i) => { const d = new Date(h.getFullYear(), h.getMonth() - (5 - i), 1); return { mes: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, total: v, qtd: 3 + (i % 3) }; });
  }

  /* ---------- Toasts ---------- */
  A.toast = (msg, ico) => {
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = A.ico(ico || 'check') + `<span>${A.esc(msg)}</span>`;
    document.getElementById('toasts').appendChild(t);
    setTimeout(() => { t.classList.add('sai'); setTimeout(() => t.remove(), 320); }, 2800);
  };

  /* ---------- Gaveta ---------- */
  const gav = () => document.getElementById('gaveta');
  const veu = () => document.getElementById('veu');
  A.gavetaAberta = null;
  A.abrirGaveta = ({ titulo, corpo, pe, larga, chave, aoAbrir }) => {
    const g = gav();
    g.className = 'gaveta' + (larga ? ' larga' : '');
    g.innerHTML = `<div class="gaveta-cab"><h2>${titulo}</h2><button class="btn-icone" data-fechar aria-label="Fechar">${A.ico('fechar')}</button></div>
      <div class="gaveta-corpo">${corpo}</div>${pe ? `<div class="gaveta-pe">${pe}</div>` : ''}`;
    veu().hidden = false;
    g.setAttribute('aria-hidden', 'false');
    A.gavetaAberta = chave || true;
    requestAnimationFrame(() => g.classList.add('aberta'));
    g.querySelector('[data-fechar]').onclick = A.fecharGaveta;
    if (aoAbrir) aoAbrir(g);
    setTimeout(() => g.querySelector('[data-fechar]').focus(), 50);
    return g;
  };
  A.fecharGaveta = () => {
    const g = gav();
    g.classList.remove('aberta');
    g.setAttribute('aria-hidden', 'true');
    veu().hidden = true;
    A.gavetaAberta = null;
  };

  /* ---------- Modal ---------- */
  A.abrirModal = (html, largo) => {
    const m = document.getElementById('modal'), c = document.getElementById('modal-caixa');
    c.className = 'modal-caixa' + (largo ? ' largo' : '');
    c.innerHTML = html;
    m.hidden = false;
    m.onclick = (e) => { if (e.target === m) A.fecharModal(); };
    return c;
  };
  A.fecharModal = () => { document.getElementById('modal').hidden = true; document.getElementById('modal-caixa').innerHTML = ''; };
  A.confirmar = (titulo, texto, rotOk, perigo) => new Promise((res) => {
    const c = A.abrirModal(`<h2>${titulo}</h2><p>${texto}</p><div class="acoes"><button class="btn" data-n>Cancelar</button><button class="btn ${perigo ? 'btn-perigo-cheio' : 'btn-primario'}" data-s>${rotOk || 'Confirmar'}</button></div>`);
    c.querySelector('[data-n]').onclick = () => { A.fecharModal(); res(false); };
    c.querySelector('[data-s]').onclick = () => { A.fecharModal(); res(true); };
    c.querySelector('[data-s]').focus();
  });

  /* ---------- Estado vazio ---------- */
  A.vazio = (ico, tit, txt, botao) => `<div class="vazio"><span class="vazio-ico">${A.ico(ico)}</span><strong>${tit}</strong><span>${txt}</span>${botao || ''}</div>`;

  /* ---------- CSV ---------- */
  A.baixarCSV = (nome, linhas) => {
    const csv = linhas.map((l) => l.map((v) => `"${String(v == null ? '' : v).replace(/"/g, '""')}"`).join(';')).join('\r\n');
    const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = nome; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  /* Escape fecha gaveta/modal */
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!document.getElementById('modal').hidden) A.fecharModal();
    else if (A.gavetaAberta) A.fecharGaveta();
  });
})();
