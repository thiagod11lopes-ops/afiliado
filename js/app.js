/**
 * AFILIADO ESPELHO — App de Afiliados Cyberpunk
 * Gerencia anúncios e redireciona para sites de compras (links de afiliado)
 */

(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function getImagens(prod) {
    if (!prod.imagem) return [];
    return Array.isArray(prod.imagem) ? prod.imagem : [prod.imagem];
  }

  /** Lista de mídia: apenas imagens. Cada item: { type: 'image', url } */
  function getMediaItems(prod) {
    var items = [];
    getImagens(prod).forEach(function (url) {
      if (url && String(url).trim()) items.push({ type: 'image', url: String(url).trim() });
    });
    return items;
  }

  function getVideoEmbedUrl(url, autoplay) {
    if (!url) return '';
    url = String(url).trim();
    var m = url.match(/youtube\.com\/watch\?v=([^&\s]+)/) || url.match(/youtu\.be\/([^?\s]+)/);
    if (m) return 'https://www.youtube.com/embed/' + m[1] + (autoplay ? '?autoplay=1' : '');
    var v = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (v) return 'https://player.vimeo.com/video/' + v[1] + (autoplay ? '?autoplay=1' : '');
    return url;
  }

  function isVideoEmbed(url) {
    if (!url) return false;
    return /youtube|youtu\.be|vimeo\.com/i.test(String(url));
  }

  function createProdutoCardAmplo(prod) {
    const card = document.createElement('a');
    card.className = 'ad-card ad-card--amplo';
    card.href = prod.url;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';

    const precoHtml = prod.preco ? `<p class="adm-preco">${escapeHtml(prod.preco)}</p>` : '';
    const oferta = prod.oferta === true;
    const desconto = prod.desconto ? String(prod.desconto) : '';
    let badgesHtml = '';
    if (oferta) badgesHtml += '<span class="card-badge card-badge--oferta">OFERTA</span>';
    if (desconto) badgesHtml += '<span class="card-badge card-badge--desconto">-' + escapeHtml(desconto) + '%</span>';

    var mediaItems = getMediaItems(prod);
    var hasVideo = prod.video && String(prod.video).trim();
    var imgBlock = '';
    if (mediaItems.length > 0) {
      var first = mediaItems[0];
      var navPrev = mediaItems.length > 1 ? '<button type="button" class="card-nav card-nav--prev" aria-label="Anterior">‹</button>' : '';
      var navNext = mediaItems.length > 1 ? '<button type="button" class="card-nav card-nav--next" aria-label="Próximo">›</button>' : '';
      var imgDiv = '<div class="card-media-image"><img src="' + escapeHtml(first.url) + '" alt="' + escapeHtml(prod.titulo || 'Produto') + '" class="adm-preview-img" /></div>';
      var videoDiv = '<div class="card-media-video" style="display:none"></div>';
      var firstHtml = imgDiv + videoDiv;
      var playOverlay = hasVideo ? '<button type="button" class="card-video-play-btn" aria-label="Assistir vídeo">▶</button><div class="card-video-layer" style="display:none"><button type="button" class="card-video-close" aria-label="Fechar vídeo">×</button><div class="card-video-inner"></div></div>' : '';
      imgBlock = '<div class="card-media-wrap">' +
        playOverlay +
        navPrev +
        '<div class="adm-preview-media">' + firstHtml + '</div>' +
        navNext +
        '<div class="card-badges">' + badgesHtml + '</div></div>';
    }

    card.innerHTML = `
      <div class="ad-card-inner adm-preview-inner">
        ${imgBlock}
        <div class="adm-preview-content">
          <h3 class="ad-title">${escapeHtml(prod.titulo || '')}</h3>
          <p class="ad-desc">${escapeHtml(prod.descricao || '')}</p>
          ${precoHtml}
          <span class="ad-cta">VER OFERTA</span>
        </div>
      </div>
    `;

    if (mediaItems.length > 0) {
      var wrap = card.querySelector('.card-media-wrap');
      if (wrap) {
        wrap.setAttribute('data-media', JSON.stringify(mediaItems));
        wrap.setAttribute('data-media-index', '0');
        if (hasVideo) wrap.setAttribute('data-video-url', hasVideo);
      }
    }
    return card;
  }

  function createProdutoCardListado(prod) {
    const card = document.createElement('a');
    card.className = 'ad-card ad-card--listado produto-item';
    card.href = prod.url;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';

    const oferta = prod.oferta === true;
    const desconto = prod.desconto ? String(prod.desconto) : '';
    let badgesHtml = '';
    if (oferta) badgesHtml += '<span class="card-badge card-badge--oferta">OFERTA</span>';
    if (desconto) badgesHtml += '<span class="card-badge card-badge--desconto">-' + escapeHtml(desconto) + '%</span>';

    var mediaListado = getMediaItems(prod);
    var firstMediaListado = mediaListado.length > 0 ? mediaListado[0] : null;
    var hasVideoListado = prod.video && String(prod.video).trim();
    var thumbNavPrev = mediaListado.length > 1 ? '<button type="button" class="card-nav card-nav--prev" aria-label="Anterior">‹</button>' : '';
    var thumbNavNext = mediaListado.length > 1 ? '<button type="button" class="card-nav card-nav--next" aria-label="Próximo">›</button>' : '';
    var thumbPlayOverlay = hasVideoListado ? '<button type="button" class="card-video-play-btn" aria-label="Assistir vídeo">▶</button><div class="card-video-layer" style="display:none"><button type="button" class="card-video-close" aria-label="Fechar">×</button><div class="card-video-inner"></div></div>' : '';
    var thumbInner = '';
    if (firstMediaListado) {
      thumbInner = '<div class="card-media-image"><img src="' + escapeHtml(firstMediaListado.url) + '" alt="' + escapeHtml(prod.titulo || 'Produto') + '" /></div>' +
        '<div class="card-media-video" style="display:none"></div>';
    }
    const thumbBlock = mediaListado.length > 0
      ? '<div class="produto-item-thumb">' +
        (badgesHtml ? '<div class="card-badges">' + badgesHtml + '</div>' : '') +
        thumbPlayOverlay +
        thumbNavPrev +
        thumbInner +
        thumbNavNext +
        '</div>'
      : '<div class="produto-item-thumb">' +
        (badgesHtml ? '<div class="card-badges">' + badgesHtml + '</div>' : '') +
        '</div>';

    const precoHtml = prod.preco ? '<div class="produto-item-preco">' + escapeHtml(prod.preco) + '</div>' : '';
    const descHtml = prod.descricao ? '<div class="produto-item-desc">' + escapeHtml(prod.descricao) + '</div>' : '';

    card.innerHTML =
      '<div class="produto-item-row">' +
      '<div class="produto-item-left">' +
      thumbBlock +
      '<div class="produto-item-titulo">' + escapeHtml(prod.titulo || '') + '</div>' +
      descHtml +
      precoHtml +
      '</div>' +
      '</div>' +
      '<div class="produto-item-actions produto-item-actions--full">' +
      '<span class="produto-item-cta">VER OFERTA</span>' +
      '</div>';

    if (mediaListado.length > 0) {
      var thumbWrap = card.querySelector('.produto-item-thumb');
      if (thumbWrap) {
        thumbWrap.setAttribute('data-media', JSON.stringify(mediaListado));
        thumbWrap.setAttribute('data-media-index', '0');
        if (hasVideoListado) thumbWrap.setAttribute('data-video-url', hasVideoListado);
      }
    }
    return card;
  }

  function getCategoriaProduto(prod) {
    const c = prod.categoria;
    return (c && String(c).trim()) ? String(c).trim() : 'sem_categoria';
  }

  function renderProdutos() {
    const container = $('#adsContainer');
    const selectCat = $('#categorySelect');
    if (!container) return;

    var categoriaFiltro = selectCat ? (selectCat.value || '').trim() : '';
    var viewMode = ($('#viewModeSelect') && $('#viewModeSelect').value) || 'amplo';
    var isListado = viewMode === 'listado';

    function draw(produtos, error, source) {
      var list = Array.isArray(produtos) ? produtos : [];
      list = categoriaFiltro ? list.filter(function (p) { return getCategoriaProduto(p) === categoriaFiltro; }) : list;
      container.innerHTML = '';
      if (list.length === 0) {
        var msg = 'Nenhum produto cadastrado.';
        if (error) {
          msg = 'Erro ao carregar: ' + error + '. ';
        } else if (source === 'localStorage') {
          msg = 'Cadastre produtos pelo <a href="ADM.html">ADM</a> do site (mesmo endereço desta página) para eles aparecerem aqui.';
        } else {
          msg = 'Nenhum produto cadastrado. Cadastre em <a href="ADM.html">ADM</a>.';
        }
        container.innerHTML = '<p class="ads-empty">' + msg + '</p>';
      } else {
        list.forEach(function (p) {
          container.appendChild(isListado ? createProdutoCardListado(p) : createProdutoCardAmplo(p));
        });
      }
      container.classList.toggle('view-listado', isListado);
      container.classList.toggle('view-amplo', !isListado);
    }

    if (window.VitrineFirebase && typeof VitrineFirebase.getProdutos === 'function') {
      container.innerHTML = '<p class="ads-loading">Carregando produtos...</p>';
      VitrineFirebase.getProdutos().then(function (r) {
        var list = r && r.list ? r.list : (Array.isArray(r) ? r : []);
        var err = r && r.error ? r.error : null;
        var src = r && r.source ? r.source : 'localStorage';
        draw(list, err, src);
      });
    } else {
      try {
        var raw = localStorage.getItem('afiliado_espehlo_produtos_v1');
        draw(raw ? JSON.parse(raw) : [], null, 'localStorage');
      } catch (e) {
        draw([], null, 'localStorage');
      }
    }
  }

  function initViewMode() {
    var select = $('#viewModeSelect');
    if (select) select.addEventListener('change', renderProdutos);
  }

  function initFiltroCategoria() {
    const select = $('#categorySelect');
    if (select) {
      select.addEventListener('change', renderProdutos);
    }
  }

  function initSearchModal() {
    const overlay = $('#modalBusca');
    const btnBusca = $('#btnBusca');
    const btnFechar = $('#btnFecharBusca');
    const btnCancelar = $('#btnCancelarBusca');
    const form = $('#formBusca');
    const input = $('#inputBusca');

    if (!overlay || !btnBusca) return;

    function openModal() {
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      input.value = '';
      input.focus();
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    btnBusca.addEventListener('click', openModal);
    btnFechar.addEventListener('click', closeModal);
    if (btnCancelar) btnCancelar.addEventListener('click', closeModal);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal();
    });

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const termo = (input.value || '').trim();
        if (termo) {
          // Aqui você pode filtrar os anúncios ou redirecionar para busca
          console.log('Buscar:', termo);
        }
        closeModal();
      });
    }
  }

  function initCardNav() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.card-nav--prev, .card-nav--next');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      var wrap = btn.closest('[data-media]');
      if (!wrap) return;
      var data = wrap.getAttribute('data-media');
      if (!data) return;
      var arr;
      try {
        arr = JSON.parse(data);
      } catch (err) {
        return;
      }
      if (!arr.length) return;
      var idx = parseInt(wrap.getAttribute('data-media-index') || '0', 10);
      idx = btn.classList.contains('card-nav--next') ? (idx + 1) % arr.length : (idx - 1 + arr.length) % arr.length;
      wrap.setAttribute('data-media-index', String(idx));
      var item = arr[idx];
      if (!item || !item.url) return;
      var imgWrap = wrap.querySelector('.card-media-image');
      var videoWrap = wrap.querySelector('.card-media-video');
      if (imgWrap) {
        var img = imgWrap.querySelector('img');
        if (img) img.src = item.url;
        imgWrap.style.display = '';
      }
      if (videoWrap) {
        videoWrap.style.display = 'none';
        videoWrap.innerHTML = '';
      }
    }, true);
  }

  function initCardVideoPlay() {
    document.addEventListener('click', function (e) {
      var playBtn = e.target.closest('.card-video-play-btn');
      var closeBtn = e.target.closest('.card-video-close');
      if (playBtn) {
        e.preventDefault();
        e.stopPropagation();
        var wrap = playBtn.closest('.card-media-wrap, .produto-item-thumb');
        if (!wrap) return;
        var url = wrap.getAttribute('data-video-url');
        if (!url) return;
        var layer = wrap.querySelector('.card-video-layer');
        var inner = wrap.querySelector('.card-video-inner');
        if (!layer || !inner) return;
        inner.innerHTML = '';
        var embedUrl = getVideoEmbedUrl(url, true);
        if (isVideoEmbed(url)) {
          var iframe = document.createElement('iframe');
          iframe.src = embedUrl;
          iframe.setAttribute('frameborder', '0');
          iframe.setAttribute('allowfullscreen', '');
          iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
          inner.appendChild(iframe);
        } else {
          var video = document.createElement('video');
          video.src = url;
          video.controls = true;
          video.playsInline = true;
          inner.appendChild(video);
          video.play().catch(function () {});
        }
        layer.style.display = '';
      } else if (closeBtn) {
        e.preventDefault();
        e.stopPropagation();
        var wrap2 = closeBtn.closest('.card-media-wrap, .produto-item-thumb');
        if (!wrap2) return;
        var layer2 = wrap2.querySelector('.card-video-layer');
        var inner2 = wrap2.querySelector('.card-video-inner');
        if (layer2) layer2.style.display = 'none';
        if (inner2) inner2.innerHTML = '';
      }
    }, true);
  }

  function init() {
    if (window.VitrineFirebase && typeof VitrineFirebase.init === 'function') {
      var ok = VitrineFirebase.init();
      if (typeof console !== 'undefined' && console.log) {
        console.log('Vitrine Net: Firebase init =', ok ? 'OK' : 'fallback localStorage');
      }
    }
    renderProdutos();
    initViewMode();
    initFiltroCategoria();
    initSearchModal();
    initCardNav();
    initCardVideoPlay();
    document.documentElement.style.scrollBehavior = 'smooth';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
