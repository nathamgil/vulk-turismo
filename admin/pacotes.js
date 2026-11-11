/* Vulk Turismo · painel — Pacotes (vitrine do site) */
(function () {
  const A = window.ADM, e = A.esc;
  const est = { filtro: 'todos' };
  const lista = () => A.ler('pacotes');
  const salvarLista = (l) => A.gravar('pacotes', l);
  const slug = (s) => String(s || 'pacote').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'pacote';
  const precoTxt = (p) => p.preco ? 'a partir de ' + A.brl(p.preco) : 'Sob cotação';

  function cardSite(p) {
    return `<div class="pacote"><div class="foto"><img src="../img/${e(p.img || 'map')}.jpg" alt=""><span class="selo">${e(p.estilo || 'Viagem')} · ${p.noites || 0} noites</span></div>
      <div class="info"><h3>${e(p.titulo || 'Título do pacote')}</h3><div class="meta">${e(p.destino || 'Destino')}</div><p>${e(p.resumo || 'Resumo curto que aparece no card do site.')}</p></div>
      <div class="rodape"><div class="preco"><small>${p.preco ? 'A partir de' : 'Valor'}</small>${p.preco ? A.brl(p.preco) : 'Sob cotação'}</div><span class="seta">${A.ico('seta')}</span></div></div>`;
  }

  A.telas.pacotes = {
    titulo: 'Pacotes',
    render(el) {
      const l = lista();
      const pub = l.filter((p) => p.publicado).length;
      const vis = l.filter((p) => est.filtro === 'todos' || (est.filtro === 'pub' ? p.publicado : est.filtro === 'rasc' ? !p.publicado : p.destaque));
      el.innerHTML = `
        <div class="cabeca"><div><span class="eyebrow">Vitrine do site</span><h1>Pacotes</h1><p>${pub} publicados · ${l.length - pub} rascunhos · ${l.filter((p) => p.destaque).length} em destaque na página inicial</p></div>
          <div class="acoes"><a class="btn" href="../pacotes.html" target="_blank" rel="noopener">${A.ico('externo')}<span>Ver vitrine</span></a><button class="btn btn-primario" id="pac-novo">${A.ico('mais')}<span>Novo pacote</span></button></div></div>
        <div class="barra-ferr"><div class="segmento" role="group" aria-label="Filtro">${[['todos', 'Todos'], ['pub', 'Publicados'], ['rasc', 'Rascunhos'], ['dest', 'Destaques']].map(([k, r]) => `<button data-f="${k}" class="${est.filtro === k ? 'ativo' : ''}">${r}</button>`).join('')}</div></div>
        ${vis.length ? `<div class="grade-pac">${vis.map((p) => `
          <article class="pac${p.publicado ? '' : ' rascunho'}" data-id="${e(p.id)}">
            <div class="pac-foto"><img src="../img/${e(p.img || 'map')}.jpg" alt="" loading="lazy">
              <span class="chip ${p.publicado ? 'chip-ok' : 'chip-linha'}" style="${p.publicado ? '' : 'background:#fff'}">${p.publicado ? 'Publicado' : 'Rascunho'}</span>
              <button class="estrela${p.destaque ? ' on' : ''}" data-est aria-pressed="${!!p.destaque}" aria-label="${p.destaque ? 'Tirar dos destaques' : 'Destacar na página inicial'}" title="${p.destaque ? 'Em destaque' : 'Destacar'}">${A.ico('estrela')}</button></div>
            <div class="pac-info"><h3>${e(p.titulo)}</h3><div class="pac-meta">${e(p.destino)} · ${p.noites || 0} noites · ${e(p.regiao === 'internacional' ? 'Internacional' : 'Nacional')}</div><div class="pac-preco">${precoTxt(p)}</div></div>
            <div class="pac-pe"><label class="toggle"><input type="checkbox" data-pub ${p.publicado ? 'checked' : ''}><i></i><span>${p.publicado ? 'No site' : 'Oculto'}</span></label>
              <button class="btn-icone" data-ed aria-label="Editar" title="Editar">${A.ico('editar')}</button>
              <button class="btn-icone" data-dup aria-label="Duplicar" title="Duplicar">${A.ico('copiar')}</button>
              <a class="btn-icone" href="../pacote.html?id=${encodeURIComponent(p.id)}" target="_blank" rel="noopener" aria-label="Ver no site" title="Ver no site">${A.ico('externo')}</a>
              <button class="btn-icone" data-del aria-label="Excluir" title="Excluir" style="color:var(--erro)">${A.ico('lixo')}</button></div>
          </article>`).join('')}</div>` : A.vazio('pacotes', 'Nenhum pacote neste filtro', 'Crie um pacote novo ou mude o filtro acima.', '<button class="btn btn-primario" id="pac-novo-2">Criar pacote</button>')}`;

      el.querySelectorAll('[data-f]').forEach((b) => b.onclick = () => { est.filtro = b.dataset.f; A.atualizar(); });
      el.querySelector('#pac-novo').onclick = () => editar(null);
      const n2 = el.querySelector('#pac-novo-2'); if (n2) n2.onclick = () => editar(null);
      el.querySelectorAll('.pac').forEach((card) => {
        const id = card.dataset.id;
        const mudar = (fn, msg) => { const l2 = lista(); const p = l2.find((x) => x.id === id); fn(p); salvarLista(l2); A.toast(msg(p)); A.atualizar(); };
        card.querySelector('[data-est]').onclick = () => mudar((p) => p.destaque = !p.destaque, (p) => p.destaque ? `"${p.titulo}" em destaque` : `"${p.titulo}" saiu dos destaques`);
        card.querySelector('[data-pub]').onchange = () => mudar((p) => p.publicado = !p.publicado, (p) => p.publicado ? `"${p.titulo}" publicado no site` : `"${p.titulo}" virou rascunho`);
        card.querySelector('[data-ed]').onclick = () => editar(id);
        card.querySelector('.pac-info').style.cursor = 'pointer';
        card.querySelector('.pac-info').onclick = () => editar(id);
        card.querySelector('[data-dup]').onclick = () => {
          const l2 = lista(), p = l2.find((x) => x.id === id);
          const c = JSON.parse(JSON.stringify(p)); c.titulo = p.titulo + ' (cópia)'; c.id = idUnico(slug(c.titulo)); c.publicado = false; c.destaque = false;
          l2.splice(l2.indexOf(p) + 1, 0, c); salvarLista(l2); A.toast('Pacote duplicado como rascunho', 'copiar'); A.atualizar();
        };
        card.querySelector('[data-del]').onclick = async () => {
          const p = lista().find((x) => x.id === id);
          if (!(await A.confirmar('Excluir pacote?', `<strong>${e(p.titulo)}</strong> sai do site e do painel. Se quiser só esconder, desligue "No site".`, 'Excluir pacote', true))) return;
          salvarLista(lista().filter((x) => x.id !== id)); A.toast('Pacote excluído', 'lixo'); A.atualizar();
        };
      });
    }
  };

  function idUnico(base) { const ids = new Set(lista().map((p) => p.id)); let id = base, i = 2; while (ids.has(id)) id = base + '-' + i++; return id; }

  /* ---------- Editor ---------- */
  function editar(id) {
    const orig = id ? lista().find((p) => p.id === id) : null;
    const p = orig ? JSON.parse(JSON.stringify(orig)) : { id: '', titulo: '', destino: '', regiao: 'nacional', estilo: 'Praia', img: 'map', noites: 5, resumo: '', inclui: ['Aéreo saindo de Salvador', 'Hospedagem com café da manhã', 'Seguro viagem'], roteiro: ['Chegada e check-in', 'Dia livre', 'Retorno'], melhorEpoca: '', preco: null, destaque: false, publicado: false };
    const estilos = ['Praia', 'Natureza', 'Cultura', 'Família', 'Lua de mel', 'Neve', 'Aventura', 'Corporativo', 'Cruzeiro'];

    const listaEd = (nome, arr, dias) => arr.map((v, i) => `<div class="linha" data-i="${i}">${dias ? `<span class="dia">Dia ${i + 1}</span>` : ''}<input type="text" data-l="${nome}" data-i="${i}" value="${e(v)}" aria-label="${dias ? 'Dia ' + (i + 1) : 'Item ' + (i + 1)}">
      ${dias ? `<button type="button" class="btn-icone" data-sobe="${i}" aria-label="Subir" ${i === 0 ? 'disabled' : ''}>${A.ico('cima')}</button><button type="button" class="btn-icone" data-desce="${i}" aria-label="Descer" ${i === arr.length - 1 ? 'disabled' : ''}>${A.ico('baixo')}</button>` : ''}
      <button type="button" class="btn-icone" data-rm="${i}" aria-label="Remover" style="color:var(--erro)">${A.ico('fechar')}</button></div>`).join('');

    const corpo = `<div class="editor">
      <form id="f-pac" class="grade" style="gap:18px" autocomplete="off">
        <div class="bloco"><h3>Informações</h3><div class="grade-form">
          <label class="campo inteiro"><span>Título</span><input type="text" name="titulo" value="${e(p.titulo)}" required placeholder="Ex.: Gramado no inverno"></label>
          <label class="campo"><span>Destino</span><input type="text" name="destino" value="${e(p.destino)}" placeholder="Ex.: Rio Grande do Sul, Brasil"></label>
          <label class="campo"><span>Região</span><select name="regiao"><option value="nacional"${p.regiao === 'nacional' ? ' selected' : ''}>Nacional</option><option value="internacional"${p.regiao === 'internacional' ? ' selected' : ''}>Internacional</option></select></label>
          <label class="campo"><span>Estilo</span><select name="estilo">${estilos.concat(estilos.includes(p.estilo) ? [] : [p.estilo]).map((s) => `<option${s === p.estilo ? ' selected' : ''}>${e(s)}</option>`).join('')}</select></label>
          <label class="campo"><span>Noites</span><input type="number" name="noites" min="1" max="60" value="${p.noites || ''}"></label>
          <label class="campo"><span>Preço a partir de (R$)</span><input type="number" name="preco" min="0" step="10" value="${p.preco || ''}" placeholder="Vazio = Sob cotação"><small>Deixe vazio para mostrar "Sob cotação".</small></label>
          <label class="campo"><span>Melhor época</span><input type="text" name="melhorEpoca" value="${e(p.melhorEpoca)}" placeholder="Ex.: Junho a agosto"></label>
          <label class="campo inteiro"><span>Resumo do card</span><textarea name="resumo" maxlength="180" placeholder="Uma ou duas frases.">${e(p.resumo)}</textarea><small><span id="cont-res">${(p.resumo || '').length}</span>/180 caracteres</small></label>
        </div></div>
        <div class="bloco"><h3>Foto</h3><div class="galeria" id="galeria">${A.IMAGENS.map((i) => `<button type="button" data-img="${i}" class="${i === p.img ? 'sel' : ''}" aria-label="Foto ${i}" aria-pressed="${i === p.img}"><img src="../img/${i}.jpg" alt="" loading="lazy"><span>${i}</span></button>`).join('')}</div></div>
        <div class="bloco"><h3>O que inclui</h3><div class="lista-ed" id="ed-inclui">${listaEd('inclui', p.inclui || [])}</div><button type="button" class="btn btn-pequeno" data-add="inclui" style="margin-top:10px">${A.ico('mais')}<span>Adicionar item</span></button></div>
        <div class="bloco"><h3>Roteiro dia a dia</h3><div class="lista-ed" id="ed-roteiro">${listaEd('roteiro', p.roteiro || [], true)}</div><button type="button" class="btn btn-pequeno" data-add="roteiro" style="margin-top:10px">${A.ico('mais')}<span>Adicionar dia</span></button></div>
        <div class="bloco"><h3>Publicação</h3><div class="acoes" style="gap:24px">
          <label class="toggle"><input type="checkbox" name="publicado" ${p.publicado ? 'checked' : ''}><i></i><span>Publicado no site</span></label>
          <label class="toggle"><input type="checkbox" name="destaque" ${p.destaque ? 'checked' : ''}><i></i><span>Destaque na página inicial</span></label></div></div>
      </form>
      <aside class="editor-prev"><span class="rot">Como aparece no site</span><div id="prev">${cardSite(p)}</div></aside>
    </div>`;
    const pe = `<button class="btn btn-primario" id="pac-salvar">${A.ico('check')}<span>Salvar pacote</span></button>${orig ? `<a class="btn" href="../pacote.html?id=${encodeURIComponent(orig.id)}" target="_blank" rel="noopener">${A.ico('externo')}<span>Ver no site</span></a>` : ''}<button class="btn" data-cancelar>Cancelar</button>`;

    A.abrirGaveta({ titulo: orig ? 'Editar pacote' : 'Novo pacote', corpo, pe, larga: true, chave: 'pac', aoAbrir: (g) => {
      const f = g.querySelector('#f-pac');
      const ler = () => {
        const d = Object.fromEntries(new FormData(f));
        p.titulo = d.titulo.trim(); p.destino = d.destino.trim(); p.regiao = d.regiao; p.estilo = d.estilo; p.noites = Number(d.noites) || 0;
        p.preco = d.preco === '' ? null : Number(d.preco); p.melhorEpoca = d.melhorEpoca.trim(); p.resumo = d.resumo.trim();
        p.publicado = !!d.publicado; p.destaque = !!d.destaque;
        ['inclui', 'roteiro'].forEach((n) => { p[n] = [...f.querySelectorAll(`[data-l="${n}"]`)].map((i) => i.value); });
      };
      const prev = () => { ler(); g.querySelector('#prev').innerHTML = cardSite(p); g.querySelector('#cont-res').textContent = p.resumo.length; };
      const redesenhar = (n) => { g.querySelector('#ed-' + n).innerHTML = listaEd(n, p[n], n === 'roteiro'); };
      f.addEventListener('input', prev);
      f.addEventListener('change', prev);
      f.addEventListener('submit', (ev) => ev.preventDefault());
      g.querySelector('#galeria').onclick = (ev) => {
        const b = ev.target.closest('[data-img]'); if (!b) return;
        p.img = b.dataset.img; g.querySelectorAll('#galeria button').forEach((x) => { x.classList.toggle('sel', x === b); x.setAttribute('aria-pressed', x === b); }); prev();
      };
      f.addEventListener('click', (ev) => {
        const b = ev.target.closest('button'); if (!b) return;
        const lin = b.closest('.lista-ed'); const n = b.dataset.add || (lin && lin.id.replace('ed-', ''));
        if (!n) return;
        ler();
        if (b.dataset.add) { p[n].push(''); redesenhar(n); const ins = g.querySelectorAll(`[data-l="${n}"]`); ins[ins.length - 1].focus(); }
        else if (b.dataset.rm != null) { p[n].splice(+b.dataset.rm, 1); redesenhar(n); }
        else if (b.dataset.sobe != null) { const i = +b.dataset.sobe; [p[n][i - 1], p[n][i]] = [p[n][i], p[n][i - 1]]; redesenhar(n); g.querySelector(`[data-sobe="${i - 1}"]`)?.focus(); }
        else if (b.dataset.desce != null) { const i = +b.dataset.desce; [p[n][i + 1], p[n][i]] = [p[n][i], p[n][i + 1]]; redesenhar(n); g.querySelector(`[data-desce="${i + 1}"]`)?.focus(); }
        prev();
      });
      g.querySelector('[data-cancelar]').onclick = A.fecharGaveta;
      g.querySelector('#pac-salvar').onclick = () => {
        ler();
        if (!p.titulo) { f.querySelector('[name=titulo]').focus(); A.toast('Dê um título ao pacote', 'alerta'); return; }
        p.inclui = p.inclui.map((s) => s.trim()).filter(Boolean); p.roteiro = p.roteiro.map((s) => s.trim()).filter(Boolean);
        const l = lista();
        if (orig) { const i = l.findIndex((x) => x.id === orig.id); l[i] = p; } else { p.id = idUnico(slug(p.titulo)); l.push(p); }
        salvarLista(l); A.fecharGaveta(); A.toast(`Pacote "${p.titulo}" salvo`); A.atualizar();
      };
    } });
  }
  A.editarPacote = editar;
})();
