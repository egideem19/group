-- Migration ABA Creative Group - Système d'Administration
-- Création du schéma de base de données pour le système admin

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

-- Insérer l'utilisateur admin par défaut avec un UUID généré
INSERT INTO admin_users (
  username,
  password,
  role,
  name,
  email,
  is_first_login,
  is_active
) VALUES (
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

-- Créer des index supplémentaires pour l'optimisation
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON admin_users(is_active);