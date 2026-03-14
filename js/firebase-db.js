/**
 * Vitrine Net — Firebase Firestore como backend dos produtos
 * Usa a coleção "vitrine", documento "produtos", campo "items" (array).
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'afiliado_espehlo_produtos_v1';
  var db = null;
  var configValid = false;

  function init() {
    if (typeof FIREBASE_CONFIG === 'undefined' || !FIREBASE_CONFIG.apiKey || FIREBASE_CONFIG.apiKey === 'SUA_API_KEY') {
      return false;
    }
    try {
      if (typeof firebase === 'undefined') {
        console.warn('Firebase SDK não carregou. Use o Firestore via tag <script>.');
        return false;
      }
      if (!firebase.apps || firebase.apps.length === 0) {
        firebase.initializeApp(FIREBASE_CONFIG);
      }
      db = firebase.firestore();
      configValid = true;
      return true;
    } catch (e) {
      console.warn('Firebase não configurado, usando localStorage.', e);
      return false;
    }
  }

  function getProdutosFromFirestore() {
    return new Promise(function (resolve) {
      if (!configValid || !db) {
        if (typeof console !== 'undefined' && console.log) {
          console.log('Vitrine Net: Firebase nao inicializado, usando localStorage.');
        }
        try {
          var raw = localStorage.getItem(STORAGE_KEY);
          resolve(raw ? JSON.parse(raw) : []);
        } catch (e) {
          resolve([]);
        }
        return;
      }
      db.collection('vitrine').doc('produtos').get()
        .then(function (doc) {
          var data = doc.exists && doc.data() ? doc.data() : {};
          var items = data.items;
          var list = Array.isArray(items) ? items : [];
          if (typeof console !== 'undefined' && console.log) {
            console.log('Vitrine Net: carregados', list.length, 'produtos do Firestore.');
          }
          resolve(list);
        })
        .catch(function (err) {
          console.warn('Vitrine Net: erro ao ler Firestore, usando localStorage.', err);
          try {
            var raw = localStorage.getItem(STORAGE_KEY);
            resolve(raw ? JSON.parse(raw) : []);
          } catch (e) {
            resolve([]);
          }
        });
    });
  }

  function saveProdutosToFirestore(produtos) {
    return new Promise(function (resolve, reject) {
      if (!configValid || !db) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(produtos));
          resolve();
        } catch (e) {
          reject(e);
        }
        return;
      }
      db.collection('vitrine').doc('produtos').set({ items: produtos })
        .then(resolve)
        .catch(function (err) {
          console.error('Erro ao salvar no Firestore:', err);
          var msg = (err && err.message) ? err.message : String(err);
          if (typeof alert === 'function') {
            alert('Não foi possível salvar no Firestore.\nErro: ' + msg + '\n\nOs dados foram salvos só no navegador (localStorage). Verifique as regras do Firestore e publique-as.');
          }
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(produtos));
            resolve();
          } catch (e) {
            reject(e);
          }
        });
    });
  }

  window.VitrineFirebase = {
    init: init,
    getProdutos: getProdutosFromFirestore,
    saveProdutos: saveProdutosToFirestore,
    isUsingFirestore: function () { return configValid && db; }
  };
})();
