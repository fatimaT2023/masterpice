-- PostgreSQL sketch. Connect owner_id/author_id to your actual auth user table.
-- Apply access policies or restrict all access to your authorized backend service.
CREATE TABLE support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid,
  requester_role text NOT NULL CHECK (requester_role IN ('parent','specialist','guest')),
  name varchar(100) NOT NULL CHECK (length(trim(name)) > 0),
  email varchar(254) NOT NULL,
  subject varchar(150) NOT NULL CHECK (length(trim(subject)) > 0),
  category text NOT NULL CHECK (category IN ('account','booking','profile','technical','other')),
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','in_progress','resolved')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX support_tickets_owner_updated ON support_tickets(owner_id, updated_at DESC);
CREATE INDEX support_tickets_status_updated ON support_tickets(status, updated_at DESC);
CREATE TABLE support_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  author_id uuid,
  author_role text NOT NULL CHECK (author_role IN ('parent','specialist','guest','admin')),
  body varchar(4000) NOT NULL CHECK (length(trim(body)) > 0),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX support_messages_ticket_created ON support_messages(ticket_id, created_at);