/* Vulk Turismo — dados do site e do painel.
   Tudo fica no localStorage (chave "vulk:<nome>"), começando pelos valores abaixo.
   O painel (admin/) edita as mesmas chaves, então o que o dono muda lá aparece no site.
   Na versão de produção isso vira um banco (Supabase), com a mesma estrutura. */
(function () {
  const PREFIXO = 'vulk:';
  const VERSAO = '3';

  const hoje = new Date();
  const dias = (n) => { const d = new Date(hoje); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };

  const PADRAO = {
    config: {
      nome: 'Vulk Turismo',
      slogan: 'Diferentes talentos. Um mesmo propósito.',
      whatsapp: '5575982273919', // a confirmar: o site atual tem dois números (75 e 86)
      telefoneExibicao: '(75) 98227-3919',
      email: 'contato@vulkturismo.com.br', // a confirmar
      instagram: 'vulkturismo',
      endereco: 'Av. Luís Viana, 6462 — Manhattan Square, Bloco B West, sala 614',
      bairro: 'Patamares, Salvador — BA',
      cep: '41680-400',
      horario: 'Seg a sex, 9h às 18h · Sáb, 9h às 12h', // a confirmar
      fundacao: '2010-03-24',
      cnpj: '11.726.382/0001-51'
    },

    pacotes: [
      { id: 'noronha', titulo: 'Fernando de Noronha', destino: 'Pernambuco, Brasil', regiao: 'nacional', estilo: 'Natureza', img: 'noronha', noites: 5,
        resumo: 'O arquipélago mais desejado do Brasil, com mergulho, trilhas e o pôr do sol do Boldró.',
        inclui: ['Aéreo saindo de Salvador', 'Pousada com café da manhã', 'Taxa de preservação orientada', 'Passeio de barco', 'Seguro viagem'],
        roteiro: ['Chegada, check-in e pôr do sol no Forte do Boldró', 'Ilhatour pelas praias do mar de dentro', 'Passeio de barco até a Ponta da Sapata', 'Dia livre: Baía do Sancho e Baía dos Porcos', 'Mergulho de batismo ou trilha do Atalaia', 'Café da manhã e retorno'],
        melhorEpoca: 'Agosto a dezembro, mar calmo e boa visibilidade', preco: null, destaque: true, publicado: true },
      { id: 'lencois', titulo: 'Lençóis Maranhenses', destino: 'Maranhão, Brasil', regiao: 'nacional', estilo: 'Natureza', img: 'lencois', noites: 4,
        resumo: 'Dunas brancas e lagoas de água doce que só existem em alguns meses do ano.',
        inclui: ['Aéreo até São Luís', 'Transfer até Barreirinhas', 'Hospedagem com café', 'Passeio de 4x4 às lagoas', 'Seguro viagem'],
        roteiro: ['Chegada em São Luís e transfer para Barreirinhas', 'Circuito Lagoa Azul de 4x4', 'Circuito Lagoa Bonita e pôr do sol nas dunas', 'Passeio de lancha pelo Rio Preguiças', 'Retorno'],
        melhorEpoca: 'Junho a setembro, lagoas cheias', preco: null, destaque: true, publicado: true },
      { id: 'maragogi', titulo: 'Maragogi e Porto de Galinhas', destino: 'Alagoas e Pernambuco', regiao: 'nacional', estilo: 'Praia', img: 'maragogi', noites: 6,
        resumo: 'As piscinas naturais mais famosas do Nordeste em uma só viagem, perto de casa.',
        inclui: ['Aéreo saindo de Salvador', 'Resort com meia pensão', 'Passeio às Galés de Maragogi', 'Jangada em Porto de Galinhas', 'Transfers'],
        roteiro: ['Chegada em Maceió e transfer', 'Galés de Maragogi na maré baixa', 'Dia livre no resort', 'Transfer para Porto de Galinhas', 'Jangada às piscinas naturais', 'Praia de Muro Alto', 'Retorno'],
        melhorEpoca: 'Setembro a março, sol e maré baixa', preco: null, destaque: false, publicado: true },
      { id: 'orlando', titulo: 'Orlando em família', destino: 'Flórida, Estados Unidos', regiao: 'internacional', estilo: 'Família', img: 'orlando', noites: 8,
        resumo: 'Parques, compras e um roteiro montado no ritmo das crianças, sem fila de dúvida.',
        inclui: ['Aéreo internacional', 'Hotel próximo aos parques', 'Ingressos dos parques', 'Carro alugado', 'Seguro viagem', 'Orientação de visto'],
        roteiro: ['Chegada e retirada do carro', 'Magic Kingdom', 'Epcot', 'Universal Studios', 'Islands of Adventure', 'Dia de compras', 'Hollywood Studios', 'Animal Kingdom', 'Retorno'],
        melhorEpoca: 'Março a maio e setembro a novembro, parques mais vazios', preco: null, destaque: true, publicado: true },
      { id: 'lisboa', titulo: 'Lisboa e Porto', destino: 'Portugal', regiao: 'internacional', estilo: 'Cultura', img: 'lisboa', noites: 9,
        resumo: 'Bondinho 28, pastel de Belém e as caves do Porto, com o idioma a seu favor.',
        inclui: ['Aéreo internacional', 'Hotéis centrais com café', 'Trem Lisboa–Porto', 'Passeio em Sintra', 'Seguro viagem'],
        roteiro: ['Chegada em Lisboa', 'Alfama, Baixa e Chiado', 'Belém', 'Sintra e Cascais', 'Dia livre', 'Trem para o Porto', 'Ribeira e caves', 'Vale do Douro', 'Dia livre', 'Retorno'],
        melhorEpoca: 'Abril a junho e setembro a outubro', preco: null, destaque: false, publicado: true },
      { id: 'paris', titulo: 'Paris clássica', destino: 'França', regiao: 'internacional', estilo: 'Lua de mel', img: 'paris', noites: 6,
        resumo: 'A cidade feita para viajar a dois, com hotel bem localizado e jantar no Sena.',
        inclui: ['Aéreo internacional', 'Hotel boutique com café', 'Cruzeiro com jantar no Sena', 'Ingresso Torre Eiffel', 'Seguro viagem'],
        roteiro: ['Chegada e Champs-Élysées', 'Louvre e Jardim das Tulherias', 'Torre Eiffel e cruzeiro no Sena', 'Montmartre', 'Versalhes', 'Dia livre', 'Retorno'],
        melhorEpoca: 'Abril a junho e setembro', preco: null, destaque: false, publicado: true },
      { id: 'bariloche', titulo: 'Bariloche na neve', destino: 'Patagônia, Argentina', regiao: 'internacional', estilo: 'Neve', img: 'bariloche', noites: 6,
        resumo: 'Cerro Catedral, chocolate quente e lagos que espelham as montanhas.',
        inclui: ['Aéreo internacional', 'Hotel com café', 'Circuito Chico', 'Dia no Cerro Catedral', 'Seguro viagem'],
        roteiro: ['Chegada', 'Circuito Chico', 'Cerro Catedral', 'Cerro Otto', 'Isla Victoria e Bosque de Arrayanes', 'Dia livre', 'Retorno'],
        melhorEpoca: 'Julho a setembro para neve', preco: null, destaque: false, publicado: true },
      { id: 'santiago', titulo: 'Santiago e Atacama', destino: 'Chile', regiao: 'internacional', estilo: 'Aventura', img: 'atacama', noites: 7,
        resumo: 'Da cordilheira às vinícolas, e depois o deserto mais seco do mundo.',
        inclui: ['Aéreo internacional', 'Hotéis com café', 'Vinícola no Vale do Maipo', 'Vale da Lua', 'Seguro viagem'],
        roteiro: ['Chegada em Santiago', 'City tour', 'Vinícola', 'Voo para Calama e San Pedro', 'Vale da Lua', 'Gêiseres del Tatio', 'Lagunas Altiplânicas', 'Retorno'],
        melhorEpoca: 'Setembro a novembro e março a maio', preco: null, destaque: false, publicado: true },
      { id: 'cancun', titulo: 'Cancún all inclusive', destino: 'México', regiao: 'internacional', estilo: 'Praia', img: 'cancun', noites: 7,
        resumo: 'Mar do Caribe, cenotes e resort com tudo incluído para só descansar.',
        inclui: ['Aéreo internacional', 'Resort all inclusive', 'Passeio a Isla Mujeres', 'Transfers', 'Seguro viagem'],
        roteiro: ['Chegada e resort', 'Dia livre', 'Isla Mujeres', 'Chichén Itzá', 'Cenotes', 'Xcaret', 'Dia livre', 'Retorno'],
        melhorEpoca: 'Dezembro a abril, fora da temporada de furacões', preco: null, destaque: false, publicado: true }
    ],

    // Curiosidades publicadas no Instagram da Vulk (out–nov/2026)
    destinos: [
      { id: 'komodo', nome: 'Parque Nacional de Komodo', pais: 'Indonésia', img: 'komodo', titulo: 'Existe uma ilha habitada por dragões?',
        texto: 'O parque abriga os maiores lagartos vivos do planeta, os dragões-de-komodo, que podem passar de 3 metros. Além da vida selvagem, o arquipélago tem praias e águas cristalinas.', post: '29/10/2026' },
      { id: 'hillier', nome: 'Lago Hillier', pais: 'Austrália', img: 'hillier', titulo: 'Um lago naturalmente rosa',
        texto: 'O contraste entre as águas rosadas, a vegetação e o azul do oceano impressiona. A cor vem de microrganismos, pigmentos naturais e da salinidade.', post: '22/10/2026' },
      { id: 'atacama', nome: 'Desierto Florido', pais: 'Atacama, Chile', img: 'atacama', titulo: 'Quando o deserto vira um mar de flores',
        texto: 'Depois de chuvas suficientes, sementes adormecidas no solo germinam e cobrem a paisagem árida de cor. O fenômeno não acontece todo ano.', post: '13/10/2026' },
      { id: 'namibia', nome: 'Sandwich Harbour', pais: 'Namíbia', img: 'namibia', titulo: 'Onde o deserto encontra o mar',
        texto: 'Dunas douradas que descem até o Atlântico. Na mesma lista da Vulk: Dakhla, no Saara Ocidental, e Paracas, no Peru.', post: '30/10/2026' },
      { id: 'pamukkale', nome: 'Pamukkale', pais: 'Turquia', img: 'pamukkale', titulo: 'Piscinas naturais que parecem irreais',
        texto: 'Terraços brancos e águas termais. Na mesma lista: Semuc Champey, na Guatemala, e Giola, na Grécia.', post: '24/10/2026' },
      { id: 'hallstatt', nome: 'Hallstatt', pais: 'Áustria', img: 'hallstatt', titulo: 'Vilarejos que parecem ter parado no tempo',
        texto: 'Um refúgio entre lagos e montanhas. Na mesma lista: Shirakawa-go (Japão), Alberobello (Itália) e Bibury (Inglaterra).', post: '17/10/2026' },
      { id: 'fuji', nome: 'Monte Fuji', pais: 'Japão', img: 'fuji', titulo: 'Se for pra abrir uma porta, que seja pra um paraíso desses',
        texto: 'Cerejeiras, templos e o vulcão mais fotografado do mundo. Melhor época para as flores: fim de março e começo de abril.', post: '10/11/2026' }
    ],

    depoimentos: [
      { id: 'd1', nome: 'Cliente Vulk', viagem: 'Orlando em família', texto: 'Exemplo de depoimento. Troque no painel pelo relato real de um cliente.', exemplo: true, publicado: true },
      { id: 'd2', nome: 'Cliente Vulk', viagem: 'Viagem corporativa', texto: 'Exemplo de depoimento. Troque no painel pelo relato real de um cliente.', exemplo: true, publicado: true },
      { id: 'd3', nome: 'Cliente Vulk', viagem: 'Lua de mel em Paris', texto: 'Exemplo de depoimento. Troque no painel pelo relato real de um cliente.', exemplo: true, publicado: true }
    ],

    // Dados de demonstração do painel (fictícios)
    cotacoes: [
      { id: 'c101', criadaEm: dias(-0) + 'T09:12', nome: 'Mariana Souza', whatsapp: '71988880001', tipo: 'Ida e volta', origem: 'Salvador (SSA)', destino: 'Lisboa (LIS)', ida: dias(70), volta: dias(82), passageiros: 2, bagagem: 'Despachada', horarios: ['Noite'], obs: 'Lua de mel, querem Porto também', status: 'nova', valor: null, pacote: 'lisboa', canal: 'site' },
      { id: 'c102', criadaEm: dias(-1) + 'T15:40', nome: 'Grupo TecnoBahia', whatsapp: '71988880002', tipo: 'Ida e volta', origem: 'Salvador (SSA)', destino: 'São Paulo (GRU)', ida: dias(12), volta: dias(14), passageiros: 6, bagagem: 'Somente de mão', horarios: ['Começo da manhã'], obs: 'Viagem corporativa, feira de tecnologia', status: 'cotando', valor: null, canal: 'corporativo' },
      { id: 'c103', criadaEm: dias(-2) + 'T11:05', nome: 'Rafael Lima', whatsapp: '71988880003', tipo: 'Ida e volta', origem: 'Salvador (SSA)', destino: 'Orlando (MCO)', ida: dias(120), volta: dias(130), passageiros: 4, bagagem: 'Despachada', horarios: ['Manhã', 'Tarde'], obs: '2 crianças (6 e 9 anos)', status: 'proposta', valor: 38900, pacote: 'orlando', canal: 'site' },
      { id: 'c104', criadaEm: dias(-4) + 'T18:22', nome: 'Juliana Prado', whatsapp: '71988880004', tipo: 'Ida e volta', origem: 'Salvador (SSA)', destino: 'Fernando de Noronha (FEN)', ida: dias(40), volta: dias(45), passageiros: 2, bagagem: 'Despachada', horarios: ['Manhã'], obs: '', status: 'fechada', valor: 14600, pacote: 'noronha', canal: 'instagram' },
      { id: 'c105', criadaEm: dias(-6) + 'T10:00', nome: 'Carlos Menezes', whatsapp: '71988880005', tipo: 'Somente ida', origem: 'Salvador (SSA)', destino: 'Brasília (BSB)', ida: dias(5), volta: '', passageiros: 1, bagagem: 'Somente de mão', horarios: ['Madrugada'], obs: '', status: 'perdida', valor: 890, canal: 'whatsapp' },
      { id: 'c106', criadaEm: dias(-3) + 'T13:30', nome: 'Patrícia Andrade', whatsapp: '71988880006', tipo: 'Ida e volta', origem: 'Salvador (SSA)', destino: 'São Luís (SLZ)', ida: dias(200), volta: dias(205), passageiros: 3, bagagem: 'Despachada', horarios: ['Almoço'], obs: 'Lençóis em julho', status: 'cotando', valor: null, pacote: 'lencois', canal: 'site' },
      { id: 'c107', criadaEm: dias(-9) + 'T09:45', nome: 'Fernanda Rocha', whatsapp: '71988880007', tipo: 'Ida e volta', origem: 'Salvador (SSA)', destino: 'Cancún (CUN)', ida: dias(25), volta: dias(32), passageiros: 2, bagagem: 'Despachada', horarios: ['Noite'], obs: '', status: 'fechada', valor: 21800, pacote: 'cancun', canal: 'indicação' }
    ],

    clientes: [
      { id: 'k1', nome: 'Juliana Prado', whatsapp: '71988880004', email: 'juliana@exemplo.com', nascimento: dias(9).replace(/^\d{4}/, '1990'), passaporte: '', passaporteValidade: '', cidade: 'Salvador', obs: 'Prefere janela', viagens: 3 },
      { id: 'k2', nome: 'Fernanda Rocha', whatsapp: '71988880007', email: 'fernanda@exemplo.com', nascimento: '1987-05-14', passaporte: 'FX123456', passaporteValidade: dias(95), cidade: 'Lauro de Freitas', obs: '', viagens: 2 },
      { id: 'k3', nome: 'Rafael Lima', whatsapp: '71988880003', email: 'rafael@exemplo.com', nascimento: '1982-11-30', passaporte: 'GB987654', passaporteValidade: dias(400), cidade: 'Salvador', obs: 'Família com 2 crianças', viagens: 1 },
      { id: 'k4', nome: 'Grupo TecnoBahia', whatsapp: '71988880002', email: 'viagens@tecnobahia.exemplo', nascimento: '', passaporte: '', passaporteValidade: '', cidade: 'Salvador', obs: 'Cliente corporativo, faturamento mensal', viagens: 12 },
      { id: 'k5', nome: 'Mariana Souza', whatsapp: '71988880001', email: 'mariana@exemplo.com', nascimento: dias(3).replace(/^\d{4}/, '1994'), passaporte: 'FZ554433', passaporteValidade: dias(150), cidade: 'Salvador', obs: 'Lua de mel', viagens: 0 }
    ],

    embarques: [
      { id: 'e1', cliente: 'Fernanda Rocha', destino: 'Cancún', data: dias(25), voo: 'a definir', checklist: { passaporte: true, seguro: true, voucher: false, checkin: false } },
      { id: 'e2', cliente: 'Juliana Prado', destino: 'Fernando de Noronha', data: dias(40), voo: 'G3 1580', checklist: { passaporte: true, seguro: false, voucher: false, checkin: false } },
      { id: 'e3', cliente: 'Grupo TecnoBahia', destino: 'São Paulo', data: dias(3), voo: 'LA 3321', checklist: { passaporte: true, seguro: true, voucher: true, checkin: false } }
    ]
  };

  function chave(n) { return PREFIXO + n; }
  function ler(n) {
    try { const v = localStorage.getItem(chave(n)); if (v) return JSON.parse(v); } catch (e) {}
    return JSON.parse(JSON.stringify(PADRAO[n]));
  }
  function gravar(n, v) {
    try { localStorage.setItem(chave(n), JSON.stringify(v)); } catch (e) {}
    try { window.dispatchEvent(new CustomEvent('vulk:mudou', { detail: n })); } catch (e) {}
  }
  function resetar() {
    Object.keys(PADRAO).forEach((n) => { try { localStorage.removeItem(chave(n)); } catch (e) {} });
  }
  try { if (localStorage.getItem(PREFIXO + 'versao') !== VERSAO) { resetar(); localStorage.setItem(PREFIXO + 'versao', VERSAO); } } catch (e) {}

  const fmtBRL = (v) => v == null || v === '' ? 'Sob cotação' : Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  const fmtData = (iso) => { if (!iso) return '—'; const [a, m, d] = iso.slice(0, 10).split('-'); return `${d}/${m}/${a}`; };
  const uid = (p) => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

  window.VULK = { ler, gravar, resetar, PADRAO, fmtBRL, fmtData, uid };
})();
