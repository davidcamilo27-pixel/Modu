// ======================================================
// CAMADA DE DADOS — catálogo, categorias, textos institucionais
// Isolada da lógica (js/app.js) e da apresentação (index.html).
// Se um dia isso vier de uma API/backend real, só este arquivo muda.
// ======================================================
// ======================================================
// CONFIGURAÇÃO CENTRAL — altere aqui o número do WhatsApp
// ======================================================
const WHATSAPP_NUMBER = "5511999999999"; // formato: DDI+DDD+numero, apenas dígitos

// Ícones (SVG inline, sem dependência externa) reaproveitados nos cards de produto
const ICONS = {
  keychain: `<svg viewBox="0 0 24 24" fill="none" stroke="var(--c-primary)" stroke-width="1.6"><circle cx="8" cy="6" r="3"/><path d="M10 8l7 7"/><rect x="14.5" y="14.5" width="7" height="7" rx="1.8" transform="rotate(0 14.5 14.5)"/></svg>`,
  tag: `<svg viewBox="0 0 24 24" fill="none" stroke="var(--c-primary)" stroke-width="1.6"><path d="M3 11.5V5a2 2 0 012-2h6.5L21 11.5 12.5 20 3 11.5z"/><circle cx="7.5" cy="7.5" r="1.3" fill="var(--c-primary)"/></svg>`,
  box: `<svg viewBox="0 0 24 24" fill="none" stroke="var(--c-primary)" stroke-width="1.6"><path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></svg>`,
  building: `<svg viewBox="0 0 24 24" fill="none" stroke="var(--c-primary)" stroke-width="1.6"><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1"/></svg>`,
  sparkle: `<svg viewBox="0 0 24 24" fill="var(--c-primary)" stroke="none"><path d="M12 2.5c.5 3.2 1 5.6 2.3 6.9 1.3 1.3 3.7 1.8 6.9 2.3-3.2.5-5.6 1-6.9 2.3-1.3 1.3-1.8 3.7-2.3 6.9-.5-3.2-1-5.6-2.3-6.9C8.4 12.6 6 12.1 2.8 11.6c3.2-.5 5.6-1 6.9-2.3C11 8 11.5 5.6 12 2.5z"/></svg>`,
  medal: `<svg viewBox="0 0 24 24" fill="none" stroke="var(--c-primary)" stroke-width="1.6"><circle cx="12" cy="9" r="5"/><path d="M9 13.5L7 21l5-3 5 3-2-7.5"/></svg>`
};

const CATEGORIES = [
  { id: "chaveiros", name: "Chaveiros", desc: "Peças em 3D personalizadas", icon: ICONS.keychain },
  { id: "brindes", name: "Brindes personalizados", desc: "Para presentear clientes", icon: ICONS.tag },
  { id: "kits", name: "Kits", desc: "Conjuntos prontos para revenda", icon: ICONS.box },
  { id: "corporativo", name: "Produtos corporativos", desc: "Volume para sua empresa", icon: ICONS.building },
  { id: "lancamentos", name: "Lançamentos", desc: "Novidades da temporada", icon: ICONS.sparkle }
];

const COLOR_SETS = {
  basic: [
    { name: "Preto", hex: "#131312" },
    { name: "Branco", hex: "#f4f4f4" },
    { name: "Azul-marinho", hex: "#183d5e" }
  ],
  vivid: [
    { name: "Preto", hex: "#131312" },
    { name: "Vermelho", hex: "#b0392f" },
    { name: "Verde", hex: "#3c6e47" },
    { name: "Azul-marinho", hex: "#183d5e" }
  ]
};

const PRODUCTS = [
  { id: 1, slug: "chaveiro-logo-classico", name: "Chaveiro Logo Clássico", category: "chaveiros", price: 6.9, minQty: 20, badge: "Mais vendido", featured: true, isNew: false, icon: ICONS.keychain, tint: "#e8eef3", colors: COLOR_SETS.basic, desc: "Chaveiro em 3D com o logotipo da sua marca em relevo, acabamento fosco e alta resistência ao uso diário." },
  { id: 2, slug: "kit-chaveiro-personalizado", name: "Kit Chaveiro Personalizado", category: "kits", price: 6.9, minQty: 20, badge: "Oferta", featured: true, isNew: false, icon: ICONS.box, tint: "#eef2ea", colors: COLOR_SETS.vivid, desc: "Kit com chaveiros variados para campanhas de fidelização, ideal para lojas que querem aumentar o ticket médio." },
  { id: 3, slug: "chaveiro-colecionavel-edicao-limitada", name: "Chaveiro Colecionável — Edição Limitada", category: "lancamentos", price: 9.9, minQty: 10, badge: "Lançamento", featured: true, isNew: true, icon: ICONS.medal, tint: "#f3ece7", colors: COLOR_SETS.basic, desc: "Peça exclusiva para campanhas do tipo 'Método das 100 Primeiras', pensada para gerar urgência e engajamento." },
  { id: 4, slug: "brinde-corporativo-premium", name: "Brinde Corporativo Premium", category: "corporativo", price: 14.9, minQty: 50, badge: "", featured: true, isNew: false, icon: ICONS.building, tint: "#e8eef3", colors: COLOR_SETS.basic, desc: "Acessório personalizado para eventos e ações corporativas, com acabamento premium e embalagem individual." },
  { id: 5, slug: "chaveiro-mini-tag", name: "Chaveiro Mini Tag", category: "chaveiros", price: 5.5, minQty: 20, badge: "Novo", featured: false, isNew: true, icon: ICONS.tag, tint: "#eef2ea", colors: COLOR_SETS.basic, desc: "Formato compacto e leve, perfeito para gravação de nome ou iniciais do cliente." },
  { id: 6, slug: "kit-boas-vindas", name: "Kit Boas-Vindas", category: "kits", price: 18.9, minQty: 15, badge: "Novo", featured: false, isNew: true, icon: ICONS.sparkle, tint: "#f3ece7", colors: COLOR_SETS.vivid, desc: "Conjunto de brindes para recepcionar novos clientes ou colaboradores com a cara da sua marca." },
  { id: 7, slug: "chaveiro-fitness-personalizado", name: "Chaveiro Fitness Personalizado", category: "chaveiros", price: 6.9, minQty: 20, badge: "Mais vendido", featured: false, isNew: false, icon: ICONS.keychain, tint: "#e8eef3", colors: COLOR_SETS.vivid, desc: "Desenvolvido para academias e lojas do segmento fitness, reforça a lembrança da marca a cada treino." },
  { id: 8, slug: "brinde-personalizado-evento", name: "Brinde Personalizado para Evento", category: "brindes", price: 8.5, minQty: 30, badge: "", featured: false, isNew: false, icon: ICONS.tag, tint: "#eef2ea", colors: COLOR_SETS.basic, desc: "Produzido sob demanda para feiras, lançamentos e ativações de marca." },
  { id: 9, slug: "chaveiro-nome-gravado", name: "Chaveiro com Nome Gravado", category: "chaveiros", price: 7.5, minQty: 10, badge: "", featured: false, isNew: false, icon: ICONS.keychain, tint: "#f3ece7", colors: COLOR_SETS.basic, desc: "Gravação individual do nome do cliente — ótimo para ações de fidelização ponto a ponto." },
  { id: 10, slug: "kit-corporativo-volume", name: "Kit Corporativo Volume", category: "corporativo", price: 12.9, minQty: 100, badge: "Oferta", featured: false, isNew: false, icon: ICONS.building, tint: "#e8eef3", colors: COLOR_SETS.basic, desc: "Ideal para grandes volumes corporativos, com preço reduzido por unidade a partir de 100 peças." },
  { id: 11, slug: "chaveiro-edicao-verao", name: "Chaveiro Edição Verão", category: "lancamentos", price: 8.9, minQty: 20, badge: "Lançamento", featured: false, isNew: true, icon: ICONS.sparkle, tint: "#eef2ea", colors: COLOR_SETS.vivid, desc: "Nova coleção sazonal com cores exclusivas, disponível por tempo limitado." },
  { id: 12, slug: "brinde-colecionavel-fidelidade", name: "Brinde Colecionável Fidelidade", category: "brindes", price: 9.5, minQty: 20, badge: "Mais vendido", featured: false, isNew: false, icon: ICONS.medal, tint: "#f3ece7", colors: COLOR_SETS.basic, desc: "Peça pensada para programas de fidelidade — o cliente coleciona, a marca fideliza." }
];

const VALUE_PROPS = [
  { title: "Personalização real", desc: "Nome, logo ou frase — cada peça sai com a identidade da sua marca.", icon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18"/></svg>` },
  { title: "Produção própria", desc: "Impressão 3D feita internamente, sem intermediários e com controle total da qualidade.", icon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/></svg>` },
  { title: "Atendimento próximo", desc: "Você fala direto com quem produz — sem chatbot, sem fila de espera.", icon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2z"/></svg>` },
  { title: "Produtos exclusivos", desc: "Peças colecionáveis e edições limitadas que ninguém mais tem.", icon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="9" r="5"/><path d="M9 13.5L7 21l5-3 5 3-2-7.5"/></svg>` },
  { title: "Qualidade garantida", desc: "Material resistente, acabamento cuidadoso e checagem antes do envio.", icon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 13l4 4L19 7"/></svg>` },
  { title: "Sob demanda", desc: "Produzimos na quantidade que sua loja precisa, sem excesso de estoque.", icon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 8h1M14 8h1M9 12h1M14 12h1"/></svg>` }
];

const HOW_IT_WORKS = [
  { title: "Escolha o produto", desc: "Navegue pelo catálogo e encontre a peça ideal para sua marca." },
  { title: "Personalize", desc: "Defina cor, nome, logo e quantidade direto na página do produto." },
  { title: "Adicione ao carrinho", desc: "Monte seu pedido com um ou vários produtos, sem pressa." },
  { title: "Finalize pelo WhatsApp", desc: "Envie o pedido pronto e confirme prazo, frete e forma de pagamento com a gente." }
];

const INSTITUTIONAL_PAGES = [
  { id: "privacy", title: "Política de Privacidade", intro: "Saiba como tratamos as informações que você compartilha com a MODU.",
    sections: [
      { h: "Quais dados coletamos", p: "Coletamos apenas as informações necessárias para atendimento e produção do pedido, como nome, contato e detalhes de personalização enviados por você." },
      { h: "Como usamos seus dados", p: "Os dados são usados exclusivamente para viabilizar o atendimento, a produção e a entrega do seu pedido." },
      { h: "Compartilhamento", p: "Não vendemos nem compartilhamos seus dados com terceiros para fins comerciais." },
      { h: "Segurança", p: "Adotamos boas práticas para proteger as informações trocadas em nossos canais de atendimento." },
      { h: "Seus direitos", p: "Você pode solicitar a qualquer momento a atualização ou exclusão dos seus dados entrando em contato pelo WhatsApp ou e-mail." }
    ]},
  { id: "terms", title: "Termos de Uso", intro: "Condições gerais para navegação e compra no site da MODU.",
    sections: [
      { h: "Sobre o site", p: "Este site funciona como catálogo e vitrine. A confirmação e o fechamento de todo pedido acontecem pelo WhatsApp." },
      { h: "Preços e quantidades", p: "Os preços exibidos são referenciais e podem variar conforme quantidade, personalização e prazo, confirmados na conversa pelo WhatsApp." },
      { h: "Produção sob encomenda", p: "Os produtos são fabricados sob demanda após a confirmação do pedido e do material de personalização." },
      { h: "Responsabilidades do cliente", p: "É responsabilidade do cliente conferir as informações de personalização (nome, logo, cor) antes da confirmação da produção." },
      { h: "Alterações", p: "Estes termos podem ser atualizados periodicamente, sem aviso prévio." }
    ]},
  { id: "returns", title: "Trocas e Devoluções", intro: "Como funcionam trocas e devoluções para produtos personalizados.",
    sections: [
      { h: "Produtos com defeito", p: "Aceitamos troca em até 7 dias corridos após o recebimento, mediante análise e evidência do defeito de fabricação." },
      { h: "Produtos personalizados", p: "Por serem fabricados sob medida, não realizamos devolução por arrependimento após o início da produção." },
      { h: "Como solicitar", p: "Entre em contato pelo WhatsApp informando o número do pedido e o motivo da solicitação." },
      { h: "Prazo de análise", p: "Analisamos cada solicitação em até 3 dias úteis e retornamos com a solução pelo mesmo canal." }
    ]}
];

const PRODUCT_TABS = ["Descrição", "Características", "Personalização", "Prazo de produção", "Dúvidas frequentes", "Trocas e devoluções"];
