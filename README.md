# Vitrine Net

Aplicativo web **100% adaptado para smartphones** que funciona como vitrine de produtos afiliados. Interface em HTML, CSS e JavaScript, com painel de administração para cadastro de produtos e múltiplos temas visuais.

## 📱 Mobile-first

O projeto foi pensado e desenvolvido para uso em celulares:

- **Viewport** configurado para telas pequenas (`width=device-width`, `user-scalable=no`)
- **Meta tags** para PWA no iOS (`apple-mobile-web-app-capable`, `theme-color`)
- **Layout responsivo** com unidades relativas (rem, %, vh/dvh)
- **Toque**: áreas clicáveis adequadas, `-webkit-tap-highlight-color` suave
- **Sem dependências**: abre direto no navegador do celular

Recomendado usar em smartphone ou emulador mobile para melhor experiência.

## 🚀 Como rodar

1. **Local**: abra `index.html` no navegador (Chrome, Edge, Safari, Firefox).
2. **GitHub Pages** (recomendado para celular):
   - Envie o repositório para o GitHub.
   - Em **Settings → Pages**, escolha o branch (ex.: `main`) e a pasta **root**.
   - Acesse `https://seu-usuario.github.io/nome-do-repo/` no celular.

Não é necessário servidor nem build: só HTML, CSS e JS estáticos.

## 📂 Estrutura

```
├── index.html          # Vitrine (página pública)
├── ADM.html            # Painel de cadastro (produtos e tema)
├── css/
│   ├── style.css       # Estilos base e componentes
│   └── themes.css      # Temas (Cyberpunk, Neumorfismo, etc.)
├── js/
│   ├── app.js          # Vitrine: listagem, filtros, navegação de imagens
│   └── adm.js          # ADM: cadastro, lista de produtos, tema
├── README.md
├── .gitignore
└── LICENSE
```

## ✨ Funcionalidades

- **Vitrine (`index.html`)**
  - Lista de produtos com imagens, preço, descrição e link de afiliado
  - Várias imagens por produto com setas para navegar
  - Link de vídeo opcional: botão play sobre as imagens; vídeo só toca ao clicar
  - Filtro por categoria e modo de visualização (Amplo / Listado)
  - Múltiplos temas (definidos no ADM)

- **Painel ADM (`ADM.html`)**
  - Cadastro de produtos: link, título, preço, descrição, várias URLs de imagem (campo “Adicionar”), link do vídeo opcional
  - Categoria, oferta e desconto por produto
  - Lista de produtos cadastrados com edição
  - Seletor de tema (aplica na vitrine e no ADM)
  - Contador de produtos e botão para abrir a vitrine

- **Temas**
  - Gamer/Cyberpunk, Neumorfismo, Glassmorfismo, Steampunk, Solarpunk, Brutalismo, Vaporwave, Bento Grid, Dark Academia, Minimalismo, Bio-Design, Shopee, Mercado Livre, Magalu (em `themes.css`).

Dados dos produtos e tema escolhido são salvos no **localStorage** do navegador (sem backend).

## 🛠 Tecnologias

- HTML5, CSS3 (variáveis, flexbox, grid)
- JavaScript (vanilla)
- Fontes: Google Fonts (Orbitron, Rajdhani)

## 📄 Licença

MIT — veja [LICENSE](LICENSE).
