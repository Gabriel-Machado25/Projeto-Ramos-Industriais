# Ramos Industriais — Landing Page

> Landing page premium para substituir o link do Beacons.ai.  
> Construída com HTML5 semântico, CSS3 moderno e Vanilla JS + GSAP.

---

## 📋 Sobre o Projeto

Site institucional de alta conversão para a **Ramos Industriais**, empresa com duas unidades no Ceará (Tabuleiro do Norte e Limoeiro do Norte), especializada em ferramentas, tintas automotivas, chapas e metais, corte a laser, calandragem e EPIs.

O objetivo é substituir o link genérico do Beacons com uma experiência premium que reflita a identidade industrial da marca e direcione o cliente ao WhatsApp da unidade correta.

---

## 🗂️ Estrutura de Arquivos

```
/
├── index.html          # Estrutura semântica da página
├── style.css           # Estilos (Mobile-First, Custom Properties)
├── main.js             # Animações GSAP + lógica de interações
├── Ramos_logo.jpg      # Logo original (usada no header e preloader)
├── ramos-logo-bg.png   # Logo com fundo removido (usada como marca d'água)
└── README.md           # Este arquivo
```

---

## 🧱 Arquitetura do Código

### `index.html`
Organizado em seções semânticas na seguinte ordem:

| Seção | ID/Classe | Função |
|---|---|---|
| Preloader | `#preloader` | Animação de porta de aço industrial |
| Header | `.site-header` | Logo, nav, botão "Pedir Orçamento" |
| Modal | `#modal-unidade` | Escolha de unidade antes do WhatsApp |
| Hero | `.hero` | Título principal, CTA, redes sociais, marca d'água |
| Setores | `#setores` | 8 cards do catálogo 2025 |
| Marcas | `#marcas` | 20 marcas parceiras |
| Missão/Visão | `.missao` | Textos institucionais |
| Unidades | `#unidades` | Endereços e contatos das duas lojas |
| Redes Sociais | `#contato` | Links Instagram, TikTok, YouTube, Facebook |
| Footer | `.site-footer` | Rodapé com logo e contatos |

### `style.css`
Estruturado em camadas:

```
1. Tokens de Design (Custom Properties)
   └── Paleta, tipografia, espaçamentos, sombras, transições

2. Reset Moderno
   └── box-sizing, font-smoothing, reduced-motion

3. Utilitários
   └── .container, .section-header, .section-eyebrow, .section-title

4. Componentes
   └── Botões → Header → Preloader → Hero → Cards → Modal → Seções → Footer

5. Identidade Visual (logos espalhadas)
   └── .section-logo--[setores|marcas|missao|unidades]
```

### `main.js`
Funções independentes chamadas em sequência:

```
initReveal()             → IntersectionObserver para cards e seções
initButtonFeedback()     → Ripple + vibração mobile nos botões
waitForGSAP(callback)    → Guard que aguarda GSAP carregar
  └── initPreloader()    → Timeline da porta de aço
  └── initScrollAnimations() → Engrenagens + parallax hero
  └── initNewElementAnimations() → Watermark, botão orçamento, sociais
  └── initSectionLogos() → Logo animada em cada seção
initScrollButtons()      → scrollIntoView nos botões CTA
initModal()              → Abertura, fechamento e redirecionamento WhatsApp
```

---

## ✨ Funcionalidades

### Animações (GSAP 3.12)
- **Preloader:** porta de aço industrial subindo (Timeline sequencial)
- **Engrenagens hero:** giram com o scroll via ScrollTrigger (scrub)
- **Marca d'água:** logo rotaciona 360° em 90s + parallax independente
- **Logo nas seções:** cada instância tem entrada e comportamento de scroll únicos
- **Botão "Pedir Orçamento":** pulso periódico a cada 3.5s para chamar atenção
- **Parallax do hero:** conteúdo sobe mais rápido que o fundo
- **Footer logo:** entrada com bounce elástico (`back.out`)

### Modal de Unidade
Ao clicar em **"Pedir orçamento"** em qualquer card de setor, um modal flutua com as duas opções de unidade. A escolha abre o WhatsApp em nova aba (`window.open`). Fecha com: botão X, clique no backdrop ou tecla `Escape`.

### Reveal de Cards
`IntersectionObserver` com `threshold: 0.12` — cards aparecem escalonados conforme entram na viewport, sem depender do GSAP.

---

## 🎨 Identidade Visual

| Token | Valor |
|---|---|
| Fundo principal | `#0a0a0a` |
| Vermelho Ramos | `#CC0000` |
| Vermelho hover | `#e60000` |
| Branco | `#ffffff` |
| Cinza texto | `#888888` |
| Fonte display | Barlow Condensed (400, 600, 700, 900) |
| Fonte corpo | Barlow (400, 500, 600) |

A logo aparece em **6 lugares** com opacidades calibradas:

| Local | Opacidade | Animação |
|---|---|---|
| Hero (watermark) | 8% | Rotação 90s + parallax scroll |
| Setores | 4.5% | Entrada scale + giro +40° com scroll |
| Marcas | 4% | Zoom out + giro −25° com scroll |
| Missão | 5% | Entrada da esquerda + parallax vertical |
| Unidades | 5% | Entrada da direita + sobe com scroll |
| Footer | 100% | Bounce na entrada + hover scale+rotate |

---

## 📱 Responsividade

Mobile-First. Breakpoints:

| Breakpoint | Mudança principal |
|---|---|
| `480px` | Título hero maior, CTAs em linha |
| `540px` | Grid de setores 2 colunas |
| `768px` | Nav visível, botão header, grid 4 colunas, separador de unidades |
| `900px` | Grid de setores 4 colunas |

---

## 🔧 Como Usar

1. Clone ou baixe o repositório
2. Coloque todos os arquivos na **mesma pasta**
3. Abra `index.html` diretamente no navegador

Não há dependência de build, bundler ou servidor. Funciona 100% estático — pode ser hospedado no GitHub Pages, Netlify, Vercel ou qualquer hospedagem simples.

### Atualizar links do WhatsApp

No `main.js`, função `initModal()`:

```js
const WA_TABULEIRO = 'https://wa.me/5588981808861';
const WA_LIMOEIRO  = 'https://wa.me/5588999514292';
```

### Atualizar links de redes sociais

Buscar e substituir `ramosindustriais` nos `href` do `index.html`.

---

## 📦 Dependências Externas (CDN)

Carregadas via CDN — não precisam ser instaladas:

| Lib | Versão | Uso |
|---|---|---|
| GSAP | 3.12.5 | Todas as animações |
| ScrollTrigger | 3.12.5 | Animações vinculadas ao scroll |
| Google Fonts | — | Barlow + Barlow Condensed |

---

## 🗺️ Próximos Passos Sugeridos

- [ ] Adicionar fotos reais da loja como `background-image` nas seções
- [ ] Formulário de orçamento com envio por e-mail (Formspree ou similar)
- [ ] Seção de depoimentos de clientes
- [ ] Integração com Google Maps nas unidades
- [ ] SEO: meta tags Open Graph para compartilhamento no WhatsApp
- [ ] Favicon com o ícone da Ramos

---

## 👨‍💻 Desenvolvido por

Projeto freelancer desenvolvido para a **Ramos Industriais** — Ceará, Brasil.

Tecnologias: `HTML5` `CSS3` `JavaScript` 

> *"Qualidade, precisão e soluções sob medida."*
