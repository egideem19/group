# ABA Creative Group - Système d'Administration

## 🚀 Configuration Supabase

### 1. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre URL de projet et votre clé anonyme

### 2. Configuration des variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_anonyme_ici
```

### 3. Exécuter les migrations

1. Dans votre tableau de bord Supabase, allez dans l'éditeur SQL
2. Copiez et exécutez le contenu du fichier `supabase/migrations/create_admin_system.sql`
3. Cela créera toutes les tables nécessaires avec l'utilisateur admin par défaut

### 4. Vérification

Une fois configuré, le système :
- ✅ Utilisera automatiquement Supabase si configuré
- 📦 Basculera vers localStorage si Supabase n'est pas disponible
- 🔄 Affichera le statut de connexion dans le tableau de bord admin

## 📊 Fonctionnalités

### Base de données hybride
- **Production** : Supabase (PostgreSQL)
- **Développement/Fallback** : localStorage
- **Migration automatique** : Détection et basculement transparent

### Tables créées
- `admin_users` - Utilisateurs administrateurs
- `contact_messages` - Messages de contact du site
- `join_us_applications` - Candidatures "Rejoignez-nous"

### Sécurité
- Row Level Security (RLS) activé
- Politiques d'accès configurées
- Authentification sécurisée

## 🔧 Utilisation

### Connexion admin par défaut
- **Nom d'utilisateur** : `admin`
- **Mot de passe** : `Admin123`

### API unifiée
Toutes les fonctions de stockage fonctionnent de manière identique, que vous utilisiez Supabase ou localStorage :

```typescript
// Ces fonctions fonctionnent avec les deux systèmes
const users = await getStoredUsers();
const messages = await getContactMessages();
const applications = await getJoinUsApplications();
```

## 🚀 Déploiement

1. Configurez vos variables d'environnement sur votre plateforme de déploiement
2. Assurez-vous que Supabase est accessible depuis votre domaine
3. Le système basculera automatiquement vers localStorage si Supabase n'est pas disponible

## 📈 Monitoring

Le tableau de bord admin affiche :
- ✅ Statut de connexion Supabase en temps réel
- 📊 Statistiques en direct
- 🔄 Basculement automatique en cas de problème

## 🛠️ Développement

```bash
# Installation des dépendances
npm install

# Démarrage en mode développement
npm run dev

# Build pour la production
npm run build
```

## 📝 Notes importantes

- Le système fonctionne sans Supabase (mode localStorage)
- La migration vers Supabase est transparente
- Toutes les données existantes sont préservées
- L'interface admin reste identique dans les deux modes