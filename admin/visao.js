/* Vulk Turismo · painel — Visão geral */
(function () {
  const A = window.ADM, e = A.esc;

  /* Data em que a venda conta (fechadaEm, ou a criação nas cotações antigas) */
  A.dataVenda = (c) => (c.fechadaEm || c.criadaEm || '').slice(0, 10);
  A.mesAtual = () => A.isoHoje().slice(0, 7);
  A.fechadasNoMes = (ym) => A.ler('cotacoes').filter((c) => c.status === 'fechada' && A.dataVenda(c).slice(0, 7) === ym);

  /* Alertas que a equipe precisa ver hoje */
  A.alertasHoje = () => {
    const emb = A.ler('embarques').map((x) => ({ ...x, n: A.diasAte(x.data) })).filter((x) => x.n >= 0 && x.n <= 7).sort((a, b) => a.n - b.n);
    const cli = A.ler('clientes');
    const aniv = cli.map((c) => ({ ...c, n: A.diasAniver(c.nascimento) })).filter((c) => c.n != null && c.n <= 7).sort((a, b) => a.n - b.n);
    const pass = cli.map((c) => ({ ...c, p: A.passaporte(c) })).filter((c) => c.p.tipo === 'vencido' || c.p.tipo === 'vence').sort((a, b) => a.p.n - b.p.n);
    return { emb, aniv, pass };
  };

  function rosca(cot) {
    const dados = A.CANAIS.map((c) => ({ ...c, n: cot.filter((x) => (x.canal || 'site') === c.id).length }));
    const total = dados.reduce((s, d) => s + d.n, 0) || 1;
    const R = 70, C = 2 * Math.PI * R;
    let acc = 0;
    const arcos = dados.filter((d) => d.n).map((d) => {
      const len = (d.n / total) * C, gap = dados.filter((x) => x.n).length > 1 ? 3 : 0;
      const s = `<circle cx="100" cy="100" r="${R}" fill="none" stroke="${d.cor}" stroke-width="30" stroke-dasharray="${Math.max(len - gap, 0)} ${C}" stroke-dashoffset="${-acc}" transform="rotate(-90 100 100)"><title>${e(d.rot)}: ${d.n}</title></circle>`;
      acc += len; return s;
    }).join('');
    const maior = dados.slice().sort((a, b) => b.n - a.n)[0];
    return `<div class="grafico rosca">
      <svg viewBox="0 0 200 200" role="img" aria-label="Cotações por canal">
        <circle cx="100" cy="100" r="${R}" fill="none" stroke="#f2ece0" stroke-width="30"/>${arcos}
        <text x="100" y="98" text-anchor="middle" style="font-family:'Playfair Display',serif;font-size:40px;font-weight:600;fill:#0a2f3a">${cot.length}</text>
        <text x="100" y="122" text-anchor="middle" style="font-size:13px;fill:#4c5c61;letter-spacing:1.5px">COTAÇÕES</text>
      </svg>
      <div class="barras-h" style="gap:10px">${dados.map((d) => `<div class="bh" style="grid-template-columns:minmax(0,1fr) auto"><span style="display:flex;align-items:center;gap:10px"><i class="ponto" style="background:${d.cor}"></i>${e(d.rot)}</span><b>${d.n} <small style="font-family:var(--sans);font-size:.85rem;color:var(--cinza);font-weight:500">${Math.round((d.n / total) * 100)}%</small></b></div>`).join('')}
        <p style="color:var(--cinza);font-size:.92rem;margin-top:4px">${maior && maior.n ? `<strong style="color:var(--petroleo)">${e(maior.rot)}</strong> é o canal que mais traz pedidos.` : ''}</p>
      </div></div>`;
  }

  function hojeHTML(al) {
    const item = (cls, cor, ico, tit, sub, acao) => `<div class="hoje-item ${cls}"><span class="ico-redondo" style="background:${cor[0]};color:${cor[1]}">${A.ico(ico)}</span><span class="txt"><strong>${tit}</strong><small>${sub}</small></span>${acao || ''}</div>`;
    const cli = A.ler('clientes');
    const embs = al.emb.length ? al.emb.map((x) => item(x.n <= 3 ? 'alerta' : '', ['#0a2f3a', '#e3c78f'], 'embarques', `${e(x.cliente)} · ${e(x.destino)}`, `${A.data(x.data)} · <b>${A.falta(x.n)}</b>${x.voo ? ' · voo ' + e(x.voo) : ''}`, `<a class="btn btn-pequeno" href="#/embarques">Abrir</a>`)).join('') : '<p class="hoje-vazio">Nenhum embarque nos próximos 7 dias.</p>';
    const anivs = al.aniv.length ? al.aniv.map((c) => item('', ['#f6ead2', '#8a5f22'], 'bolo', e(c.nome), `${A.dataCurta(c.nascimento)} · ${c.n === 0 ? '<b>é hoje!</b>' : A.falta(c.n)}${A.idade(c.nascimento) != null ? ' · faz ' + (A.idade(c.nascimento) + (c.n === 0 ? 0 : 1)) + ' anos' : ''}`,
      `<a class="btn btn-zap btn-pequeno" target="_blank" rel="noopener" href="${A.zap(c.whatsapp, A.textoParabens(c))}">${A.ico('zap')}<span>Parabéns</span></a>`)).join('') : '<p class="hoje-vazio">Ninguém faz aniversário esta semana.</p>';
    const pass = al.pass.length ? al.pass.map((c) => item(c.p.tipo === 'vencido' ? 'erro' : 'alerta', c.p.tipo === 'vencido' ? ['#a02828', '#fff'] : ['#8a5a00', '#fff'], 'passaporte', e(c.nome), `Passaporte ${c.p.tipo === 'vencido' ? '<b>vencido</b> em ' + A.data(c.passaporteValidade) : 'vence em <b>' + A.data(c.passaporteValidade) + '</b> (' + c.p.n + ' dias)'}`, `<a class="btn btn-pequeno" href="#/clientes/${e(c.id)}">Ver ficha</a>`)).join('') : '<p class="hoje-vazio">Todos os passaportes em dia.</p>';
    void cli;
    return `<div class="hoje-bloco"><h3>${A.ico('embarques', ' style="width:16px;height:16px"')} Embarques nos próximos 7 dias</h3>${embs}</div>
      <div class="hoje-bloco"><h3>${A.ico('bolo', ' style="width:16px;height:16px"')} Aniversariantes da semana</h3>${anivs}</div>
      <div class="hoje-bloco"><h3>${A.ico('passaporte', ' style="width:16px;height:16px"')} Passaportes vencendo em 6 meses</h3>${pass}</div>`;
  }

  A.textoParabens = (c) => `Oi, ${A.primeiroNome(c.nome)}! Aqui é a equipe da Vulk Turismo. Passando para desejar um feliz aniversário, muita saúde e muitas viagens pela frente! ✈️🎉`;

  A.telas.visao = {
    titulo: 'Visão geral',
    render(el) {
      const cot = A.ler('cotacoes');
      const ym = A.mesAtual();
      const fech = A.fechadasNoMes(ym);
      const totalMes = fech.reduce((s, c) => s + (Number(c.valor) || 0), 0);
      const todasFech = cot.filter((c) => c.status === 'fechada');
      const decididas = cot.filter((c) => c.status === 'fechada' || c.status === 'perdida').length;
      const conv = decididas ? Math.round((todasFech.length / decididas) * 100) : 0;
      const ticket = todasFech.length ? todasFech.reduce((s, c) => s + (Number(c.valor) || 0), 0) / todasFech.length : 0;
      const n = (s) => cot.filter((c) => c.status === s).length;
      const andamento = n('cotando') + n('proposta');
      const meta = A.ler('vendasMeta');
      const al = A.alertasHoje();
      const h = new Date(), hora = h.getHours();
      const saud = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';
      const dataLonga = h.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      const maxF = Math.max(1, ...A.STATUS.map((s) => n(s.id)));
      const ultimas = cot.slice().sort((a, b) => (b.criadaEm || '').localeCompare(a.criadaEm || '')).slice(0, 5);
      const urg = al.emb.filter((x) => x.n <= 3).length + al.pass.filter((c) => c.p.tipo === 'vencido').length;

      el.innerHTML = `
      <div class="cabeca"><div><span class="eyebrow">${e(dataLonga.charAt(0).toUpperCase() + dataLonga.slice(1))}</span><h1>${saud}, equipe Vulk</h1>
        <p>${n('nova') ? `Vocês têm <strong>${n('nova')} ${n('nova') === 1 ? 'cotação nova' : 'cotações novas'}</strong> esperando resposta.` : 'Nenhuma cotação nova esperando resposta. Bom trabalho!'}</p></div>
        <div class="acoes"><a class="btn btn-primario" href="#/cotacoes">${A.ico('cotacoes')}<span>Abrir cotações</span></a></div></div>
      ${urg ? `<div class="alerta-faixa">${A.ico('alerta')}<span><strong>Atenção hoje:</strong> ${[al.emb.filter((x) => x.n <= 3).length ? `${al.emb.filter((x) => x.n <= 3).length} embarque(s) em até 3 dias` : '', al.pass.filter((c) => c.p.tipo === 'vencido').length ? 'passaporte vencido de cliente' : ''].filter(Boolean).join(' · ')}. Veja em "Hoje na agência".</span></div>` : ''}
      <div class="kpis">
        <div class="kpi"><div class="kpi-rot">Cotações novas</div><div class="kpi-num">${n('nova')}</div><div class="kpi-sub">aguardando primeiro contato</div></div>
        <div class="kpi"><div class="kpi-rot">Em andamento</div><div class="kpi-num">${andamento}</div><div class="kpi-sub">${n('cotando')} cotando · ${n('proposta')} com proposta</div></div>
        <div class="kpi destaque"><div class="kpi-rot">Vendas em ${A.MESES_LONGOS[h.getMonth()]}</div><div class="kpi-num" title="${A.brl(totalMes)}">${A.brl(totalMes)}</div><div class="kpi-sub">${fech.length} venda(s) · ${meta.meta ? Math.round((totalMes / meta.meta) * 100) + '% da meta' : 'sem meta'}</div></div>
        <div class="kpi"><div class="kpi-rot">Conversão</div><div class="kpi-num">${conv}%</div><div class="kpi-sub">das cotações decididas</div></div>
        <div class="kpi"><div class="kpi-rot">Ticket médio</div><div class="kpi-num">${A.brl(Math.round(ticket))}</div><div class="kpi-sub">por venda fechada</div></div>
      </div>
      <div class="grade g-dash">
        <div class="grade" style="align-content:start">
          <section class="painel"><h2 class="painel-tit">Funil de cotações <a href="#/cotacoes">Ver quadro →</a></h2>
            <div class="funil">${A.STATUS.map((s) => `<a class="funil-linha" href="#/cotacoes"><span>${e(s.rot)}</span><span class="funil-barra"><i style="width:${(n(s.id) / maxF) * 100}%;background:${s.cor}"></i></span><b>${n(s.id)}</b></a>`).join('')}</div>
          </section>
          <section class="painel"><h2 class="painel-tit">Cotações por canal</h2>${rosca(cot)}</section>
          <section class="painel"><h2 class="painel-tit">Últimas cotações <a href="#/cotacoes">Todas →</a></h2>
            ${ultimas.length ? `<div class="tabela-caixa" style="box-shadow:none"><table class="tabela" style="min-width:480px"><thead><tr><th>Cliente</th><th>Rota</th><th>Status</th><th>Recebida</th></tr></thead><tbody>
            ${ultimas.map((c) => `<tr data-cot="${e(c.id)}"><td class="forte">${e(c.nome)}</td><td class="rota-mini">${e(A.rotaTxt(c))}</td><td>${A.stPill(c.status)}</td><td style="white-space:nowrap">${A.ha(c.criadaEm)}</td></tr>`).join('')}
            </tbody></table></div>` : A.vazio('cotacoes', 'Sem cotações ainda', 'Quando alguém pedir orçamento pelo site, aparece aqui.')}
          </section>
        </div>
        <section class="painel" style="align-self:start"><h2 class="painel-tit">Hoje na agência</h2>${hojeHTML(al)}</section>
      </div>`;
      el.querySelectorAll('[data-cot]').forEach((tr) => tr.onclick = () => { location.hash = '#/cotacoes'; setTimeout(() => A.abrirCotacao(tr.dataset.cot), 30); });
    }
  };
})();
