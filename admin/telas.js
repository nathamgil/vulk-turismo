/* Vulk Turismo · painel — Clientes, Embarques, Vendas e Conteúdo do site */
(function () {
  const A = window.ADM, V = window.VULK, e = A.esc;

  /* ======================= CLIENTES ======================= */
  const estCli = { busca: '' };
  A.telas.clientes = {
    titulo: 'Clientes',
    render(el, arg) {
      const cl = A.ler('clientes');
      const q = estCli.busca.trim().toLowerCase();
      const vis = cl.filter((c) => !q || [c.nome, c.whatsapp, c.email, c.cidade, c.passaporte].join(' ').toLowerCase().includes(q)).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
      const alertas = cl.filter((c) => ['vencido', 'vence'].includes(A.passaporte(c).tipo)).length;
      const aniv = cl.filter((c) => { const n = A.diasAniver(c.nascimento); return n != null && n <= 7; }).length;
      el.innerHTML = `
        <div class="cabeca"><div><span class="eyebrow">Carteira</span><h1>Clientes</h1><p>${cl.length} clientes · ${alertas} passaporte(s) pedindo atenção · ${aniv} aniversariante(s) na semana</p></div>
          <div class="acoes"><button class="btn btn-primario" id="cli-novo">${A.ico('mais')}<span>Novo cliente</span></button></div></div>
        <div class="barra-ferr"><label class="busca">${A.ico('busca')}<span class="sr">Buscar cliente</span><input type="search" id="cli-busca" placeholder="Buscar por nome, WhatsApp, e-mail…" value="${e(estCli.busca)}"></label></div>
        <div id="cli-area">${tabelaCli(vis)}</div>`;
      const b = el.querySelector('#cli-busca');
      b.oninput = () => { estCli.busca = b.value; const v2 = cl.filter((c) => [c.nome, c.whatsapp, c.email, c.cidade, c.passaporte].join(' ').toLowerCase().includes(b.value.trim().toLowerCase())); el.querySelector('#cli-area').innerHTML = tabelaCli(v2); ligar(); };
      el.querySelector('#cli-novo').onclick = () => fichaCli(null);
      const ligar = () => el.querySelectorAll('[data-cli]').forEach((tr) => tr.onclick = () => fichaCli(tr.dataset.cli));
      ligar();
      if (arg && A.gavetaAberta !== 'cli:' + arg) fichaCli(arg);
    }
  };
  function tabelaCli(vis) {
    if (!vis.length) return A.vazio('clientes', 'Nenhum cliente encontrado', 'Confira a busca ou cadastre um cliente novo.');
    return `<div class="tabela-caixa"><table class="tabela"><thead><tr><th>Cliente</th><th>WhatsApp</th><th>Aniversário</th><th>Passaporte</th><th>Viagens</th><th>Cidade</th></tr></thead><tbody>
      ${vis.map((c) => { const p = A.passaporte(c), n = A.diasAniver(c.nascimento); return `<tr data-cli="${e(c.id)}">
        <td><span class="cel-nome"><span class="avatar">${e(A.iniciais(c.nome))}</span><span><span class="forte">${e(c.nome)}</span><span class="sub">${e(c.email || '—')}</span></span></span></td>
        <td>${A.telFmt(c.whatsapp)}</td>
        <td>${c.nascimento ? A.dataCurta(c.nascimento) + (n <= 7 ? ` <span class="chip chip-ouro">${A.ico('bolo')}${n === 0 ? 'hoje' : 'em ' + n + 'd'}</span>` : '') : '—'}</td>
        <td><span class="chip ${p.cls}">${e(p.rot)}</span></td><td>${c.viagens || 0}</td><td>${e(c.cidade || '—')}</td></tr>`; }).join('')}
    </tbody></table></div>`;
  }

  function fichaCli(id) {
    const cl = A.ler('clientes');
    const orig = id ? cl.find((c) => c.id === id) : null;
    if (id && !orig) return;
    const c = orig ? { ...orig } : { id: '', nome: '', whatsapp: '', email: '', nascimento: '', passaporte: '', passaporteValidade: '', cidade: 'Salvador', obs: '', viagens: 0 };
    const p = A.passaporte(c), n = A.diasAniver(c.nascimento);
    const cots = orig ? A.ler('cotacoes').filter((x) => A.digitos(x.whatsapp) && A.digitos(x.whatsapp) === A.digitos(c.whatsapp)).sort((a, b) => (b.criadaEm || '').localeCompare(a.criadaEm || '')) : [];
    const corpo = `
      ${orig ? `<div class="bloco"><div class="ficha-topo"><span class="avatar g">${e(A.iniciais(c.nome))}</span><div><h3>${e(c.nome)}</h3><p>${A.telFmt(c.whatsapp)} · ${c.viagens || 0} viagem(ns) com a Vulk</p></div></div>
        ${n != null && n <= 7 ? `<div class="aviso-exemplo" style="margin-top:14px">${A.ico('bolo')}<span>${n === 0 ? '<strong>Aniversário hoje!</strong>' : `Aniversário em <strong>${n} dia(s)</strong> (${A.dataCurta(c.nascimento)})`}. Que tal mandar uma mensagem?</span></div>` : ''}
      </div>
      <div class="passaporte"><span class="doc">${A.ico('passaporte')}</span><div style="flex:1;min-width:0"><strong style="color:var(--petroleo)">Passaporte ${c.passaporte ? e(c.passaporte) : 'não cadastrado'}</strong><div style="color:var(--cinza)">${c.passaporteValidade ? 'Validade ' + A.data(c.passaporteValidade) : 'Sem validade informada'}</div></div><span class="chip ${p.cls}">${e(p.rot)}</span></div>` : ''}
      <form id="f-cli" class="bloco" autocomplete="off"><h3>Dados</h3><div class="grade-form">
        <label class="campo inteiro"><span>Nome completo</span><input type="text" name="nome" value="${e(c.nome)}" required></label>
        <label class="campo"><span>WhatsApp</span><input type="tel" name="whatsapp" value="${e(A.telFmt(c.whatsapp) === '—' ? '' : A.telFmt(c.whatsapp))}" placeholder="(71) 9 0000-0000"></label>
        <label class="campo"><span>E-mail</span><input type="email" name="email" value="${e(c.email)}"></label>
        <label class="campo"><span>Nascimento</span><input type="date" name="nascimento" value="${e(c.nascimento)}"></label>
        <label class="campo"><span>Cidade</span><input type="text" name="cidade" value="${e(c.cidade)}"></label>
        <label class="campo"><span>Nº do passaporte</span><input type="text" name="passaporte" value="${e(c.passaporte)}"></label>
        <label class="campo"><span>Validade do passaporte</span><input type="date" name="passaporteValidade" value="${e(c.passaporteValidade)}"></label>
        <label class="campo"><span>Viagens com a Vulk</span><input type="number" min="0" name="viagens" value="${c.viagens || 0}"></label>
        <label class="campo inteiro"><span>Observações</span><textarea name="obs" placeholder="Preferências, restrições, família…">${e(c.obs)}</textarea></label>
      </div></form>
      ${orig ? `<div class="bloco"><h3>Histórico de cotações (${cots.length})</h3>${cots.length ? `<div class="hist-cot">${cots.map((x) => `<button data-cot="${e(x.id)}"><span class="rota-mini">${e(A.rotaTxt(x))}</span><span style="flex:1;color:var(--cinza)">${A.data(x.ida)}${x.valor ? ' · ' + A.brl(x.valor) : ''}</span>${A.stPill(x.status)}</button>`).join('')}</div>` : '<p style="color:var(--cinza)">Nenhuma cotação com este WhatsApp.</p>'}</div>
      <div class="acoes"><button class="btn btn-perigo" id="cli-del">${A.ico('lixo')}<span>Excluir cliente</span></button></div>` : ''}`;
    const pe = `<button class="btn btn-primario" id="cli-salvar">${A.ico('check')}<span>Salvar</span></button>
      ${orig && c.whatsapp ? `<a class="btn btn-zap" target="_blank" rel="noopener" href="${A.zap(c.whatsapp, n != null && n <= 7 ? A.textoParabens(c) : `Olá, ${A.primeiroNome(c.nome)}! Aqui é da Vulk Turismo.`)}">${A.ico('zap')}<span>${n != null && n <= 7 ? 'Mandar parabéns' : 'WhatsApp'}</span></a>` : ''}
      <button class="btn" data-cancelar>Fechar</button>`;
    A.abrirGaveta({ titulo: orig ? 'Ficha do cliente' : 'Novo cliente', corpo, pe, chave: 'cli:' + (id || 'novo'), aoAbrir: (g) => {
      g.querySelector('[data-cancelar]').onclick = A.fecharGaveta;
      g.querySelectorAll('[data-cot]').forEach((b) => b.onclick = () => { location.hash = '#/cotacoes'; setTimeout(() => A.abrirCotacao(b.dataset.cot), 30); });
      g.querySelector('#cli-salvar').onclick = () => {
        const f = g.querySelector('#f-cli');
        const d = Object.fromEntries(new FormData(f));
        if (!d.nome.trim()) { f.querySelector('[name=nome]').focus(); A.toast('Informe o nome', 'alerta'); return; }
        Object.assign(c, d, { nome: d.nome.trim(), whatsapp: A.digitos(d.whatsapp), viagens: Number(d.viagens) || 0 });
        const l = A.ler('clientes');
        if (orig) l[l.findIndex((x) => x.id === orig.id)] = c; else { c.id = V.uid('k'); l.unshift(c); }
        A.gravar('clientes', l); A.toast('Cliente salvo', 'usuario');
        if (location.hash !== '#/clientes') history.replaceState(null, '', '#/clientes');
        A.atualizar(); fichaCli(c.id);
      };
      const del = g.querySelector('#cli-del');
      if (del) del.onclick = async () => {
        if (!(await A.confirmar('Excluir cliente?', `A ficha de <strong>${e(c.nome)}</strong> será apagada. As cotações continuam no funil.`, 'Excluir', true))) return;
        A.gravar('clientes', A.ler('clientes').filter((x) => x.id !== c.id)); A.fecharGaveta(); A.toast('Cliente excluído', 'lixo');
        history.replaceState(null, '', '#/clientes'); A.atualizar();
      };
    } });
    if (!orig) setTimeout(() => document.querySelector('#f-cli [name=nome]').focus(), 60);
  }

  /* ======================= EMBARQUES ======================= */
  const CHECK = [['passaporte', 'Documentos'], ['seguro', 'Seguro viagem'], ['voucher', 'Voucher enviado'], ['checkin', 'Check-in feito']];
  const zapEmb = (x) => x.whatsapp || (A.ler('clientes').find((c) => c.nome === x.cliente) || {}).whatsapp || '';
  A.telas.embarques = {
    titulo: 'Embarques',
    render(el) {
      const em = A.ler('embarques').map((x) => ({ ...x, n: A.diasAte(x.data) })).sort((a, b) => a.n - b.n);
      const prox = em.filter((x) => x.n >= 0), pass = em.filter((x) => x.n < 0).reverse();
      const pend = prox.filter((x) => CHECK.some(([k]) => !(x.checklist || {})[k])).length;
      el.innerHTML = `
        <div class="cabeca"><div><span class="eyebrow">Linha do tempo</span><h1>Embarques</h1><p>${prox.length} próximos · ${prox.filter((x) => x.n <= 7).length} nesta semana · ${pend} com checklist pendente</p></div>
          <div class="acoes"><button class="btn btn-primario" id="emb-novo">${A.ico('mais')}<span>Novo embarque</span></button></div></div>
        ${prox.length ? `<div class="linha-tempo">${prox.map(cardEmb).join('')}</div>` : A.vazio('embarques', 'Nenhum embarque marcado', 'Quando uma cotação for fechada, use "Criar embarque" na gaveta da cotação.', '<button class="btn btn-primario" id="emb-novo-2">Novo embarque</button>')}
        ${pass.length ? `<h2 class="secao-tit">Já embarcaram</h2><div class="linha-tempo">${pass.slice(0, 6).map(cardEmb).join('')}</div>` : ''}`;
      el.querySelector('#emb-novo').onclick = () => formEmb(null);
      const n2 = el.querySelector('#emb-novo-2'); if (n2) n2.onclick = () => formEmb(null);
      el.querySelectorAll('.emb').forEach((card) => {
        const id = card.dataset.id;
        card.querySelectorAll('[data-ck]').forEach((cb) => cb.onchange = () => {
          const l = A.ler('embarques'), x = l.find((y) => y.id === id); x.checklist = x.checklist || {}; x.checklist[cb.dataset.ck] = cb.checked; A.gravar('embarques', l);
          const feitos = CHECK.filter(([k]) => x.checklist[k]).length;
          A.toast(feitos === CHECK.length ? `Tudo pronto para ${A.primeiroNome(x.cliente)} embarcar!` : `Checklist atualizado (${feitos}/${CHECK.length})`);
          A.atualizar();
        });
        card.querySelector('[data-ed]').onclick = () => formEmb(id);
      });
    }
  };
  function cardEmb(x) {
    const ck = x.checklist || {}, feitos = CHECK.filter(([k]) => ck[k]).length, pct = Math.round((feitos / CHECK.length) * 100);
    const tel = zapEmb(x);
    const msg = `Olá, ${A.primeiroNome(x.cliente)}! Aqui é da Vulk Turismo. Lembrete: seu embarque para ${x.destino} é ${x.n === 0 ? 'hoje' : x.n === 1 ? 'amanhã' : 'em ' + A.data(x.data)}${x.voo && x.voo !== 'a definir' ? ', voo ' + x.voo : ''}. O check-in online já pode ser feito. Leve documento com foto${/são paulo|brasília|noronha|maragogi|lençóis|salvador/i.test(x.destino) ? '' : ' e passaporte'}. Qualquer dúvida, estamos aqui. Boa viagem! ✈️`;
    const cls = x.n < 0 ? 'passado' : x.n <= 3 ? 'urgente' : '';
    return `<article class="emb ${cls}" data-id="${e(x.id)}">
      <div class="emb-canhoto"><span class="falta">${x.n < 0 ? 'Embarcou' : x.n === 0 ? 'Embarca' : 'Faltam'}</span><span class="n">${x.n === 0 ? 'Hoje' : Math.abs(x.n)}</span><span class="u">${x.n === 0 ? A.data(x.data) : x.n < 0 ? 'dias atrás' : x.n === 1 ? 'dia' : 'dias'}</span></div>
      <div class="emb-corpo">
        <div class="emb-cab"><div><h3>${e(x.destino)}</h3><p>${e(x.cliente)}</p></div>
          <div class="acoes">${tel && x.n >= 0 ? `<a class="btn btn-zap btn-pequeno" target="_blank" rel="noopener" href="${A.zap(tel, msg)}">${A.ico('zap')}<span>Lembrete de check-in</span></a>` : ''}<button class="btn btn-pequeno" data-ed>${A.ico('editar')}<span>Editar</span></button></div></div>
        <div class="emb-info"><span>${A.ico('calendario', ' style="width:15px;height:15px;display:inline;vertical-align:-2px"')} ${A.data(x.data)} · ${e(A.falta(x.n))}</span><span>VOO ${e(String(x.voo || 'a definir').toUpperCase())}</span>${x.cotacao ? `<span>REF ${e('VK-' + String(x.cotacao).replace(/^c/, '').slice(-4).toUpperCase())}</span>` : ''}</div>
        <div class="progresso${pct === 100 ? ' cheio' : ''}"><i style="width:${pct}%"></i></div>
        <div class="prog-rot"><span>Checklist da viagem</span><strong style="color:var(--petroleo)">${feitos} de ${CHECK.length}${pct === 100 ? ' · pronto!' : ''}</strong></div>
        <div class="checks">${CHECK.map(([k, r]) => `<label class="check"><input type="checkbox" data-ck="${k}" ${ck[k] ? 'checked' : ''}><i>${A.ico('check', ' stroke-width="3"')}</i><span>${r}</span></label>`).join('')}</div>
      </div></article>`;
  }
  function formEmb(id) {
    const orig = id ? A.ler('embarques').find((x) => x.id === id) : null;
    const x = orig ? { ...orig } : { cliente: '', whatsapp: '', destino: '', data: '', voo: '', checklist: { passaporte: false, seguro: false, voucher: false, checkin: false } };
    const cli = A.ler('clientes');
    const cx = A.abrirModal(`<h2>${orig ? 'Editar embarque' : 'Novo embarque'}</h2>
      <form id="f-emb" class="grade-form" style="margin-top:16px">
        <label class="campo inteiro"><span>Cliente</span><input type="text" name="cliente" list="lista-cli" value="${e(x.cliente)}" required><datalist id="lista-cli">${cli.map((c) => `<option value="${e(c.nome)}">`).join('')}</datalist></label>
        <label class="campo"><span>Destino</span><input type="text" name="destino" value="${e(x.destino)}" required></label>
        <label class="campo"><span>Data do embarque</span><input type="date" name="data" value="${e(x.data)}" required></label>
        <label class="campo"><span>Voo</span><input type="text" name="voo" value="${e(x.voo === 'a definir' ? '' : x.voo)}" placeholder="Ex.: G3 1580"></label>
        <label class="campo"><span>WhatsApp</span><input type="tel" name="whatsapp" value="${e(x.whatsapp ? A.telFmt(x.whatsapp) : '')}" placeholder="Puxa da ficha se vazio"></label>
      </form>
      <div class="acoes">${orig ? `<button class="btn btn-perigo" data-del style="margin-right:auto">${A.ico('lixo')}<span>Excluir</span></button>` : ''}<button class="btn" data-n>Cancelar</button><button class="btn btn-primario" type="submit" form="f-emb">Salvar</button></div>`);
    cx.querySelector('[data-n]').onclick = A.fecharModal;
    cx.querySelector('#f-emb').onsubmit = (ev) => {
      ev.preventDefault();
      const d = Object.fromEntries(new FormData(ev.target));
      const k = cli.find((c) => c.nome === d.cliente.trim());
      Object.assign(x, { cliente: d.cliente.trim(), destino: d.destino.trim(), data: d.data, voo: d.voo.trim() || 'a definir', whatsapp: A.digitos(d.whatsapp) || (k ? k.whatsapp : '') });
      const l = A.ler('embarques');
      if (orig) l[l.findIndex((y) => y.id === orig.id)] = x; else { x.id = V.uid('e'); l.push(x); }
      A.gravar('embarques', l); A.fecharModal(); A.toast('Embarque salvo', 'embarques'); A.atualizar();
    };
    const del = cx.querySelector('[data-del]');
    if (del) del.onclick = async () => {
      A.fecharModal();
      if (!(await A.confirmar('Excluir embarque?', `O embarque de <strong>${e(x.cliente)}</strong> para ${e(x.destino)} sai da linha do tempo.`, 'Excluir', true))) return;
      A.gravar('embarques', A.ler('embarques').filter((y) => y.id !== id)); A.toast('Embarque excluído', 'lixo'); A.atualizar();
    };
  }

  /* ======================= VENDAS ======================= */
  A.telas.vendas = {
    titulo: 'Vendas',
    render(el) {
      const cfg = A.ler('vendasMeta'), ym = A.mesAtual();
      const fech = A.fechadasNoMes(ym), total = fech.reduce((s, c) => s + (Number(c.valor) || 0), 0);
      const pct = cfg.meta ? Math.min(100, (total / cfg.meta) * 100) : 0;
      const com = total * (Number(cfg.comissao) || 0) / 100;
      const h = A.hoje(), diasMes = new Date(h.getFullYear(), h.getMonth() + 1, 0).getDate(), restam = diasMes - h.getDate();
      // últimos 6 meses
      const hist = A.ler('vendasHist'), todas = A.ler('cotacoes').filter((c) => c.status === 'fechada');
      const meses = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(h.getFullYear(), h.getMonth() - i, 1), k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const doMes = todas.filter((c) => A.dataVenda(c).slice(0, 7) === k), hh = hist.find((x) => x.mes === k);
        meses.push({ k, rot: A.MESES[d.getMonth()], total: doMes.reduce((s, c) => s + (Number(c.valor) || 0), 0) + (hh ? hh.total : 0), qtd: doMes.length + (hh ? hh.qtd : 0), atual: i === 0 });
      }
      const porDest = {};
      todas.forEach((c) => { const k = A.cidade(c.destino); porDest[k] = (porDest[k] || 0) + (Number(c.valor) || 0); });
      const dest = Object.entries(porDest).sort((a, b) => b[1] - a[1]);
      const maxD = Math.max(1, ...dest.map((d) => d[1]));
      el.innerHTML = `
        <div class="cabeca"><div><span class="eyebrow">${A.MESES_LONGOS[h.getMonth()]} de ${h.getFullYear()}</span><h1>Vendas</h1><p>Somadas a partir das cotações marcadas como fechadas.</p></div></div>
        <div class="kpis" style="grid-template-columns:repeat(auto-fit,minmax(min(220px,100%),1fr))">
          <div class="kpi destaque"><div class="kpi-rot">Vendido no mês</div><div class="kpi-num">${A.brl(total)}</div><div class="kpi-sub">${fech.length} venda(s) fechada(s)</div></div>
          <div class="kpi"><div class="kpi-rot">Comissão estimada</div><div class="kpi-num">${A.brl(Math.round(com))}</div><div class="kpi-sub">${String(cfg.comissao).replace('.', ',')}% sobre as vendas</div></div>
          <div class="kpi"><div class="kpi-rot">Falta para a meta</div><div class="kpi-num">${A.brl(Math.max(0, cfg.meta - total))}</div><div class="kpi-sub">${restam} dia(s) até o fim do mês</div></div>
        </div>
        <div class="grade g2">
          <section class="painel"><h2 class="painel-tit">Meta do mês</h2>
            <div class="meta-num">${Math.round(cfg.meta ? (total / cfg.meta) * 100 : 0)}%</div>
            <div class="meta-barra${pct >= 100 ? ' batida' : ''}" role="progressbar" aria-valuenow="${Math.round(pct)}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div>
            <p style="color:var(--cinza)">${A.brl(total)} de ${A.brl(cfg.meta)}${pct >= 100 ? ' · <strong style="color:var(--ok)">meta batida!</strong>' : ''}</p>
            <form id="f-meta" class="linha-inline"><label class="campo"><span>Meta do mês (R$)</span><input type="number" name="meta" min="0" step="1000" value="${cfg.meta}"></label><label class="campo" style="max-width:150px"><span>Comissão (%)</span><input type="number" name="comissao" min="0" max="100" step="0.5" value="${cfg.comissao}"></label><button class="btn btn-primario" type="submit">Salvar</button></form>
          </section>
          <section class="painel"><h2 class="painel-tit">Vendas por mês</h2>${grafMeses(meses)}<p style="color:var(--cinza);font-size:.9rem;margin-top:10px">Meses anteriores com valores de demonstração; o mês atual soma as cotações fechadas.</p></section>
          <section class="painel"><h2 class="painel-tit">Vendas por destino</h2>${dest.length ? `<div class="barras-h">${dest.map(([d, v]) => `<div class="bh"><span>${e(d)}</span><div><i style="width:${(v / maxD) * 100}%"></i></div><b>${A.brl(v)}</b></div>`).join('')}</div>` : A.vazio('vendas', 'Sem vendas ainda', 'Feche uma cotação para ver por destino.')}</section>
          <section class="painel"><h2 class="painel-tit">Fechadas este mês</h2>${fech.length ? `<div class="hist-cot">${fech.map((c) => `<button data-cot="${e(c.id)}"><span class="rota-mini">${e(A.rotaTxt(c))}</span><span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${e(c.nome)}</span><strong style="color:var(--petroleo);font-family:var(--serif)">${A.brl(c.valor)}</strong></button>`).join('')}</div>` : A.vazio('vendas', 'Nenhuma venda este mês', 'Arraste uma cotação para "Fechada" no quadro.')}</section>
        </div>`;
      el.querySelector('#f-meta').onsubmit = (ev) => { ev.preventDefault(); const d = Object.fromEntries(new FormData(ev.target)); A.gravar('vendasMeta', { meta: Number(d.meta) || 0, comissao: Number(d.comissao) || 0 }); A.toast('Meta e comissão salvas'); A.atualizar(); };
      el.querySelectorAll('[data-cot]').forEach((b) => b.onclick = () => { location.hash = '#/cotacoes'; setTimeout(() => A.abrirCotacao(b.dataset.cot), 30); });
    }
  };
  function grafMeses(ms) {
    const W = 560, H = 260, pad = { t: 30, b: 34, l: 8, r: 8 };
    const max = Math.max(1, ...ms.map((m) => m.total)) * 1.12;
    const bw = (W - pad.l - pad.r) / ms.length;
    const y = (v) => pad.t + (H - pad.t - pad.b) * (1 - v / max);
    const grade = [0.25, 0.5, 0.75, 1].map((f) => `<line x1="${pad.l}" x2="${W - pad.r}" y1="${y(max * f / 1.12)}" y2="${y(max * f / 1.12)}" stroke="#ece5d8" stroke-dasharray="3 4"/>`).join('');
    const barras = ms.map((m, i) => { const x = pad.l + i * bw + bw * 0.18, w = bw * 0.64, yy = y(m.total); return `<g><rect x="${x}" y="${yy}" width="${w}" height="${Math.max(0, H - pad.b - yy)}" rx="6" fill="${m.atual ? '#b8873c' : '#1a5063'}"><title>${m.rot}: ${A.brl(m.total)} (${m.qtd} vendas)</title></rect>
      <text x="${x + w / 2}" y="${yy - 8}" text-anchor="middle" style="font-size:14px;font-weight:600;fill:#0a2f3a">${A.brlCurto(m.total).replace('R$ ', '')}</text>
      <text x="${x + w / 2}" y="${H - 10}" text-anchor="middle" style="font-size:15px;font-weight:${m.atual ? 700 : 500};fill:${m.atual ? '#8a5f22' : '#4c5c61'}">${m.rot}</text></g>`; }).join('');
    return `<div class="grafico"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Vendas dos últimos 6 meses">${grade}<line x1="${pad.l}" x2="${W - pad.r}" y1="${H - pad.b}" y2="${H - pad.b}" stroke="#ddd3c2" stroke-width="1.5"/>${barras}</svg>
      <div class="legenda"><span><i class="ponto" style="background:#1a5063"></i>Meses anteriores</span><span><i class="ponto" style="background:#b8873c"></i>Mês atual</span></div></div>`;
  }

  /* ======================= CONTEÚDO DO SITE ======================= */
  const estCont = { aba: 'depoimentos' };
  A.telas.conteudo = {
    titulo: 'Conteúdo do site',
    render(el) {
      el.innerHTML = `<div class="cabeca"><div><span class="eyebrow">O que aparece no site</span><h1>Conteúdo do site</h1><p>Mudanças salvas aqui aparecem no site na hora.</p></div>
        <div class="acoes"><a class="btn" href="../index.html" target="_blank" rel="noopener">${A.ico('externo')}<span>Abrir o site</span></a></div></div>
        <div class="abas" role="tablist">${[['depoimentos', 'Depoimentos'], ['destinos', 'Curiosidades de destinos'], ['config', 'Configurações']].map(([k, r]) => `<button role="tab" data-aba="${k}" class="${estCont.aba === k ? 'ativo' : ''}" aria-selected="${estCont.aba === k}">${r}</button>`).join('')}</div>
        <div id="cont-area"></div>`;
      el.querySelectorAll('[data-aba]').forEach((b) => b.onclick = () => { estCont.aba = b.dataset.aba; A.atualizar(); });
      const area = el.querySelector('#cont-area');
      ({ depoimentos: abaDep, destinos: abaDest, config: abaCfg })[estCont.aba](area);
    }
  };
  function abaDep(area) {
    const l = A.ler('depoimentos'), ex = l.filter((d) => d.exemplo).length;
    area.innerHTML = `${ex ? `<div class="alerta-faixa">${A.ico('alerta')}<span><strong>${ex} depoimento(s) de exemplo</strong> estão no site. Troque pelo relato real de um cliente (com autorização) e desmarque "É exemplo".</span></div>` : ''}
      <div class="grade g2">${l.map((d) => `<form class="painel dep" data-id="${e(d.id)}">
        <div class="dep-cab">${d.exemplo ? '<span class="chip chip-alerta">Exemplo</span>' : '<span class="chip chip-ok">Real</span>'}<span class="espaco"></span><label class="toggle"><input type="checkbox" name="publicado" ${d.publicado ? 'checked' : ''}><i></i><span>Publicado</span></label></div>
        <div class="grade-form"><label class="campo"><span>Nome do cliente</span><input type="text" name="nome" value="${e(d.nome)}"></label><label class="campo"><span>Viagem</span><input type="text" name="viagem" value="${e(d.viagem)}"></label>
        <label class="campo inteiro"><span>Depoimento</span><textarea name="texto">${e(d.texto)}</textarea></label></div>
        <label class="toggle"><input type="checkbox" name="exemplo" ${d.exemplo ? 'checked' : ''}><i></i><span>É exemplo (não é de cliente real)</span></label>
        <div class="acoes"><button class="btn btn-primario" type="submit">${A.ico('check')}<span>Salvar</span></button><button class="btn btn-perigo" type="button" data-del>${A.ico('lixo')}<span>Excluir</span></button></div>
      </form>`).join('')}</div>
      <div class="acoes" style="margin-top:20px"><button class="btn btn-primario" id="dep-novo">${A.ico('mais')}<span>Novo depoimento</span></button></div>`;
    area.querySelectorAll('form.dep').forEach((f) => {
      const id = f.dataset.id;
      const salvar = (msg) => { const d = Object.fromEntries(new FormData(f)); const l2 = A.ler('depoimentos'); const x = l2.find((y) => y.id === id); Object.assign(x, { nome: d.nome.trim(), viagem: d.viagem.trim(), texto: d.texto.trim(), publicado: !!d.publicado, exemplo: !!d.exemplo }); A.gravar('depoimentos', l2); A.toast(msg); A.atualizar(); };
      f.onsubmit = (ev) => { ev.preventDefault(); salvar('Depoimento salvo'); };
      f.querySelector('[name=publicado]').onchange = (ev) => salvar(ev.target.checked ? 'Depoimento publicado no site' : 'Depoimento escondido do site');
      f.querySelector('[data-del]').onclick = async () => { if (!(await A.confirmar('Excluir depoimento?', 'Ele sai do site e do painel.', 'Excluir', true))) return; A.gravar('depoimentos', A.ler('depoimentos').filter((y) => y.id !== id)); A.toast('Depoimento excluído', 'lixo'); A.atualizar(); };
    });
    area.querySelector('#dep-novo').onclick = () => { const l2 = A.ler('depoimentos'); l2.push({ id: V.uid('d'), nome: '', viagem: '', texto: '', exemplo: false, publicado: false }); A.gravar('depoimentos', l2); A.atualizar(); setTimeout(() => { const fs = document.querySelectorAll('form.dep'); fs[fs.length - 1].querySelector('[name=nome]').focus(); }, 30); };
  }
  function abaDest(area) {
    const l = A.ler('destinos');
    area.innerHTML = `<p style="color:var(--cinza);margin-bottom:16px">Curiosidades que aparecem no guia de destinos do site (vindas dos posts do Instagram).</p>
      <div class="grade" style="gap:16px">${l.map((d) => `<form class="painel dest-ed" data-id="${e(d.id)}"><img src="../img/${e(d.img)}.jpg" alt="">
        <div class="grade-form"><label class="campo"><span>Lugar</span><input type="text" name="nome" value="${e(d.nome)}"></label><label class="campo"><span>País / região</span><input type="text" name="pais" value="${e(d.pais)}"></label>
        <label class="campo inteiro"><span>Chamada</span><input type="text" name="titulo" value="${e(d.titulo)}"></label>
        <label class="campo inteiro"><span>Texto</span><textarea name="texto">${e(d.texto)}</textarea></label>
        <label class="campo"><span>Foto</span><select name="img">${A.IMAGENS.map((i) => `<option${i === d.img ? ' selected' : ''}>${i}</option>`).join('')}</select></label><label class="campo"><span>Data do post</span><input type="text" name="post" value="${e(d.post || '')}" placeholder="dd/mm/aaaa"></label>
        <div class="acoes inteiro"><button class="btn btn-primario" type="submit">${A.ico('check')}<span>Salvar</span></button></div></div></form>`).join('')}</div>`;
    area.querySelectorAll('form.dest-ed').forEach((f) => {
      f.querySelector('[name=img]').onchange = (ev) => f.querySelector('img').src = `../img/${ev.target.value}.jpg`;
      f.onsubmit = (ev) => { ev.preventDefault(); const d = Object.fromEntries(new FormData(f)); const l2 = A.ler('destinos'); Object.assign(l2.find((y) => y.id === f.dataset.id), d); A.gravar('destinos', l2); A.toast(`"${d.nome}" salvo`); };
    });
  }
  function abaCfg(area) {
    const c = A.ler('config');
    const campos = [['whatsapp', 'WhatsApp (só números, com DDI)', 'tel', 'Número que recebe as cotações do site'], ['telefoneExibicao', 'Telefone exibido no site', 'text'], ['email', 'E-mail', 'email'], ['instagram', 'Instagram (sem @)', 'text'], ['endereco', 'Endereço', 'text'], ['bairro', 'Bairro / cidade', 'text'], ['cep', 'CEP', 'text'], ['horario', 'Horário de atendimento', 'text'], ['slogan', 'Slogan', 'text']];
    area.innerHTML = `<div class="grade g2" style="align-items:start">
      <form class="painel" id="f-cfg"><h2 class="painel-tit">Dados da agência</h2><div class="grade-form">${campos.map(([k, r, t, dica]) => `<label class="campo${['endereco', 'slogan', 'horario'].includes(k) ? ' inteiro' : ''}"><span>${r}</span><input type="${t}" name="${k}" value="${e(c[k] || '')}">${dica ? `<small>${dica}</small>` : ''}</label>`).join('')}</div>
        <div class="acoes" style="margin-top:18px"><button class="btn btn-primario" type="submit">${A.ico('check')}<span>Salvar configurações</span></button></div></form>
      <div class="grade" style="gap:20px">
        <section class="painel"><h2 class="painel-tit">A confirmar com a Vulk</h2><ul style="padding-left:20px;color:var(--tinta);display:grid;gap:6px">
          <li>WhatsApp oficial: o site antigo mostra números de DDD 75 e 86.</li><li>E-mail e horário de atendimento.</li><li>Preços dos pacotes (hoje "Sob cotação").</li><li>Depoimentos reais e fotos de clientes viajando.</li></ul></section>
        <section class="painel zona-perigo"><h2 class="painel-tit" style="color:var(--erro)">Restaurar dados de demonstração</h2><p style="color:var(--cinza);margin-bottom:14px">Apaga tudo o que foi mexido neste navegador (cotações, pacotes, clientes, textos) e volta aos dados de exemplo.</p>
          <button class="btn btn-perigo-cheio" id="btn-reset">${A.ico('restaurar')}<span>Restaurar demonstração</span></button></section>
      </div></div>`;
    area.querySelector('#f-cfg').onsubmit = (ev) => {
      ev.preventDefault(); const d = Object.fromEntries(new FormData(ev.target));
      d.whatsapp = A.digitos(d.whatsapp); d.instagram = d.instagram.replace(/^@/, '').trim();
      A.gravar('config', Object.assign(A.ler('config'), d)); A.toast('Configurações salvas');
    };
    area.querySelector('#btn-reset').onclick = async () => {
      if (!(await A.confirmar('Restaurar a demonstração?', 'Todas as alterações feitas neste navegador serão perdidas. <strong>Não dá para desfazer.</strong>', 'Restaurar tudo', true))) return;
      V.resetar(); ['vendasMeta', 'vendasHist'].forEach((k) => { try { localStorage.removeItem('vulk:' + k); } catch (x) {} });
      location.reload();
    };
  }
})();
