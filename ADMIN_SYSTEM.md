# Système d'Administration ABA Creative Group

## Vue d'ensemble

Le système d'administration d'ABA Creative Group est un panneau de contrôle complet qui permet de gérer les messages de contact, les candidatures "Rejoignez-nous", et les utilisateurs du système.

## Accès au Système

### Connexion

- **URL d'accès** : Cliquez sur l'icône de connexion discrète dans le footer du site principal
- **Identifiants par défaut** :
  - Nom d'utilisateur : `admin`
  - Mot de passe : `Admin123`

### Première Connexion

- Lors de la première connexion, tous les utilisateurs doivent changer leur mot de passe
- Le système force cette étape pour la sécurité

## Fonctionnalités Principales

### 1. Tableau de Bord

- Vue d'ensemble des statistiques
- Activité récente
- Actions rapides
- Indicateurs de performance

### 2. Gestion des Messages de Contact

- Visualisation de tous les messages reçus via le formulaire de contact
- Statuts : En attente, Traité, Rejeté
- Ajout de notes personnalisées
- Export des données en CSV
- Recherche et filtrage avancés

### 3. Gestion des Candidatures "Rejoignez-nous"

- Visualisation de toutes les candidatures
- Tri par domaine (Chanteur, Acteur, Mannequin, etc.)
- Gestion des portfolios
- Statuts : En attente, Accepté, Rejeté
- Export des données en CSV

### 4. Gestion des Utilisateurs (Admin uniquement)

- Création de nouveaux comptes utilisateurs
- Trois rôles disponibles :
  - **Administrateur** : Accès complet
  - **Gestionnaire de Contact** : Accès aux messages de contact uniquement
  - **Gestionnaire de Recrutement** : Accès aux candidatures uniquement
- Suspension/activation des comptes
- Réinitialisation des mots de passe

## Rôles et Permissions

### Administrateur

- Accès complet à toutes les fonctionnalités
- Gestion des utilisateurs
- Peut voir et traiter tous les messages et candidatures

### Gestionnaire de Contact

- Accès aux messages de contact uniquement
- Peut traiter, accepter ou rejeter les messages
- Peut exporter les données de contact

### Gestionnaire de Recrutement

- Accès aux candidatures "Rejoignez-nous" uniquement
- Peut traiter, accepter ou rejeter les candidatures
- Peut exporter les données de recrutement

## Stockage des Données

Le système utilise le localStorage du navigateur pour stocker :

- Comptes utilisateurs
- Messages de contact
- Candidatures
- Sessions d'authentification

**Important** : Les données sont stockées localement et ne persistent que dans le navigateur utilisé.

## Notifications et Confirmations

### Messages de Confirmation

- Les utilisateurs du site reçoivent des messages de confirmation après soumission
- Disponible en français, anglais, néerlandais, swahili et lingala

### Notifications Admin

- Notifications en temps réel pour les nouvelles soumissions
- Indicateurs visuels pour les éléments en attente

## Sécurité

### Authentification

- Système de connexion sécurisé
- Changement de mot de passe obligatoire à la première connexion
- Sessions persistantes avec localStorage

### Autorizations

- Contrôle d'accès basé sur les rôles
- Protection contre l'accès non autorisé
- Les utilisateurs ne peuvent pas modifier leurs propres permissions

## Export de Données

### Format CSV

- Export de toutes les données en format CSV
- Inclut toutes les informations pertinentes
- Compatible avec Excel et autres tableurs

### Données Exportées

- **Messages de contact** : Nom, email, sujet, message, statut, date, notes
- **Candidatures** : Nom, email, téléphone, domaine, présentation, portfolio, statut, date, notes

## Support Multilingue

Le système d'administration est disponible en plusieurs langues :

- Français (par défaut)
- Anglais
- Néerlandais
- Swahili
- Lingala

## Maintenance

### Sauvegarde

- Les données sont automatiquement sauvegardées dans localStorage
- Recommandation : Export régulier en CSV pour sauvegarde externe

### Nettoyage

- Possibilité de traiter et archiver les anciens messages
- Gestion des statuts pour organiser les données

## Assistance Technique

En cas de problème technique :

1. Vérifiez que le localStorage n'est pas plein
2. Essayez de rafraîchir la page
3. Vérifiez les permissions de votre navigateur

## Configuration par Défaut

### Utilisateur Admin

- **ID** : admin-1
- **Nom** : Administrateur Principal
- **Email** : admin@abacreativegroup.com
- **Rôle** : Administrateur

### Statuts par Défaut

- Tous les nouveaux messages/candidatures commencent avec le statut "En attente"
- Seuls les utilisateurs autorisés peuvent modifier les statuts

## Évolutions Futures

Le système est conçu pour être extensible :

- Ajout de nouveaux rôles
- Intégration avec une base de données externe
- Notifications par email
- Rapports avancés
- API REST pour intégrations tierces
