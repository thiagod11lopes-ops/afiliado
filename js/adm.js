(function () {
  'use strict';

  const THEME_STORAGE_KEY = 'afiliado_espehlo_theme_v1';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);

  function getProdutosSync() {
    try {
      var raw = localStorage.getItem('afiliado_espehlo_produtos_v1');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function toArray(val) {
    if (Array.isArray(val)) return val;
    if (val && val.list && Array.isArray(val.list)) return val.list;
    return [];
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
    try {
      var tituloEl = document.getElementById('produtoTitulo');
      var descricaoEl = document.getElementById('produtoDescricao');
      var precoEl = document.getElementById('produtoPreco');
      var titulo = (tituloEl && tituloEl.value) ? tituloEl.value : 'Título do produto';
      var descricao = (descricaoEl && descricaoEl.value) ? descricaoEl.value : 'Descrição do produto aparecerá aqui.';
      var preco = (precoEl && precoEl.value) ? precoEl.value : 'R$ 0,00';
      var imagens = getImagensFromField();
      var ofertaEl = document.getElementById('produtoOferta');
      var descontoEl = document.getElementById('produtoDesconto');
      var oferta = ofertaEl ? ofertaEl.checked : false;
      var desconto = descontoEl ? (descontoEl.value || '') : '';

      var pt = document.getElementById('previewTitulo');
      var pd = document.getElementById('previewDescricao');
      var pp = document.getElementById('previewPreco');
      if (pt) pt.textContent = titulo;
      if (pd) pd.textContent = descricao;
      if (pp) pp.textContent = preco;
      var imgEl = document.getElementById('previewImagem');
      var wrap = document.getElementById('previewMediaWrap');
      var btnPrev = document.getElementById('previewNavPrev');
      var btnNext = document.getElementById('previewNavNext');
      if (imagens.length > 0 && imgEl) {
        imgEl.src = imagens[0];
        if (wrap) { wrap.dataset.previewIndex = '0'; wrap.dataset.previewImagens = JSON.stringify(imagens); }
      } else {
        if (imgEl) imgEl.removeAttribute('src');
        if (wrap) { delete wrap.dataset.previewIndex; delete wrap.dataset.previewImagens; }
      }
      if (btnPrev && btnNext) {
        btnPrev.style.display = imagens.length > 1 ? '' : 'none';
        btnNext.style.display = imagens.length > 1 ? '' : 'none';
      }
      renderPreviewBadges(document.getElementById('previewBadges'), oferta, desconto);
    } catch (err) {
      if (typeof console !== 'undefined') console.warn('atualizarPreview:', err);
    }
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
    if (window.VitrineFirebase && typeof VitrineFirebase.init === 'function') {
      VitrineFirebase.init();
    }
    initTema();
    const form = $('#formProduto');
    const btnLimpar = $('#btnLimparProduto');

    if (!form) return;

    ['produtoTitulo', 'produtoDescricao', 'produtoPreco', 'produtoUrl'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', atualizarPreview);
    });
    const elOferta = $('#produtoOferta');
    const elDesconto = $('#produtoDesconto');
    const elCategoria = $('#produtoCategoria');
    if (elOferta) elOferta.addEventListener('change', atualizarPreview);
    if (elDesconto) elDesconto.addEventListener('change', atualizarPreview);
    if (elCategoria) elCategoria.addEventListener('change', atualizarPreview);
    var formFields = document.getElementById('formFieldsProduto');
    if (formFields) {
      formFields.addEventListener('input', atualizarPreview);
      formFields.addEventListener('change', atualizarPreview);
    }

    if ($('#previewNavPrev')) $('#previewNavPrev').addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); previewNav(-1); });
    if ($('#previewNavNext')) $('#previewNavNext').addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); previewNav(1); });

    var btnDadosProduto = document.getElementById('btnDadosProduto');
    var formFieldsProduto = document.getElementById('formFieldsProduto');
    if (formFieldsProduto) {
      formFieldsProduto.classList.add('is-visible');
    }
    if (btnDadosProduto && formFieldsProduto) {
      btnDadosProduto.addEventListener('click', function () {
        formFieldsProduto.classList.toggle('is-visible');
        setTimeout(atualizarPreview, 0);
      });
    }

    if (btnLimpar) {
      btnLimpar.addEventListener('click', function () {
        form.reset();
        form.dataset.editingId = '';
        limparListaImagens();
        var btnSubmit = document.getElementById('btnSubmitProduto');
        if (btnSubmit) btnSubmit.textContent = 'CADASTRAR';
        setTimeout(atualizarPreview, 0);
      });
    }

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

    function enviarFormulario() {
      var url = ($('#produtoUrl') && $('#produtoUrl').value || '').trim();
      var titulo = ($('#produtoTitulo') && $('#produtoTitulo').value || '').trim();
      var preco = ($('#produtoPreco') && $('#produtoPreco').value || '').trim();
      var descricao = ($('#produtoDescricao') && $('#produtoDescricao').value || '').trim();
      if (!url) {
        alert('Preencha o link do produto.');
        return;
      }
      if (!titulo) {
        alert('Preencha o título.');
        return;
      }
      if (!preco) {
        alert('Preencha o preço.');
        return;
      }
      if (!descricao) {
        alert('Preencha a descrição.');
        return;
      }
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

      function doSave(lista) {
        if (editingId) {
          var idx = lista.findIndex(function (x) { return String(x.id) === editingId; });
          if (idx !== -1) {
            lista[idx] = produto;
            form.dataset.editingId = '';
            $('#btnSubmitProduto').textContent = 'CADASTRAR';
          }
        } else {
          lista.unshift(produto);
        }
        var savePromise = (window.VitrineFirebase && typeof VitrineFirebase.saveProdutos === 'function')
          ? VitrineFirebase.saveProdutos(lista)
          : Promise.resolve((function () { try { localStorage.setItem('afiliado_espehlo_produtos_v1', JSON.stringify(lista)); } catch (e) {} })());
        savePromise.then(function () {
          alert(editingId ? 'Produto atualizado com sucesso.' : 'Produto cadastrado com sucesso! Abra a vitrine para ver.');
          form.reset();
          limparListaImagens();
          atualizarPreview();
        }).catch(function (err) {
          var msg = (err && err.message) ? err.message : String(err);
          alert('Não foi possível salvar no servidor (Firestore).\n\nErro: ' + msg + '\n\nVerifique: 1) Firebase Console > Firestore > Regras estão publicadas. 2) Configurações do projeto > Domínios autorizados inclui seu site.');
        });
      }

      if (window.VitrineFirebase && typeof VitrineFirebase.getProdutos === 'function') {
        VitrineFirebase.getProdutos().then(function (r) {
          var list = toArray(r && r.list ? r.list : r);
          doSave(list);
        }).catch(function () {
          doSave(getProdutosSync());
        });
      } else {
        doSave(getProdutosSync());
      }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      try {
        enviarFormulario();
      } catch (err) {
        alert('Erro ao cadastrar: ' + (err && err.message ? err.message : String(err)));
        if (typeof console !== 'undefined') console.error(err);
      }
    });

    var btnSubmit = document.getElementById('btnSubmitProduto');
    if (btnSubmit) {
      btnSubmit.addEventListener('click', function () {
        try {
          enviarFormulario();
        } catch (err) {
          alert('Erro ao cadastrar: ' + (err && err.message ? err.message : String(err)));
          if (typeof console !== 'undefined') console.error(err);
        }
      });
    }

    setTimeout(atualizarPreview, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

