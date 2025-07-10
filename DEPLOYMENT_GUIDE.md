# 🚀 Guide de Déploiement - ABA Creative Group
## Déploiement sur abacreativegroup.com via cPanel

### 📋 Prérequis

1. **Accès cPanel** à votre hébergement
2. **Projet Supabase** configuré
3. **Node.js** installé localement pour le build

---

## 🔧 Étape 1 : Configuration Supabase

### 1.1 Finaliser la migration Supabase
1. Connectez-vous à votre [tableau de bord Supabase](https://supabase.com/dashboard)
2. Allez dans **SQL Editor**
3. Exécutez la migration corrigée : `supabase/migrations/20250710091750_morning_hill.sql`
4. Vérifiez que les tables sont créées correctement

### 1.2 Récupérer les clés Supabase
```
URL du projet : https://votre-projet.supabase.co
Clé anonyme : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🏗️ Étape 2 : Préparation du Build

### 2.1 Configuration des variables d'environnement
Créez un fichier `.env` avec vos vraies clés Supabase :

```env
VITE_SUPABASE_URL=https://votre-projet-reel.supabase.co
VITE_SUPABASE_ANON_KEY=votre_vraie_cle_anonyme
```

### 2.2 Build de production
```bash
# Installation des dépendances
npm install

# Build optimisé pour la production
npm run build
```

Cela créera un dossier `dist/` avec tous les fichiers optimisés.

---

## 📁 Étape 3 : Upload via cPanel

### 3.1 Accès au gestionnaire de fichiers
1. Connectez-vous à votre **cPanel**
2. Ouvrez **Gestionnaire de fichiers** (File Manager)
3. Naviguez vers `public_html/` (ou le dossier de votre domaine)

### 3.2 Upload des fichiers
1. **Supprimez** le contenu existant de `public_html/` (sauvegardez si nécessaire)
2. **Uploadez** tout le contenu du dossier `dist/` vers `public_html/`
3. **Structure finale** :
   ```
   public_html/
   ├── index.html
   ├── assets/
   │   ├── index-[hash].js
   │   ├── index-[hash].css
   │   └── ...
   ├── Logo_ABA-removebg-preview.png
   └── vite.svg
   ```

### 3.3 Configuration du serveur web
Créez un fichier `.htaccess` dans `public_html/` :

```apache
# Redirection pour SPA (Single Page Application)
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Handle Angular and React Router
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Compression GZIP
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/plain
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/xml
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE application/xml
  AddOutputFilterByType DEFLATE application/xhtml+xml
  AddOutputFilterByType DEFLATE application/rss+xml
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache des assets
<IfModule mod_expires.c>
  ExpiresActive on
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
```

---

## 🔐 Étape 4 : Configuration de sécurité

### 4.1 Variables d'environnement sécurisées
Si votre hébergeur supporte les variables d'environnement :
1. Allez dans **cPanel > Variables d'environnement**
2. Ajoutez :
   - `VITE_SUPABASE_URL` = votre URL Supabase
   - `VITE_SUPABASE_ANON_KEY` = votre clé anonyme

### 4.2 Protection du dossier admin (optionnel)
Créez un `.htaccess` dans un sous-dossier pour protéger l'accès admin :

```apache
# Protection par mot de passe (optionnel)
AuthType Basic
AuthName "Zone d'administration ABA"
AuthUserFile /path/to/.htpasswd
Require valid-user
```

---

## 🌐 Étape 5 : Configuration DNS et domaine

### 5.1 Vérification du domaine
1. Assurez-vous que **abacreativegroup.com** pointe vers votre serveur
2. Configurez les sous-domaines si nécessaire :
   - `www.abacreativegroup.com`
   - `admin.abacreativegroup.com` (optionnel)

### 5.2 SSL/HTTPS
1. Dans cPanel, allez dans **SSL/TLS**
2. Activez **Let's Encrypt** ou uploadez votre certificat
3. Forcez la redirection HTTPS

---

## ✅ Étape 6 : Tests et vérification

### 6.1 Tests fonctionnels
1. **Accédez** à https://abacreativegroup.com
2. **Testez** la navigation sur toutes les pages
3. **Vérifiez** le formulaire de contact
4. **Testez** l'accès admin avec `admin` / `Admin123`

### 6.2 Vérification Supabase
1. Dans l'admin, vérifiez le **statut Supabase** (vert = connecté)
2. **Testez** l'ajout d'un message de contact
3. **Vérifiez** dans Supabase que les données arrivent

### 6.3 Tests de performance
1. **Google PageSpeed Insights** : https://pagespeed.web.dev/
2. **GTmetrix** : https://gtmetrix.com/
3. Vérifiez les temps de chargement

---

## 🔧 Étape 7 : Maintenance et monitoring

### 7.1 Monitoring automatique
Le système inclut :
- ✅ **Détection automatique** de la connexion Supabase
- 📦 **Fallback localStorage** en cas de problème
- 🔄 **Reconnexion automatique**

### 7.2 Sauvegardes
1. **Supabase** : Sauvegardes automatiques
2. **Fichiers** : Sauvegarde régulière via cPanel
3. **Export admin** : Fonction d'export intégrée

### 7.3 Mises à jour
Pour mettre à jour :
1. Modifiez le code localement
2. Exécutez `npm run build`
3. Uploadez le nouveau contenu de `dist/`

---

## 🚨 Dépannage

### Problème : Page blanche
- **Vérifiez** les erreurs dans la console (F12)
- **Contrôlez** le fichier `.htaccess`
- **Vérifiez** les permissions des fichiers (644 pour les fichiers, 755 pour les dossiers)

### Problème : Supabase non connecté
- **Vérifiez** les variables d'environnement
- **Testez** la connexion depuis l'admin
- **Contrôlez** les CORS dans Supabase

### Problème : Formulaires ne fonctionnent pas
- **Vérifiez** les politiques RLS dans Supabase
- **Contrôlez** les permissions `anon` pour l'insertion
- **Testez** avec les outils de développement

---

## 📞 Support

En cas de problème :
1. **Logs cPanel** : Consultez les logs d'erreur
2. **Console navigateur** : Vérifiez les erreurs JavaScript
3. **Supabase logs** : Consultez les logs dans le dashboard Supabase

---

## 🎉 Félicitations !

Votre site **ABA Creative Group** est maintenant déployé sur **abacreativegroup.com** avec :
- ✅ Interface publique moderne et responsive
- ✅ Système d'administration complet
- ✅ Base de données Supabase sécurisée
- ✅ Fallback localStorage automatique
- ✅ Optimisations de performance
- ✅ Sécurité et monitoring intégrés

**Accès admin** : https://abacreativegroup.com (cliquez sur l'icône de connexion dans le footer)
**Identifiants** : `admin` / `Admin123`