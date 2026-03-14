(function () {
  'use strict';

  const STORAGE_KEY = 'afiliado_espehlo_produtos_v1';
  const THEME_STORAGE_KEY = 'afiliado_espehlo_theme_v1';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);

  function getProdutos() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function salvarProdutos(lista) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  }

  function renderPreviewBadges(container, oferta, desconto) {
    if (!container) return;
    let html = '';
    if (oferta) {
      html += '<span class="card-badge card-badge--oferta">OFERTA</span>';
    }
    if (desconto) {
      html += '<span class="card-badge card-badge--desconto">-' + desconto + '%</span>';
    }
    container.innerHTML = html;
  }

  function getImagensFromField() {
    var list = document.getElementById('listaImagensProduto');
    if (!list) return [];
    var chips = list.querySelectorAll('.adm-imagem-chip');
    var urls = [];
    for (var i = 0; i < chips.length; i++) {
      var url = (chips[i].getAttribute('data-url') || '').trim();
      if (url) urls.push(url);
    }
    return urls;
  }

  function addImagemUrl(url) {
    url = (url || '').trim();
    if (!url) return;
    var list = document.getElementById('listaImagensProduto');
    if (!list) return;
    var chip = document.createElement('span');
    chip.className = 'adm-imagem-chip';
    chip.setAttribute('data-url', url);
    chip.textContent = url.length > 50 ? url.slice(0, 47) + '...' : url;
    chip.title = url;
    var remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'adm-imagem-chip-remove';
    remove.setAttribute('aria-label', 'Remover');
    remove.textContent = '×';
    remove.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      chip.remove();
      atualizarPreview();
    });
    chip.appendChild(remove);
    list.appendChild(chip);
    atualizarPreview();
  }

  function limparListaImagens() {
    var list = document.getElementById('listaImagensProduto');
    if (list) list.innerHTML = '';
  }

  function atualizarPreview() {
    const titulo = $('#produtoTitulo').value || 'Título do produto';
    const descricao = $('#produtoDescricao').value || 'Descrição do produto aparecerá aqui.';
    const preco = $('#produtoPreco').value || 'R$ 0,00';
    const imagens = getImagensFromField();
    const oferta = $('#produtoOferta') && $('#produtoOferta').checked;
    const desconto = ($('#produtoDesconto') && $('#produtoDesconto').value) || '';

    $('#previewTitulo').textContent = titulo;
    $('#previewDescricao').textContent = descricao;
    $('#previewPreco').textContent = preco;
    const imgEl = $('#previewImagem');
    const wrap = $('#previewMediaWrap');
    const btnPrev = $('#previewNavPrev');
    const btnNext = $('#previewNavNext');
    if (imagens.length > 0) {
      imgEl.src = imagens[0];
      if (wrap) wrap.dataset.previewIndex = '0';
      if (wrap) wrap.dataset.previewImagens = JSON.stringify(imagens);
    } else {
      imgEl.removeAttribute('src');
      if (wrap) delete wrap.dataset.previewIndex;
      if (wrap) delete wrap.dataset.previewImagens;
    }
    if (btnPrev && btnNext) {
      if (imagens.length > 1) {
        btnPrev.style.display = '';
        btnNext.style.display = '';
      } else {
        btnPrev.style.display = 'none';
        btnNext.style.display = 'none';
      }
    }
    renderPreviewBadges($('#previewBadges'), oferta, desconto);
  }

  function previewNav(dir) {
    const wrap = $('#previewMediaWrap');
    if (!wrap || !wrap.dataset.previewImagens) return;
    var imagens;
    try {
      imagens = JSON.parse(wrap.dataset.previewImagens);
    } catch (e) { return; }
    if (!imagens.length) return;
    var idx = parseInt(wrap.dataset.previewIndex || '0', 10) + dir;
    if (idx < 0) idx = imagens.length - 1;
    if (idx >= imagens.length) idx = 0;
    wrap.dataset.previewIndex = String(idx);
    var imgEl = $('#previewImagem');
    if (imgEl) imgEl.src = imagens[idx];
  }

  function escapeHtml(text) {
    if (text == null) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function abrirModalProdutos() {
    const modal = $('#modalProdutos');
    const lista = $('#listaProdutosModal');
    const vazio = $('#modalProdutosVazio');
    const filtroCatSelect = $('#modalCategoriaFiltro');
    const filtroCat = filtroCatSelect ? (filtroCatSelect.value || '').trim() : '';
    if (!modal || !lista) return;

    let produtos = getProdutos();
    if (filtroCat) {
      produtos = produtos.filter(function (p) {
        var cat = (p.categoria && p.categoria.trim()) ? p.categoria.trim() : 'sem_categoria';
        return cat === filtroCat;
      });
    }
    lista.innerHTML = '';

    if (produtos.length === 0) {
      vazio.classList.add('visible');
      lista.classList.add('hidden');
    } else {
      vazio.classList.remove('visible');
      lista.classList.remove('hidden');
      var categoriaLabel = {
        sem_categoria: 'Sem categoria',
        achadinhos: 'Achadinhos',
        eletronicos: 'Eletrônicos',
        casa: 'Casa & Decoração',
        moda: 'Moda',
        beleza: 'Beleza'
      };

      produtos.forEach(function (p) {
        const li = document.createElement('li');
        li.className = 'produto-item';
        li.dataset.id = String(p.id);

        var firstImg = Array.isArray(p.imagem) ? (p.imagem[0] || '') : (p.imagem || '');
        const thumbHtml = firstImg
          ? '<div class="produto-item-thumb"><img src="' + escapeHtml(firstImg) + '" alt="" /></div>'
          : '<div class="produto-item-thumb"></div>';

        var cat = (p.categoria && p.categoria.trim()) ? p.categoria.trim() : 'sem_categoria';
        var catTexto = categoriaLabel[cat] || cat;

        li.innerHTML =
          thumbHtml +
          '<div class="produto-item-info">' +
          '<div class="produto-item-titulo">' + escapeHtml(p.titulo || '') + '</div>' +
          '<div class="produto-item-categoria">Categoria: ' + escapeHtml(catTexto) + '</div>' +
          '<div class="produto-item-preco">' + escapeHtml(p.preco || '') + '</div>' +
          '<div class="produto-item-actions">' +
          '<button type="button" class="modal-btn modal-btn--primary btn-editar-produto">EDITAR</button>' +
          '</div></div>';

        lista.appendChild(li);
      });
    }

    atualizarContadorProdutos();
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function fecharModalProdutos() {
    const modal = $('#modalProdutos');
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function atualizarContadorProdutos() {
    var total = getProdutos().length;
    var el = document.getElementById('contadorProdutos');
    if (el) el.textContent = total === 1 ? '1 produto cadastrado' : total + ' produtos cadastrados';
    var modalEl = document.getElementById('modalContadorProdutos');
    if (modalEl) modalEl.textContent = '(' + total + ')';
  }

  function preencherFormParaEdicao(p) {
    $('#produtoUrl').value = p.url || '';
    $('#produtoTitulo').value = p.titulo || '';
    $('#produtoDescricao').value = p.descricao || '';
    $('#produtoPreco').value = p.preco || '';
    limparListaImagens();
    var imgs = Array.isArray(p.imagem) ? p.imagem : (p.imagem ? [p.imagem] : []);
    imgs.forEach(function (url) {
      if (url) addImagemUrl(url);
    });
    if ($('#produtoVideo')) $('#produtoVideo').value = p.video || '';
    $('#produtoOferta').checked = p.oferta === true;
    $('#produtoDesconto').value = p.desconto || '';
    var cat = (p.categoria && p.categoria.trim()) ? p.categoria.trim() : 'sem_categoria';
    if ($('#produtoCategoria')) $('#produtoCategoria').value = cat;
    $('#formProduto').dataset.editingId = String(p.id);
    $('#btnSubmitProduto').textContent = 'SALVAR ALTERAÇÕES';
    var formFields = document.getElementById('formFieldsProduto');
    if (formFields) formFields.classList.add('is-visible');
    atualizarPreview();
  }

  function initModalProdutosDelegation() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.btn-editar-produto');
      if (!btn) return;
      var modal = document.getElementById('modalProdutos');
      if (!modal || !modal.classList.contains('is-open')) return;
      var lista = document.getElementById('listaProdutosModal');
      if (!lista || !lista.contains(btn)) return;
      e.preventDefault();
      e.stopPropagation();
      var li = btn.closest('.produto-item');
      if (!li) return;
      var id = li.getAttribute('data-id');
      if (!id) return;
      var produtos = getProdutos();
      var p = produtos.find(function (x) { return String(x.id) === id; });
      if (!p) return;
      fecharModalProdutos();
      preencherFormParaEdicao(p);
      var form = document.getElementById('formProduto');
      if (form) {
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        var firstInput = form.querySelector('input, textarea, select');
        if (firstInput) setTimeout(function () { firstInput.focus(); }, 100);
      }
    });

    var filtro = document.getElementById('modalCategoriaFiltro');
    if (filtro) {
      filtro.addEventListener('change', function () {
        abrirModalProdutos();
      });
    }
  }

  function initTema() {
    var select = $('#temaFrontend');
    if (!select) return;
    var saved = localStorage.getItem(THEME_STORAGE_KEY) || 'cyberpunk';
    select.value = saved;
    select.addEventListener('change', function () {
      var v = select.value || 'cyberpunk';
      localStorage.setItem(THEME_STORAGE_KEY, v);
      document.documentElement.setAttribute('data-theme', v);
    });
  }

  function init() {
    initTema();
    atualizarContadorProdutos();
    initModalProdutosDelegation();
    const form = $('#formProduto');
    const btnLimpar = $('#btnLimparProduto');
    const btnVerProdutos = $('#btnVerProdutos');
    const btnFecharModal = $('#btnFecharModalProdutos');

    if (!form) return;

    ['produtoTitulo', 'produtoDescricao', 'produtoPreco'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', atualizarPreview);
    });
    const elOferta = $('#produtoOferta');
    const elDesconto = $('#produtoDesconto');
    if (elOferta) elOferta.addEventListener('change', atualizarPreview);
    if (elDesconto) elDesconto.addEventListener('change', atualizarPreview);

    if (btnVerProdutos) {
      btnVerProdutos.addEventListener('click', abrirModalProdutos);
    }
    if (btnFecharModal) {
      btnFecharModal.addEventListener('click', fecharModalProdutos);
    }

    if ($('#previewNavPrev')) $('#previewNavPrev').addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); previewNav(-1); });
    if ($('#previewNavNext')) $('#previewNavNext').addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); previewNav(1); });

    var btnDadosProduto = document.getElementById('btnDadosProduto');
    var formFieldsProduto = document.getElementById('formFieldsProduto');
    if (btnDadosProduto && formFieldsProduto) {
      btnDadosProduto.addEventListener('click', function () {
        formFieldsProduto.classList.toggle('is-visible');
      });
    }
    $('#modalProdutos') && $('#modalProdutos').addEventListener('click', function (e) {
      if (e.target.id === 'modalProdutos') fecharModalProdutos();
    });

    btnLimpar.addEventListener('click', function () {
      form.reset();
      form.dataset.editingId = '';
      limparListaImagens();
      $('#btnSubmitProduto').textContent = 'CADASTRAR';
      setTimeout(atualizarPreview, 0);
    });

    var btnAddImagem = document.getElementById('btnAddImagem');
    var inputImagem = document.getElementById('produtoImagem');
    if (btnAddImagem && inputImagem) {
      btnAddImagem.addEventListener('click', function () {
        var url = (inputImagem.value || '').trim();
        if (url) {
          addImagemUrl(url);
          inputImagem.value = '';
        }
      });
      inputImagem.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          var url = (inputImagem.value || '').trim();
          if (url) {
            addImagemUrl(url);
            inputImagem.value = '';
          }
        }
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var imagens = getImagensFromField();
      if (!imagens.length) {
        alert('Adicione ao menos uma URL de imagem (digite e clique em Adicionar).');
        return;
      }

      const editingId = form.dataset.editingId ? String(form.dataset.editingId) : '';
      var catVal = $('#produtoCategoria') ? $('#produtoCategoria').value : '';
      var categoria = (catVal && catVal.trim()) ? catVal.trim() : 'sem_categoria';

      var videoEl = document.getElementById('produtoVideo');
      var videoUrl = (videoEl && videoEl.value && typeof videoEl.value === 'string') ? videoEl.value.trim() : '';
      if (!videoUrl) videoUrl = null;

      const produto = {
        id: editingId ? parseInt(editingId, 10) : Date.now(),
        url: $('#produtoUrl').value.trim(),
        titulo: $('#produtoTitulo').value.trim(),
        descricao: $('#produtoDescricao').value.trim(),
        preco: $('#produtoPreco').value.trim(),
        imagem: getImagensFromField(),
        video: videoUrl,
        categoria: categoria,
        oferta: $('#produtoOferta') && $('#produtoOferta').checked,
        desconto: ($('#produtoDesconto') && $('#produtoDesconto').value) || null
      };

      const lista = getProdutos();

      if (editingId) {
        const idx = lista.findIndex(function (x) { return String(x.id) === editingId; });
        if (idx !== -1) {
          lista[idx] = produto;
          salvarProdutos(lista);
          alert('Produto atualizado com sucesso.');
        }
        form.dataset.editingId = '';
        $('#btnSubmitProduto').textContent = 'CADASTRAR';
      } else {
        lista.unshift(produto);
        salvarProdutos(lista);
        alert('Produto cadastrado com sucesso! Abra o index.html para ver em PROPAGANDAS ATIVAS.');
      }

      form.reset();
      limparListaImagens();
      atualizarPreview();
      atualizarContadorProdutos();
    });

    atualizarPreview();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

