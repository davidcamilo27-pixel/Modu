// ======================================================
// CAMADA DE LÓGICA (frontend) — estado da loja, carrinho, filtros,
// roteamento e geração da mensagem do WhatsApp.
// Depende apenas dos dados expostos por js/data.js.
// ======================================================
function store() {
  return {
    // navigation
    page: 'home',
    activeProductSlug: null,
    activeTab: 0,
    mobileMenuOpen: false,
    mobileSearchOpen: false,
    mobileFiltersOpen: false,

    // data
    categories: CATEGORIES,
    products: PRODUCTS,
    valueProps: VALUE_PROPS,
    howItWorks: HOW_IT_WORKS,
    institutionalPages: INSTITUTIONAL_PAGES,
    productTabs: PRODUCT_TABS,

    // search & filters
    search: '',
    filterCategory: '',
    filterMaxPrice: 300,
    filterMinQty: 0,
    filterFeatured: false,
    filterNew: false,
    sortBy: 'relevance',

    // product config (per active product view)
    config: { qty: 20, color: '', customText: '', logoFile: '', logoError: '', notes: '' },

    // cart
    cart: [],
    cartOpen: false,

    // misc
    newsletterSent: false,
    contactSent: false,
    toastVisible: false,
    toastMessage: '',
    _uid: 1,

    init() {
      window.__moduStore = this;
      this.route();
      window.addEventListener('hashchange', () => this.route());
    },

    route() {
      const hash = window.location.hash.replace('#', '') || '/';
      const parts = hash.split('/').filter(Boolean);
      if (parts.length === 0) { this.page = 'home'; return; }
      if (parts[0] === 'produtos') { this.page = 'products'; return; }
      if (parts[0] === 'produto' && parts[1]) { this.openProductBySlug(parts[1]); return; }
      if (parts[0] === 'carrinho') { this.page = 'cart'; return; }
      if (parts[0] === 'sobre') { this.page = 'about'; return; }
      if (parts[0] === 'contato') { this.page = 'contact'; return; }
      if (parts[0] === 'politica-de-privacidade') { this.page = 'privacy'; return; }
      if (parts[0] === 'termos-de-uso') { this.page = 'terms'; return; }
      if (parts[0] === 'trocas-e-devolucoes') { this.page = 'returns'; return; }
      this.page = 'home';
    },

    go(page) {
      this.page = page;
      this.cartOpen = false;
      this.mobileMenuOpen = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const map = { home: '/', products: '/produtos', cart: '/carrinho', about: '/sobre', contact: '/contato', privacy: '/politica-de-privacidade', terms: '/termos-de-uso', returns: '/trocas-e-devolucoes' };
      if (map[page] && window.location.hash.replace('#','') !== map[page]) {
        history.pushState(null, '', '#' + map[page]);
      }
    },

    openProduct(p) {
      this.activeProductSlug = p.slug;
      this.config = { qty: p.minQty, color: '', customText: '', logoFile: '', logoError: '', notes: '' };
      this.activeTab = 0;
      this.page = 'product';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const target = '/produto/' + p.slug;
      if (window.location.hash.replace('#','') !== target) history.pushState(null, '', '#' + target);
    },

    openProductBySlug(slug) {
      const p = this.products.find(pr => pr.slug === slug);
      if (!p) { this.page = 'products'; return; }
      this.activeProductSlug = slug;
      if (!this.config.qty) this.config = { qty: p.minQty, color: '', customText: '', logoFile: '', logoError: '', notes: '' };
      this.page = 'product';
    },

    get activeProduct() {
      return this.products.find(p => p.slug === this.activeProductSlug) || null;
    },

    get relatedProducts() {
      if (!this.activeProduct) return [];
      return this.products.filter(p => p.category === this.activeProduct.category && p.id !== this.activeProduct.id).slice(0, 4);
    },

    get filteredProducts() {
      let list = this.products.filter(p => {
        if (this.filterCategory && p.category !== this.filterCategory) return false;
        if (p.price > this.filterMaxPrice) return false;
        if (this.filterMinQty && p.minQty > this.filterMinQty) return false;
        if (this.filterFeatured && !p.featured) return false;
        if (this.filterNew && !p.isNew) return false;
        if (this.search && !p.name.toLowerCase().includes(this.search.toLowerCase())) return false;
        return true;
      });
      switch (this.sortBy) {
        case 'new': list = list.slice().sort((a,b) => b.isNew - a.isNew); break;
        case 'price-asc': list = list.slice().sort((a,b) => a.price - b.price); break;
        case 'price-desc': list = list.slice().sort((a,b) => b.price - a.price); break;
        case 'az': list = list.slice().sort((a,b) => a.name.localeCompare(b.name)); break;
        case 'za': list = list.slice().sort((a,b) => b.name.localeCompare(a.name)); break;
        default: list = list.slice().sort((a,b) => b.featured - a.featured);
      }
      return list;
    },

    resetFilters() {
      this.filterCategory = ''; this.filterMaxPrice = 300; this.filterMinQty = 0;
      this.filterFeatured = false; this.filterNew = false; this.search = '';
    },

    productCard(p) {
      const badge = p.badge ? `<span class="badge-pill absolute top-3 left-3" style="background:var(--c-primary);color:#fff">${p.badge}</span>` : '';
      return `
        <div class="card card-hover overflow-hidden flex flex-col cursor-pointer" onclick="window.__moduStore.openProduct(window.__moduStore.products.find(p=>p.id===${p.id}))">
          <div class="relative">
            ${badge}
            <div class="product-thumb" style="--tint:${p.tint}">${p.icon}</div>
          </div>
          <div class="p-4 flex flex-col flex-1">
            <h3 class="font-display font-semibold text-sm mb-1 leading-snug">${p.name}</h3>
            <p class="font-display font-semibold text-base mb-1" style="color:var(--c-primary)">A partir de R$ ${p.price.toFixed(2).replace('.', ',')}</p>
            <p class="text-xs mb-3" style="color:var(--c-muted)">Mínimo: ${p.minQty} unidades</p>
            <div class="mt-auto flex gap-1.5">
              <button onclick="event.stopPropagation(); window.__moduStore.openProduct(window.__moduStore.products.find(p=>p.id===${p.id}))" class="btn btn-outline-dark !py-2 !px-1 text-[11px] flex-1 min-w-0">Ver produto</button>
              <button onclick="event.stopPropagation(); window.__moduStore.quickAdd(${p.id})" class="btn btn-primary !py-2 !px-1 text-[11px] flex-1 min-w-0" title="Adicionar ao carrinho">+ Carrinho</button>
            </div>
          </div>
        </div>`;
    },

    quickAdd(id) {
      const p = this.products.find(pr => pr.id === id);
      if (p) this.addToCart(p, { qty: p.minQty, color: '', customText: '', notes: '' });
    },

    handleLogoUpload(event) {
      const input = event.target;
      const file = input.files && input.files[0];
      if (!file) { return; }

      const MAX_SIZE = 5 * 1024 * 1024; // 5MB
      const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/gif'];

      // Validação por tipo MIME real do arquivo (não pela extensão do nome,
      // que pode ser forjada) — evita que arquivos que não sejam imagem
      // sejam anexados ao pedido.
      if (!ALLOWED_TYPES.includes(file.type)) {
        this.config.logoFile = '';
        this.config.logoError = 'Envie apenas arquivos de imagem (PNG, JPG, WEBP, SVG ou GIF).';
        this.showToast('Arquivo inválido: envie apenas imagens.');
        input.value = '';
        return;
      }

      if (file.size > MAX_SIZE) {
        this.config.logoFile = '';
        this.config.logoError = 'O arquivo deve ter no máximo 5MB.';
        this.showToast('Arquivo maior que 5MB.');
        input.value = '';
        return;
      }

      this.config.logoError = '';
      this.config.logoFile = file.name;
    },

    addToCart(p, cfg) {
      const c = cfg || this.config;
      this.cart.push({
        uid: this._uid++,
        id: p.id, name: p.name, price: p.price, icon: p.icon, tint: p.tint,
        qty: c.qty || p.minQty, color: c.color || '', customText: c.customText || '', notes: c.notes || ''
      });
      this.showToast('Produto adicionado ao carrinho');
    },

    removeFromCart(idx) { this.cart.splice(idx, 1); },
    updateQty(idx, qty) { if (qty < 1) return; this.cart[idx].qty = qty; },

    get cartCount() { return this.cart.reduce((s,i) => s + i.qty, 0); },
    get cartSubtotal() { return this.cart.reduce((s,i) => s + i.price * i.qty, 0); },

    showToast(msg) {
      this.toastMessage = msg;
      this.toastVisible = true;
      setTimeout(() => { this.toastVisible = false; }, 2200);
    },

    waLink(text) {
      return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    },

    buildSingleProductMessage(p) {
      const c = this.config;
      let msg = `Olá! Vim pelo site e gostaria de fazer um pedido.\n\n*Meu pedido:*\n\n${p.name}\nQuantidade: ${c.qty}\n`;
      if (c.color) msg += `Cor: ${c.color}\n`;
      if (c.customText) msg += `Personalização: ${c.customText}\n`;
      if (c.notes) msg += `Observações: ${c.notes}\n`;
      msg += `Valor: R$ ${(p.price * c.qty).toFixed(2).replace('.', ',')}\n\n`;
      msg += `*Subtotal:* R$ ${(p.price * c.qty).toFixed(2).replace('.', ',')}\n\nGostaria de confirmar disponibilidade, prazo de produção e frete.`;
      return msg;
    },

    buildCartMessage() {
      let msg = `Olá! Vim pelo site e gostaria de fazer um pedido.\n\n*Meu pedido:*\n`;
      this.cart.forEach(item => {
        msg += `\n${item.name}\nQuantidade: ${item.qty}\n`;
        if (item.color) msg += `Cor: ${item.color}\n`;
        if (item.customText) msg += `Personalização: ${item.customText}\n`;
        msg += `Valor: R$ ${(item.price * item.qty).toFixed(2).replace('.', ',')}\n`;
      });
      msg += `\n*Subtotal:* R$ ${this.cartSubtotal.toFixed(2).replace('.', ',')}\n\nGostaria de confirmar disponibilidade, prazo de produção e frete.`;
      return msg;
    }
  };
}


