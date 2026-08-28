# Loja Virtual MODU

## Arquitetura — importante ler antes de publicar

Este site é **100% frontend estático**. Não existe backend, servidor,
banco de dados ou API neste projeto — e isso é intencional, não uma
etapa incompleta: o fechamento do pedido acontece por conversa humana
no WhatsApp, não por um checkout automatizado.

Como não há backend, **não existem hoje riscos clássicos de backend**
(injeção SQL, falha de autenticação, vazamento de banco de dados,
servidor comprometido) simplesmente porque não há servidor de
aplicação processando dados. Toda a "inteligência" do site roda no
navegador da pessoa que visita.

Isso também define os limites do que o site faz sozinho:
- O carrinho e os filtros existem apenas na memória do navegador
  (não há login, não há pedidos salvos, não há histórico).
- Os formulários de contato e newsletter são **apenas visuais** — eles
  não enviam e-mail nem gravam em lugar nenhum ainda. Para que
  funcionem de verdade, é preciso conectar a um serviço (ver seção
  "Se um dia precisar de backend").
- Preços, categorias e produtos vêm de um arquivo local
  (`js/data.js`) editado à mão — não há um painel administrativo.

## Estrutura de pastas (frontend organizado em camadas)

```
modu-site/
├── index.html          → estrutura/marcação da página (não tem lógica nem dado solto)
├── css/
│   ├── tailwind.min.css → utilitários de layout (gerado, não editar à mão)
│   └── styles.css       → identidade visual da MODU (cores, componentes)
├── js/
│   ├── data.js          → CAMADA DE DADOS: catálogo, categorias, textos institucionais,
│   │                       número de WhatsApp. É o único arquivo que você deve editar
│   │                       no dia a dia (trocar produtos, preços, textos).
│   ├── app.js            → CAMADA DE LÓGICA: carrinho, filtros, roteamento, geração
│   │                       da mensagem do WhatsApp. Só depende do que está em data.js.
│   └── alpine.min.js     → biblioteca de interatividade (vendorizada localmente,
│                            não carrega de CDN externo).
└── assets/
    ├── logo.png
    └── favicon.png
```

A separação `data.js` / `app.js` / `index.html` existe para que, se um
dia você quiser um backend de verdade, só seja preciso trocar a forma
como `data.js` busca os dados (de um array fixo para uma chamada de
API) — a lógica (`app.js`) e a página (`index.html`) não mudam.

## O que foi testado

Uma bateria de 19 testes automatizados (Playwright) foi rodada nesta
versão, cobrindo:

**Segurança**
- Tentativas de XSS (`<script>`, `<img onerror>`, `<svg onload>`) nos
  campos de personalização, observações e busca — todos os campos
  digitados pelo cliente são renderizados como texto puro, nunca como
  HTML, então não é possível injetar código.
- Geração do link do WhatsApp: o texto é sempre codificado
  (`encodeURIComponent`), então caracteres especiais não escapam para
  fora da mensagem nem alteram o link.
- Nenhum dado é gravado em `localStorage`/`sessionStorage`.
- Nenhuma chamada de rede para domínio inesperado além do Google
  Fonts (Alpine.js e Tailwind estão vendorizados localmente).
- Navegação com URLs manipuladas (slug de produto inexistente, hash
  com `../../`) não quebra o site nem gera erros no console.

**Funcional**
- Matemática do carrinho (subtotal, adicionar, remover, alterar
  quantidade) com valores corretos.
- Quantidade nunca fica abaixo do mínimo do produto nem abaixo de 1
  no carrinho.
- Filtros combinados (categoria + preço + busca) sem resultado não
  quebram a tela.
- Campo de e-mail validado como obrigatório e do tipo `email`.

Resultado: **19/19 testes aprovados**, sem erros de JavaScript em
nenhum cenário testado.

## Ajustes feitos nesta versão

- Ícones dos produtos redimensionados (antes ficavam desproporcionalmente
  grandes em telas largas); agora têm um tamanho máximo travado.
- Imagem principal da página de produto limitada a 420px de largura
  máxima, para não ficar gigante em monitores largos.
- Abas "Descrição / Características / Personalização / ..." agora
  quebram linha normalmente em vez de exigir scroll horizontal.
- Campo de cor virou texto livre (o cliente digita a cor desejada,
  em vez de escolher de uma paleta fixa).
- Upload de logo agora valida no navegador: apenas arquivos de imagem
  (PNG, JPG, WEBP, SVG, GIF) e até 5MB — arquivos fora disso são
  recusados com uma mensagem de erro antes mesmo de serem anexados
  ao pedido.

## Antes de publicar

1. Abra `js/data.js` e troque `WHATSAPP_NUMBER` pelo número real.
2. Revise o array `PRODUCTS` com os produtos, preços e mínimos reais.
3. Ajuste e-mail e horário de atendimento em `index.html` (seções de
   Contato e rodapé).

## Publicar no GitHub (e hospedar de graça com GitHub Pages)

Como este site é 100% estático (sem backend), o GitHub Pages é a forma
mais simples e gratuita de colocá-lo no ar — ele serve exatamente esse
tipo de site.

**1. Criar o repositório**
No GitHub, clique em "New repository", dê um nome (ex.: `modu-site`)
e deixe vazio (sem README, sem .gitignore — já tem aqui).

**2. Subir os arquivos** (com git instalado, dentro desta pasta):
```bash
git init
git add .
git commit -m "Primeira versão da loja MODU"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/modu-site.git
git push -u origin main
```
Não tem terminal/git instalado? No GitHub Desktop (interface gráfica)
dá pra fazer os mesmos passos clicando: "Add local repository" →
selecionar esta pasta → "Publish repository".

**3. Ativar o GitHub Pages**
No repositório, vá em Settings → Pages → em "Branch" escolha `main`
e pasta `/ (root)` → Save. Em alguns minutos o site fica no ar em
`https://SEU-USUARIO.github.io/modu-site/`.

**4. Domínio próprio (opcional)**
Se a MODU tiver um domínio (ex. `modu.com.br`), dá pra apontar ele
para o GitHub Pages nas configurações de DNS — o próprio GitHub
mostra o passo a passo em Settings → Pages → Custom domain.

## Se um dia precisar de um backend de verdade

Se a MODU crescer e precisar de checkout automatizado, formulário de
contato que realmente envia e-mail, ou um painel para editar produtos
sem mexer em código, aí sim entra um backend — e ele deve seguir
algumas regras básicas de segurança que esta versão estática não
precisa (mas um backend real precisaria):
- Nunca confiar em preço/quantidade enviados pelo navegador — sempre
  recalcular no servidor a partir de uma fonte de dados própria.
- Nunca colocar chaves de API ou credenciais dentro do código do
  frontend (arquivos `.js` servidos ao navegador são sempre públicos).
- Validar e sanitizar no servidor qualquer texto recebido de
  formulários, mesmo que o frontend já valide.
- Usar HTTPS e, se houver login, hashing de senha adequado (nunca
  senha em texto puro).

Nada disso precisa ser resolvido agora — é só o que vale lembrar
quando esse próximo passo aparecer.
