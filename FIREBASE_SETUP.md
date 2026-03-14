# Configurar o Firebase como backend (Vitrine Net)

O sistema já está preparado para usar **Firestore** como backend. Siga estes passos no seu projeto Firebase.

---

## Se você recriou o projeto (novo projeto do zero)

1. **`js/firebase-config.js`** — Cole a nova configuração (firebaseConfig) do novo projeto; o arquivo já está com placeholders.
2. **Firestore** — Crie o banco de dados no novo projeto (etapa 3 abaixo) e publique as regras (etapa 4).
3. **Deploy** — No terminal: `firebase use --add` (escolha o novo projeto) e depois `firebase deploy --only hosting`. O `.firebaserc` será atualizado ao usar `firebase use --add`.

---

## 1. Registrar o app Web

1. No Firebase Console, abra o projeto **afiliado**.
2. Clique no **ícone de engrenagem** (Configurações do projeto) → **Configuração do projeto**.
3. Em **Seus aplicativos**, clique em **</>** (Web).
4. Dê um apelido (ex: "Vitrine Net") e marque **Também configurar Firebase Hosting** se quiser publicar por aí depois.
5. Clique em **Registrar app**. Copie o objeto `firebaseConfig` que aparecer.

## 2. Colar a configuração no projeto

1. Abra o arquivo **`js/firebase-config.js`**.
2. Substitua o objeto `FIREBASE_CONFIG` pelo que você copiou do Firebase (mantenha o nome `FIREBASE_CONFIG`).

Exemplo do que o Firebase mostra:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "afiliado-xxxxx.firebaseapp.com",
  projectId: "afiliado",
  storageBucket: "afiliado-xxxxx.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

No seu arquivo deve ficar:

```javascript
var FIREBASE_CONFIG = {
  apiKey: "AIza...",
  authDomain: "afiliado-xxxxx.firebaseapp.com",
  projectId: "afiliado",
  storageBucket: "afiliado-xxxxx.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## 3. Criar o banco Firestore

1. No menu lateral do Firebase Console, clique em **Criar banco de dados** (ou **Firestore Database**).
2. Escolha **Iniciar no modo de teste** (para desenvolvimento).
3. Escolha uma região (ex: `southamerica-east1`) e confirme.

O código usa:

- **Coleção:** `vitrine`
- **Documento:** `produtos`
- **Campo:** `items` (array de produtos)

O documento é criado automaticamente na primeira vez que você salvar um produto pelo ADM.

## 4. (Opcional) Regras de segurança

No Firestore, em **Regras**, para deixar apenas leitura/escrita autenticada no futuro, você pode usar algo como:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /vitrine/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

Enquanto estiver em **modo de teste**, leitura e escrita estão abertas por um tempo limitado (cerca de 30 dias). Depois ajuste as regras e, se quiser, ative **Autenticação** no Firebase para proteger o ADM.

## 5. Testar

1. Abra **ADM.html** no navegador.
2. Cadastre um produto e salve.
3. Abra **index.html** e confira se o produto aparece.

Se o `firebase-config.js` ainda estiver com os placeholders (`SUA_API_KEY`, etc.), o app continua usando **localStorage** normalmente.
