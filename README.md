# Diakoboulon

Marketplace B2C connectant les entreprises et artisans maliens aux acheteurs, au Mali et dans la diaspora. Application Next.js (React + Node.js).

## 1. Lancer le projet en local

Prérequis : installer [Node.js](https://nodejs.org) (version 18 ou plus) sur votre ordinateur.

```bash
npm install
npm run dev
```

Ouvrez ensuite http://localhost:3000 — le site fonctionne immédiatement avec des produits de démonstration, sans aucune configuration.

## 2. Déployer sur Vercel (gratuit, ultra rapide)

1. Créez un compte sur [vercel.com](https://vercel.com) (connexion possible avec GitHub).
2. Mettez ce projet sur GitHub (créez un dépôt, poussez le code).
3. Sur Vercel : "Add New Project" → sélectionnez le dépôt → "Deploy". Rien à configurer, Next.js est détecté automatiquement.
4. Une fois déployé, Vercel vous donne une URL (ex: diakoboulon.vercel.app) et les enregistrements DNS à utiliser pour votre propre domaine.

## 3. Connecter votre domaine Hostinger

Dans Vercel : Project → Settings → Domains → ajoutez `diakoboulon.com` (votre domaine).
Vercel affiche alors un enregistrement A et/ou CNAME à ajouter.

Dans Hostinger (hPanel) → Domaines → DNS / Zone DNS :
- Ajoutez l'enregistrement **A** fourni par Vercel (pointant vers son adresse IP) pour le domaine racine.
- Ajoutez l'enregistrement **CNAME** fourni par Vercel pour le sous-domaine `www`.

Le SSL (cadenas https) est ensuite généré automatiquement par Vercel, gratuitement.

## 4. Ajouter une vraie base de données (Supabase)

Tant que vous ne faites rien, le site utilise les produits de démonstration dans `lib/data.js`. Pour passer à de vraies boutiques et commandes persistantes :

1. Créez un compte gratuit sur [supabase.com](https://supabase.com) et un nouveau projet.
2. Dans l'onglet **SQL Editor**, exécutez le contenu du fichier `supabase/schema.sql` de ce projet.
3. Dans **Project Settings → API**, copiez l'URL du projet et la clé "anon public".
4. Créez un fichier `.env.local` à la racine (copiez `.env.local.example`) et collez ces deux valeurs.
5. Redéployez (ou relancez `npm run dev`) — le site lira désormais les produits depuis Supabase.

## 5. Activer les paiements Mobile Money avec SenePay

Le site est déjà branché sur **SenePay** (sene-pay.com), une passerelle qui couvre le Mali (Orange Money, Moov Africa) ainsi que le Sénégal, la Côte d'Ivoire, le Burkina Faso et d'autres pays d'Afrique de l'Ouest/Centrale.

1. Créez un compte marchand sur [sene-pay.com](https://sene-pay.com) et complétez la vérification (KYC).
2. Une fois validé, dans votre tableau de bord : **Api & Dev → Clés API → Générer des clés**. Vous obtenez une `X-Api-Key`, une `X-Api-Secret` et un `webhookSigningSecret` (affiché une seule fois — conservez-le).
3. Ajoutez ces trois valeurs dans `.env.local` (voir `.env.local.example`) :
   ```
   SENEPAY_API_KEY=pk_test_...
   SENEPAY_API_SECRET=sk_test_...
   SENEPAY_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_SITE_URL=https://diakoboulon.com
   ```
4. Utilisez d'abord les clés **test** (`pk_test_`/`sk_test_`) pour vérifier que tout fonctionne, avec les numéros de test du Mali fournis par SenePay (ex: `+22360000001` = paiement réussi simulé). Passez aux clés **live** une fois prêt.
5. Sans ces clés, le site fonctionne quand même : les commandes sont simplement simulées (utile pour démontrer le site avant d'avoir un compte marchand validé).

**Comment ça marche concrètement :**
- Le client choisit "Mobile Money" au moment de payer → `app/api/checkout/route.js` crée une session auprès de SenePay → le client est redirigé vers la page de paiement sécurisée de SenePay (Orange Money, Moov Africa ou Wave, au choix du client) → une fois payé, il revient automatiquement sur `/paiement/succes`.
- En parallèle, SenePay notifie votre site via `app/api/webhooks/senepay/route.js` — c'est la confirmation la plus fiable (à utiliser pour marquer une commande "payée" dans votre base de données une fois Supabase branché).
- "Paiement à la livraison" reste géré manuellement, sans passer par SenePay.

Documentation complète : [api.sene-pay.com/docs.html](https://api.sene-pay.com/docs.html)

## 6. Structure du projet

```
app/
  page.js                     → page d'accueil (catalogue)
  produit/[id]/page.js        → fiche produit
  panier/page.js              → panier
  commande/page.js            → choix du paiement, lance la session SenePay
  connexion/page.js           → connexion (à brancher sur Supabase Auth)
  inscription/page.js         → création de compte client
  vendre/page.js               → inscription vendeur
  paiement/succes/page.js     → retour après paiement réussi (SenePay)
  paiement/annule/page.js     → retour après annulation
  api/checkout/route.js       → crée la session de paiement SenePay
  api/webhooks/senepay/route.js → confirmation fiable des paiements (signature vérifiée)
components/            → Header, ProductCard, panier (contexte global)
lib/data.js            → produits de démonstration + connexion Supabase
supabase/schema.sql    → tables à créer dans Supabase
```

## 7. Prochaines étapes suggérées

- Remplacer les produits de démo par vos vrais vendeurs (via Supabase).
- Ajouter l'authentification (compte acheteur/vendeur) — Supabase Auth s'intègre facilement.
- Ajouter le suivi de commande détaillé (statuts "en préparation / expédiée / livrée").
- Transformer le site en application installable (PWA) pour les connexions instables.
