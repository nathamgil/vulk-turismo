/* Vulk Turismo · painel — Cotações (kanban, lista, gaveta, proposta) */
(function () {
  const A = window.ADM, V = window.VULK, e = A.esc;
  const est = { visao: 'kanban', busca: '', canal: '', ord: { campo: 'criadaEm', dir: -1 } };
  try { est.visao = localStorage.getItem('vulk-adm:visaoCot') || 'kanban'; } catch (x) {}

  const lista = () => A.ler('cotacoes');
  const achar = (id) => lista().find((c) => c.id === id);
  function salvar(c) { const l = lista(); const i = l.findIndex((x) => x.id === c.id); if (i >= 0) l[i] = c; else l.unshift(c); A.gravar('cotacoes', l); }
  function nota(c, texto, sistema) { c.notas = c.notas || []; c.notas.unshift({ em: A.agoraIso(), texto, sistema: !!sistema }); }

  A.moverCotacao = (id, novo) => {
    const c = achar(id); if (!c || c.status === novo) return;
    nota(c, `Status: ${A.statusRot(c.status)} → ${A.statusRot(novo)}`, true);
    c.status = novo;
    if (novo === 'fechada') c.fechadaEm = A.agoraIso(); else delete c.fechadaEm;
    salvar(c);
    A.toast(`${A.primeiroNome(c.nome)} movida para "${A.statusRot(novo)}"`);
    A.atualizar();
  };

  function filtradas() {
    const q = est.busca.trim().toLowerCase();
    return lista().filter((c) => (!est.canal || (c.canal || 'site') === est.canal) &&
      (!q || [c.nome, c.origem, c.destino, c.whatsapp, c.obs, A.codCot(c)].join(' ').toLowerCase().includes(q)));
  }

  function card(c) {
    const datas = c.ida ? `${A.dataCurta(c.ida)}${c.volta ? ' – ' + A.dataCurta(c.volta) : ''}` : 'a definir';
    return `<article class="tk" draggable="true" data-id="${e(c.id)}" tabindex="0" aria-label="Cotação de ${e(c.nome)}, ${e(A.rotaTxt(c))}">
      <div class="tk-topo"><span class="tk-cod">${e(A.codCot(c))}</span><span class="tk-tempo">${A.ha(c.criadaEm)}</span></div>
      <div class="tk-nome">${e(c.nome)}</div>
      <div class="tk-rota">${A.rotaHTML(c)}</div>
      <div class="tk-picote"></div>
      <dl class="tk-pe"><div><dt>Datas</dt><dd>${datas}</dd></div><div><dt>Pax</dt><dd>${c.passageiros || 1}</dd></div></dl>
      <div class="tk-base">${A.canalChip(c.canal)}${c.valor ? `<span class="tk-valor">${A.brl(c.valor)}</span>` : '<span class="sem">sem valor</span>'}</div>
      <div class="tk-mover"><label class="sr" for="mv-${e(c.id)}">Mover para</label><select id="mv-${e(c.id)}" data-mover="${e(c.id)}">${A.STATUS.map((s) => `<option value="${s.id}"${s.id === c.status ? ' selected' : ''}>${s.id === c.status ? 'Etapa: ' : 'Mover para: '}${e(s.rot)}</option>`).join('')}</select></div>
    </article>`;
  }

  function kanban(cs) {
    return `<div class="kanban" id="kanban">${A.STATUS.map((s) => {
      const itens = cs.filter((c) => c.status === s.id).sort((a, b) => (b.criadaEm || '').localeCompare(a.criadaEm || ''));
      const soma = itens.reduce((t, c) => t + (Number(c.valor) || 0), 0);
      return `<section class="coluna" data-status="${s.id}" aria-label="${e(s.rot)}">
        <div class="coluna-cab"><i class="ponto" style="background:${s.cor}"></i><h2>${e(s.rot)}</h2><span class="n">${itens.length}</span></div>
        ${soma ? `<div class="coluna-soma">${A.brl(soma)} em ${s.id === 'fechada' ? 'vendas' : 'propostas'}</div>` : ''}
        ${itens.map(card).join('') || `<div class="coluna-vazia">${s.id === 'nova' ? 'Nenhum pedido novo. Os do site caem aqui.' : 'Arraste uma cotação para cá'}</div>`}
      </section>`;
    }).join('')}</div>`;
  }

  function tabela(cs) {
    const { campo, dir } = est.ord;
    const val = (c) => campo === 'rota' ? A.rotaTxt(c) : campo === 'valor' || campo === 'passageiros' ? Number(c[campo]) || 0 : campo === 'status' ? A.STATUS.findIndex((s) => s.id === c.status) : String(c[campo] || '');
    cs = cs.slice().sort((a, b) => { const x = val(a), y = val(b); return (x > y ? 1 : x < y ? -1 : 0) * dir; });
    const th = (k, r) => `<th class="${campo === k ? 'ord' : ''}"><button data-ord="${k}">${r} ${campo === k ? (dir > 0 ? '↑' : '↓') : ''}</button></th>`;
    if (!cs.length) return A.vazio('busca', 'Nada encontrado', 'Tente outra busca ou limpe o filtro de canal.');
    return `<div class="tabela-caixa"><table class="tabela"><thead><tr>${th('nome', 'Cliente')}${th('rota', 'Rota')}${th('ida', 'Ida')}${th('passageiros', 'Pax')}${th('canal', 'Canal')}${th('status', 'Status')}${th('valor', 'Valor')}${th('criadaEm', 'Recebida')}</tr></thead><tbody>
      ${cs.map((c) => `<tr data-abrir="${e(c.id)}"><td><span class="forte">${e(c.nome)}</span><span class="sub">${A.telFmt(c.whatsapp)}</span></td><td class="rota-mini">${e(A.rotaTxt(c))}</td><td>${A.data(c.ida)}</td><td>${c.passageiros || 1}</td><td>${A.canalChip(c.canal)}</td><td>${A.stPill(c.status)}</td><td class="forte">${c.valor ? A.brl(c.valor) : '—'}</td><td>${A.dataHora(c.criadaEm)}<span class="sub">${A.ha(c.criadaEm)}</span></td></tr>`).join('')}
    </tbody></table></div>`;
  }

  function ligarKanban(el) {
    let arrastado = null;
    el.querySelectorAll('.tk').forEach((t) => {
      t.addEventListener('click', (ev) => { if (ev.target.closest('.tk-mover')) return; A.abrirCotacao(t.dataset.id); });
      t.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') A.abrirCotacao(t.dataset.id); });
      t.addEventListener('dragstart', (ev) => { arrastado = t.dataset.id; t.classList.add('arrastando'); ev.dataTransfer.effectAllowed = 'move'; ev.dataTransfer.setData('text/plain', arrastado); });
      t.addEventListener('dragend', () => { t.classList.remove('arrastando'); el.querySelectorAll('.coluna').forEach((c) => c.classList.remove('alvo')); });
    });
    el.querySelectorAll('.coluna').forEach((col) => {
      col.addEventListener('dragover', (ev) => { ev.preventDefault(); col.classList.add('alvo'); });
      col.addEventListener('dragleave', (ev) => { if (!col.contains(ev.relatedTarget)) col.classList.remove('alvo'); });
      col.addEventListener('drop', (ev) => { ev.preventDefault(); col.classList.remove('alvo'); const id = ev.dataTransfer.getData('text/plain') || arrastado; if (id) A.moverCotacao(id, col.dataset.status); });
    });
    el.querySelectorAll('[data-mover]').forEach((s) => s.addEventListener('change', () => A.moverCotacao(s.dataset.mover, s.value)));
  }

  function exportar() {
    const cs = filtradas();
    A.baixarCSV(`cotacoes-vulk-${A.isoHoje()}.csv`, [['Código', 'Recebida em', 'Cliente', 'WhatsApp', 'Canal', 'Tipo', 'Origem', 'Destino', 'Ida', 'Volta', 'Passageiros', 'Bagagem', 'Status', 'Valor (R$)', 'Observações'],
      ...cs.map((c) => [A.codCot(c), A.dataHora(c.criadaEm), c.nome, A.telFmt(c.whatsapp), A.canalRot(c.canal), c.tipo, c.origem, c.destino, A.data(c.ida), c.volta ? A.data(c.volta) : '', c.passageiros, c.bagagem, A.statusRot(c.status), c.valor || '', c.obs || ''])]);
    A.toast(`${cs.length} cotações exportadas em CSV`, 'baixar');
  }

  A.telas.cotacoes = {
    titulo: 'Cotações',
    render(el) {
      const todas = lista(), cs = filtradas();
      const novas = todas.filter((c) => c.status === 'nova').length;
      el.innerHTML = `
        <div class="cabeca"><div><span class="eyebrow">Funil de vendas</span><h1>Cotações</h1><p>${todas.length} pedidos no total · ${novas} ${novas === 1 ? 'nova' : 'novas'} esperando resposta</p></div>
          <div class="acoes"><button class="btn" id="cot-csv">${A.ico('baixar')}<span>Exportar CSV</span></button><button class="btn btn-primario" id="cot-nova">${A.ico('mais')}<span>Nova cotação</span></button></div></div>
        <div class="barra-ferr">
          <label class="busca">${A.ico('busca')}<span class="sr">Buscar</span><input type="search" id="cot-busca" placeholder="Buscar cliente, destino, código…" value="${e(est.busca)}"></label>
          <select id="cot-canal" style="width:auto;min-width:190px" aria-label="Filtrar por canal"><option value="">Todos os canais</option>${A.CANAIS.map((c) => `<option value="${e(c.id)}"${est.canal === c.id ? ' selected' : ''}>${e(c.rot)}</option>`).join('')}</select>
          <span class="espaco"></span>
          <div class="segmento" role="group" aria-label="Modo de visualização"><button data-vis="kanban" class="${est.visao === 'kanban' ? 'ativo' : ''}">${A.ico('kanban')}Quadro</button><button data-vis="lista" class="${est.visao === 'lista' ? 'ativo' : ''}">${A.ico('lista')}Lista</button></div>
        </div>
        <div id="cot-area">${est.visao === 'kanban' ? kanban(cs) : tabela(cs)}</div>
        ${est.visao === 'kanban' ? '<p style="color:var(--cinza);margin-top:10px;font-size:.95rem">Dica: arraste o bilhete entre as colunas, ou use o seletor "Mover para" no celular. Clique para abrir os detalhes.</p>' : ''}`;
      const area = el.querySelector('#cot-area');
      if (est.visao === 'kanban') ligarKanban(area);
      else {
        area.querySelectorAll('[data-abrir]').forEach((tr) => tr.onclick = () => A.abrirCotacao(tr.dataset.abrir));
        area.querySelectorAll('[data-ord]').forEach((b) => b.onclick = () => { const k = b.dataset.ord; est.ord = { campo: k, dir: est.ord.campo === k ? -est.ord.dir : 1 }; A.atualizar(); });
      }
      const busca = el.querySelector('#cot-busca');
      busca.oninput = () => { est.busca = busca.value; const a = el.querySelector('#cot-area'); a.innerHTML = est.visao === 'kanban' ? kanban(filtradas()) : tabela(filtradas()); est.visao === 'kanban' ? ligarKanban(a) : (a.querySelectorAll('[data-abrir]').forEach((tr) => tr.onclick = () => A.abrirCotacao(tr.dataset.abrir)), a.querySelectorAll('[data-ord]').forEach((b) => b.onclick = () => { const k = b.dataset.ord; est.ord = { campo: k, dir: est.ord.campo === k ? -est.ord.dir : 1 }; A.atualizar(); })); };
      el.querySelector('#cot-canal').onchange = (ev) => { est.canal = ev.target.value; A.atualizar(); };
      el.querySelectorAll('[data-vis]').forEach((b) => b.onclick = () => { est.visao = b.dataset.vis; try { localStorage.setItem('vulk-adm:visaoCot', est.visao); } catch (x) {} A.atualizar(); });
      el.querySelector('#cot-csv').onclick = exportar;
      el.querySelector('#cot-nova').onclick = novaCotacao;
    }
  };

  /* ---------- Gaveta da cotação ---------- */
  A.abrirCotacao = (id) => {
    const c = achar(id); if (!c) return;
    const cli = A.ler('clientes').find((k) => A.digitos(k.whatsapp) === A.digitos(c.whatsapp));
    const pac = c.pacote ? A.ler('pacotes').find((p) => p.id === c.pacote) : null;
    const temEmb = A.ler('embarques').some((x) => x.cotacao === c.id);
    const notas = (c.notas || []);
    const corpo = `
      <div class="bilhete-g">
        <div class="bg-topo"><span>Cotação ${e(A.codCot(c))}</span><span>${e(c.tipo || 'Ida e volta')}</span></div>
        <div class="bg-rota">${A.rotaHTML(c)}</div>
        <dl class="bg-pe"><div><dt>Ida</dt><dd>${A.data(c.ida)}</dd></div><div><dt>Volta</dt><dd>${c.volta ? A.data(c.volta) : '—'}</dd></div><div><dt>Passageiros</dt><dd>${c.passageiros || 1}</dd></div><div><dt>Bagagem</dt><dd>${e(c.bagagem || '—')}</dd></div></dl>
      </div>
      <div class="bloco"><h3>Andamento</h3>
        <div class="grade-form">
          <label class="campo"><span>Etapa</span><select id="g-status">${A.STATUS.map((s) => `<option value="${s.id}"${s.id === c.status ? ' selected' : ''}>${e(s.rot)}</option>`).join('')}</select></label>
          <label class="campo"><span>Valor da proposta (R$)</span><input type="number" min="0" step="10" id="g-valor" value="${c.valor || ''}" placeholder="Ex.: 14600"></label>
        </div>
        <div class="acoes" style="margin-top:14px"><button class="btn btn-primario" id="g-salvar">${A.ico('check')}<span>Salvar alterações</span></button></div>
      </div>
      <div class="bloco"><h3>Cliente</h3>
        <dl class="dados">
          <div><dt>Nome</dt><dd>${e(c.nome)}</dd></div><div><dt>WhatsApp</dt><dd>${A.telFmt(c.whatsapp)}</dd></div>
          <div><dt>Canal</dt><dd>${A.canalChip(c.canal)}</dd></div><div><dt>Recebida</dt><dd>${A.dataHora(c.criadaEm)} <small style="color:var(--cinza);font-weight:400">(${A.ha(c.criadaEm)})</small></dd></div>
          <div><dt>Horários preferidos</dt><dd>${e((c.horarios || []).join(', ') || '—')}</dd></div><div><dt>Pacote de interesse</dt><dd>${pac ? e(pac.titulo) : '—'}</dd></div>
          <div class="inteiro"><dt>Observações do cliente</dt><dd style="font-weight:500">${e(c.obs || '—')}</dd></div>
          <div class="inteiro"><dt>Cadastro</dt><dd>${cli ? `<a class="link" href="#/clientes/${e(cli.id)}">Ver ficha de ${e(cli.nome)} →</a>` : '<span style="color:var(--cinza);font-weight:500">Ainda não é cliente cadastrado</span>'}</dd></div>
        </dl>
      </div>
      <div class="bloco"><h3>Notas internas</h3>
        <label class="campo"><span class="sr">Nova nota</span><textarea id="g-nota" placeholder="Ex.: liguei, prefere voo direto; mandar opção com TAP…"></textarea></label>
        <div class="acoes" style="margin-top:10px"><button class="btn" id="g-add-nota">${A.ico('mais')}<span>Adicionar nota</span></button></div>
        <div class="notas">${notas.length ? notas.map((n) => `<div class="nota${n.sistema ? ' sistema' : ''}"><time>${A.dataHora(n.em)}</time><p>${e(n.texto)}</p></div>`).join('') : '<p style="color:var(--cinza)">Nenhuma nota ainda. Registre aqui cada contato com o cliente.</p>'}</div>
      </div>
      <div class="acoes"><button class="btn btn-perigo" id="g-excluir">${A.ico('lixo')}<span>Excluir cotação</span></button></div>`;
    const msg = `Olá, ${A.primeiroNome(c.nome)}! Aqui é da Vulk Turismo. Recebemos seu pedido de cotação ${A.cidade(c.origem)} → ${A.cidade(c.destino)}${c.ida ? ' para ' + A.data(c.ida) : ''}${c.passageiros ? ' (' + c.passageiros + (c.passageiros > 1 ? ' passageiros' : ' passageiro') + ')' : ''}. Já estamos preparando as melhores opções para você. Posso confirmar alguns detalhes?`;
    const pe = `<a class="btn btn-zap" target="_blank" rel="noopener" href="${A.zap(c.whatsapp, msg)}">${A.ico('zap')}<span>Responder no WhatsApp</span></a>
      <button class="btn btn-ouro" id="g-proposta">${A.ico('doc')}<span>Gerar proposta</span></button>
      ${cli ? '' : `<button class="btn" id="g-cliente">${A.ico('usuario')}<span>Converter em cliente</span></button>`}
      ${c.status === 'fechada' && !temEmb ? `<button class="btn btn-primario" id="g-embarque">${A.ico('embarques')}<span>Criar embarque</span></button>` : ''}
      ${temEmb ? `<a class="btn" href="#/embarques">${A.ico('embarques')}<span>Ver embarque</span></a>` : ''}`;
    A.abrirGaveta({ titulo: e(c.nome), corpo, pe, chave: 'cot:' + c.id, aoAbrir: (g) => {
      g.querySelector('#g-salvar').onclick = () => {
        const x = achar(id), st = g.querySelector('#g-status').value, v = g.querySelector('#g-valor').value;
        const novoV = v === '' ? null : Number(v);
        if (x.valor !== novoV) nota(x, `Valor da proposta: ${novoV ? A.brl(novoV) : 'removido'}`, true);
        if (x.status !== st) { nota(x, `Status: ${A.statusRot(x.status)} → ${A.statusRot(st)}`, true); x.status = st; if (st === 'fechada') x.fechadaEm = A.agoraIso(); else delete x.fechadaEm; }
        x.valor = novoV; salvar(x); A.toast('Cotação salva'); A.atualizar(); A.abrirCotacao(id);
      };
      g.querySelector('#g-add-nota').onclick = () => {
        const t = g.querySelector('#g-nota').value.trim(); if (!t) { g.querySelector('#g-nota').focus(); return; }
        const x = achar(id); nota(x, t); salvar(x); A.toast('Nota adicionada'); A.abrirCotacao(id);
      };
      g.querySelector('#g-proposta').onclick = () => A.gerarProposta(achar(id));
      const bc = g.querySelector('#g-cliente'); if (bc) bc.onclick = () => converter(achar(id));
      const be = g.querySelector('#g-embarque'); if (be) be.onclick = () => criarEmbarque(achar(id));
      g.querySelector('#g-excluir').onclick = async () => {
        if (!(await A.confirmar('Excluir cotação?', `A cotação de <strong>${e(c.nome)}</strong> (${e(A.rotaTxt(c))}) será removida do painel.`, 'Excluir', true))) return;
        A.gravar('cotacoes', lista().filter((x) => x.id !== id)); A.fecharGaveta(); A.toast('Cotação excluída', 'lixo'); A.atualizar();
      };
    } });
  };

  function converter(c) {
    const cl = A.ler('clientes');
    const novo = { id: V.uid('k'), nome: c.nome, whatsapp: A.digitos(c.whatsapp), email: '', nascimento: '', passaporte: '', passaporteValidade: '', cidade: 'Salvador', obs: `Cadastrado a partir da cotação ${A.codCot(c)} (${A.rotaTxt(c)})`, viagens: c.status === 'fechada' ? 1 : 0 };
    cl.unshift(novo); A.gravar('clientes', cl);
    const x = achar(c.id); nota(x, 'Convertido em cliente cadastrado', true); salvar(x);
    A.toast(`${A.primeiroNome(c.nome)} agora é cliente`, 'usuario'); A.atualizar(); A.abrirCotacao(c.id);
  }

  function criarEmbarque(c) {
    const em = A.ler('embarques');
    em.push({ id: V.uid('e'), cliente: c.nome, whatsapp: A.digitos(c.whatsapp), destino: A.cidade(c.destino), data: c.ida || A.isoHoje(), voo: 'a definir', cotacao: c.id, checklist: { passaporte: false, seguro: false, voucher: false, checkin: false } });
    A.gravar('embarques', em);
    const x = achar(c.id); nota(x, `Embarque criado para ${A.data(c.ida)}`, true); salvar(x);
    A.toast('Embarque criado', 'embarques'); A.atualizar(); A.abrirCotacao(c.id);
  }

  /* ---------- Nova cotação manual (WhatsApp, telefone, balcão) ---------- */
  function novaCotacao() {
    const cx = A.abrirModal(`<h2>Nova cotação</h2><p>Para pedidos que chegaram por WhatsApp, telefone ou na agência.</p>
      <form id="f-nova" class="grade-form" style="margin-top:16px">
        <label class="campo inteiro"><span>Nome do cliente</span><input type="text" name="nome" required></label>
        <label class="campo"><span>WhatsApp</span><input type="tel" name="whatsapp" placeholder="(71) 9 0000-0000" required></label>
        <label class="campo"><span>Canal</span><select name="canal">${A.CANAIS.map((c) => `<option value="${e(c.id)}"${c.id === 'whatsapp' ? ' selected' : ''}>${e(c.rot)}</option>`).join('')}</select></label>
        <label class="campo"><span>Origem</span><input type="text" name="origem" value="Salvador (SSA)"></label>
        <label class="campo"><span>Destino</span><input type="text" name="destino" placeholder="Ex.: Lisboa (LIS)" required></label>
        <label class="campo"><span>Ida</span><input type="date" name="ida"></label>
        <label class="campo"><span>Volta</span><input type="date" name="volta"></label>
        <label class="campo"><span>Passageiros</span><input type="number" name="passageiros" min="1" value="1"></label>
        <label class="campo"><span>Bagagem</span><select name="bagagem"><option>Despachada</option><option>Somente de mão</option></select></label>
        <label class="campo inteiro"><span>Observações</span><textarea name="obs"></textarea></label>
      </form>
      <div class="acoes"><button class="btn" data-n>Cancelar</button><button class="btn btn-primario" form="f-nova" type="submit">Criar cotação</button></div>`);
    cx.querySelector('[data-n]').onclick = A.fecharModal;
    cx.querySelector('#f-nova').onsubmit = (ev) => {
      ev.preventDefault();
      const f = Object.fromEntries(new FormData(ev.target));
      const c = { id: V.uid('c'), criadaEm: A.agoraIso(), nome: f.nome.trim(), whatsapp: A.digitos(f.whatsapp), tipo: f.volta ? 'Ida e volta' : 'Somente ida', origem: f.origem, destino: f.destino, ida: f.ida, volta: f.volta, passageiros: Number(f.passageiros) || 1, bagagem: f.bagagem, horarios: [], obs: f.obs, status: 'nova', valor: null, canal: f.canal, notas: [{ em: A.agoraIso(), texto: 'Cotação cadastrada manualmente no painel', sistema: true }] };
      salvar(c); A.fecharModal(); A.toast('Cotação criada'); A.atualizar();
    };
    setTimeout(() => cx.querySelector('[name=nome]').focus(), 30);
  }

  /* ---------- Proposta imprimível ---------- */
  A.gerarProposta = (c) => {
    const cfg = A.ler('config');
    const pac = c.pacote ? A.ler('pacotes').find((p) => p.id === c.pacote) : null;
    const itens = pac && pac.inclui && pac.inclui.length ? pac.inclui : ['Passagem aérea ' + (c.volta ? 'ida e volta' : 'só ida'), 'Taxas de embarque inclusas', `Bagagem ${String(c.bagagem || 'despachada').toLowerCase()}`, 'Seguro viagem', 'Assessoria Vulk antes e durante a viagem'];
    const validade = new Date(); validade.setDate(validade.getDate() + 5);
    const valIso = `${validade.getFullYear()}-${String(validade.getMonth() + 1).padStart(2, '0')}-${String(validade.getDate()).padStart(2, '0')}`;
    const noites = c.ida && c.volta ? Math.round((A.parse(c.volta) - A.parse(c.ida)) / 864e5) : null;
    const doc = `<article class="prop">
      <header class="prop-cab"><span class="lg"><img src="../img/logo.png" alt="Vulk Turismo"></span><div class="doc-id">Proposta de viagem<b>${e(A.codCot(c))}</b>Emitida em ${A.data(A.isoHoje())}</div></header>
      <div class="prop-corpo">
        <h1 contenteditable="true">${pac ? e(pac.titulo) : 'Sua viagem para ' + e(A.cidade(c.destino))}</h1>
        <p class="prop-sub" contenteditable="true">Preparada para <strong>${e(c.nome)}</strong> · ${c.passageiros || 1} ${c.passageiros > 1 ? 'passageiros' : 'passageiro'}</p>
        <div class="prop-rota">${A.rotaHTML(c)}</div>
        <dl class="prop-grade"><div><dt>Ida</dt><dd>${A.data(c.ida)}</dd></div><div><dt>Volta</dt><dd>${c.volta ? A.data(c.volta) : '—'}</dd></div><div><dt>Duração</dt><dd>${noites != null ? noites + (noites === 1 ? ' noite' : ' noites') : '—'}</dd></div><div><dt>Passageiros</dt><dd>${c.passageiros || 1}</dd></div></dl>
        <h2>O que está incluído</h2>
        <ul contenteditable="true">${itens.map((i) => `<li>${e(i)}</li>`).join('')}</ul>
        ${pac && pac.roteiro && pac.roteiro.length ? `<h2>Roteiro resumido</h2><ul contenteditable="true">${pac.roteiro.slice(0, 8).map((r, i) => `<li><strong>Dia ${i + 1}.</strong> ${e(r)}</li>`).join('')}</ul>` : ''}
        <div class="prop-total"><div><small>Validade da proposta</small><b style="font-size:20px">${A.data(valIso)}</b></div><div class="val"><small>Valor total</small><b contenteditable="true">${c.valor ? A.brl(c.valor) : 'R$ —'}</b></div></div>
        <p class="prop-obs" contenteditable="true">Valores sujeitos à disponibilidade e alteração de tarifa até a emissão. Parcelamento no cartão em até 10x. Para garantir este valor, confirme até a data de validade.</p>
      </div>
      <footer class="prop-pe"><span><strong>${e(cfg.nome)}</strong> · CNPJ ${e(cfg.cnpj || '')}<br>${e(cfg.endereco)} · ${e(cfg.bairro || '')}</span><span style="text-align:right">WhatsApp ${e(cfg.telefoneExibicao)}<br>${e(cfg.email)} · @${e(cfg.instagram)}</span></footer>
    </article>`;
    const cx = A.abrirModal(`<div class="prop-barra"><p><strong style="color:var(--petroleo)">Proposta pronta.</strong> Clique em qualquer texto para ajustar antes de imprimir ou salvar em PDF.</p><button class="btn" data-n>Fechar</button><button class="btn btn-primario" data-print>${A.ico('impressora')}<span>Imprimir / PDF</span></button></div><div class="prop-folha-caixa">${doc}</div>`, true);
    cx.querySelector('[data-n]').onclick = A.fecharModal;
    cx.querySelector('[data-print]').onclick = () => {
      const area = document.getElementById('impressao');
      area.innerHTML = ''; area.appendChild(cx.querySelector('.prop').cloneNode(true));
      const x = achar(c.id); nota(x, 'Proposta gerada' + (c.valor ? ' (' + A.brl(c.valor) + ')' : ''), true); salvar(x);
      window.print();
    };
  };
})();
