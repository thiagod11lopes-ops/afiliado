# Análise — Dados no Firebase (Firestore)

## Resumo: **está tudo certo**

O fluxo de dados entre o app e o Firestore está consistente. Abaixo o que foi verificado.

---

## 1. Configuração (`js/firebase-config.js`)

- **Projeto:** `afiliado-2879f` (igual ao Hosting e ao Console).
- **Variável:** `FIREBASE_CONFIG` com `apiKey`, `authDomain`, `projectId`, etc.
- **Uso:** Se a config estiver preenchida (não for `SUA_API_KEY`), o app usa Firestore.

---

## 2. Camada Firestore (`js/firebase-db.js`)

| Item | Valor | Observação |
|------|--------|------------|
| Coleção | `vitrine` | Única coleção usada para produtos. |
| Documento | `produtos` | Um único documento com toda a lista. |
| Campo | `items` | Array de objetos (cada objeto = 1 produto). |

- **Leitura:** `getProdutosFromFirestore()` lê `vitrine/produtos` e devolve `data.items` (ou `[]`).
- **Escrita:** `saveProdutosToFirestore(produtos)` grava `{ items: produtos }` em `vitrine/produtos`.
- **Fallback:** Se a config for inválida ou der erro, usa `localStorage` (chave `afiliado_espehlo_produtos_v1`).
- **Erro ao salvar:** Mostra `alert` com a mensagem e ainda grava no `localStorage`.

---

## 3. Estrutura de cada produto (objeto em `items`)

Campos que vão para o Firestore (e que o ADM envia):

| Campo | Tipo | Exemplo / Observação |
|-------|------|----------------------|
| `id` | número | `Date.now()` ou id ao editar |
| `url` | string | Link do afiliado |
| `titulo` | string | Nome do produto |
| `descricao` | string | Texto descritivo |
| `preco` | string | Ex.: "R$ 29,90" |
| `imagem` | array de strings | Uma ou mais URLs de imagem |
| `video` | string ou null | URL do vídeo (opcional) |
| `categoria` | string | Ex.: "eletronicos", "sem_categoria" |
| `oferta` | boolean | true/false |
| `desconto` | string ou null | Ex.: "10", "20" |

Todos são tipos suportados pelo Firestore (string, number, boolean, null, array, object). Nada precisa ser alterado na estrutura para o Firebase aceitar.

---

## 4. Fluxo no ADM (`js/adm.js`)

1. **Ao abrir o modal “Ver produtos”:** chama `VitrineFirebase.getProdutos()` e exibe a lista (filtrada por categoria se houver).
2. **Ao cadastrar/editar:** monta o objeto `produto` com os campos acima → chama `VitrineFirebase.getProdutos().then(doSave)` → em `doSave` atualiza ou insere o produto no array e chama `VitrineFirebase.saveProdutos(lista)`.
3. **Inicialização:** `VitrineFirebase.init()` é chamado no `init()` do ADM.

Ou seja: **tudo que é cadastrado/alterado no ADM é enviado para o Firestore** (quando a config está válida), no documento `vitrine/produtos`, campo `items`.

---

## 5. Fluxo na vitrine (`js/app.js`)

1. No `init()`: chama `VitrineFirebase.init()` e depois `renderProdutos()`.
2. `renderProdutos()` mostra “Carregando produtos...”, chama `VitrineFirebase.getProdutos()` e, ao receber o array, chama `draw(produtos)` para montar os cards (ou “Nenhum produto cadastrado” se o array for vazio).

Ou seja: **a vitrine lê sempre do Firestore** (ou do `localStorage` em fallback) e exibe exatamente o que está em `items`.

---

## 6. Ordem dos scripts (index e ADM)

Em ambos os HTML:

1. Firebase App compat  
2. Firebase Firestore compat  
3. `firebase-config.js`  
4. `firebase-db.js`  
5. `app.js` ou `adm.js`

A ordem está correta para o Firestore ser inicializado e usado sem conflito.

---

## 7. O que conferir no Console do Firebase

- **Firestore → Dados:** deve existir a coleção **vitrine**, documento **produtos**, com um campo **items** (tipo: array). Cada elemento do array é um produto com os campos listados acima.
- **Regras:** a regra que você está usando (`match /vitrine/{document=**}; allow read, write: if true`) permite leitura e escrita. Lembre de **Publicar** após qualquer alteração.

---

## Conclusão

- Config, coleção, documento e campo estão corretos.
- Estrutura dos produtos é compatível com o Firestore.
- ADM envia e a vitrine lê os mesmos dados do Firestore (ou do `localStorage` em fallback).
- Ordem dos scripts e chamadas a `VitrineFirebase` estão corretas.

Ou seja: **está tudo certo com os dados que vão para o Firebase.** Se algo não aparecer na vitrine, vale checar: (1) se o cadastro foi feito pelo ADM no site publicado (`https://afiliado-2879f.web.app/ADM.html`) e (2) se em Firestore → Dados o documento `vitrine/produtos` existe e o array `items` tem os produtos esperados.
