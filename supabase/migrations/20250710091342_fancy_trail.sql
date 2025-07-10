/*
  # Création du système d'administration ABA Creative Group

  1. Nouvelles Tables
    - `admin_users` - Utilisateurs administrateurs
      - `id` (uuid, clé primaire)
      - `username` (text, unique)
      - `password` (text)
      - `role` (enum)
      - `name` (text)
      - `email` (text, unique)
      - `is_first_login` (boolean)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `last_login` (timestamp, nullable)

    - `contact_messages` - Messages de contact
      - `id` (uuid, clé primaire)
      - `name` (text)
      - `email` (text)
      - `subject` (text)
      - `message` (text)
      - `status` (enum)
      - `submitted_at` (timestamp)
      - `processed_at` (timestamp, nullable)
      - `processed_by` (text, nullable)
      - `notes` (text, nullable)

    - `join_us_applications` - Candidatures "Rejoignez-nous"
      - `id` (uuid, clé primaire)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `domain` (text)
      - `presentation` (text)
      - `portfolio` (text, nullable)
      - `status` (enum)
      - `submitted_at` (timestamp)
      - `processed_at` (timestamp, nullable)
      - `processed_by` (text, nullable)
      - `notes` (text, nullable)

  2. Sécurité
    - Activer RLS sur toutes les tables
    - Politiques pour les utilisateurs authentifiés
*/

-- Création des types énumérés
CREATE TYPE user_role AS ENUM ('admin', 'contact_manager', 'recruitment_manager');
CREATE TYPE status_type AS ENUM ('pending', 'processed', 'rejected');

-- Table des utilisateurs administrateurs
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password text NOT NULL,
  role user_role NOT NULL DEFAULT 'contact_manager',
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  is_first_login boolean DEFAULT true,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- Table des messages de contact
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status status_type DEFAULT 'pending',
  submitted_at timestamptz DEFAULT now(),
  processed_at timestamptz,
  processed_by text,
  notes text
);

-- Table des candidatures "Rejoignez-nous"
CREATE TABLE IF NOT EXISTS join_us_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  domain text NOT NULL,
  presentation text NOT NULL,
  portfolio text,
  status status_type DEFAULT 'pending',
  submitted_at timestamptz DEFAULT now(),
  processed_at timestamptz,
  processed_by text,
  notes text
);

-- Activer RLS sur toutes les tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE join_us_applications ENABLE ROW LEVEL SECURITY;

-- Politiques pour admin_users
CREATE POLICY "Admins can read all users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert users"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update users"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (true);

-- Politiques pour contact_messages
CREATE POLICY "Authenticated users can read contact messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert contact messages"
  ON contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update contact messages"
  ON contact_messages
  FOR UPDATE
  TO authenticated
  USING (true);

-- Politiques pour join_us_applications
CREATE POLICY "Authenticated users can read applications"
  ON join_us_applications
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert applications"
  ON join_us_applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update applications"
  ON join_us_applications
  FOR UPDATE
  TO authenticated
  USING (true);

-- Insérer l'utilisateur admin par défaut
INSERT INTO admin_users (
  id,
  username,
  password,
  role,
  name,
  email,
  is_first_login,
  is_active
) VALUES (
  'admin-default',
  'admin',
  'Admin123',
  'admin',
  'Administrateur Principal',
  'admin@abacreativegroup.com',
  true,
  true
) ON CONFLICT (username) DO NOTHING;

-- Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_submitted_at ON contact_messages(submitted_at);
CREATE INDEX IF NOT EXISTS idx_join_us_applications_status ON join_us_applications(status);
CREATE INDEX IF NOT EXISTS idx_join_us_applications_submitted_at ON join_us_applications(submitted_at);
CREATE INDEX IF NOT EXISTS idx_join_us_applications_domain ON join_us_applications(domain);