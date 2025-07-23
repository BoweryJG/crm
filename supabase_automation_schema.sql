-- Supabase Automation Tables Schema
-- Project ID: cbopynuvhcymbumjnvay
-- Extracted on: 2025-01-23

-- =====================================================
-- Table: automation_executions
-- =====================================================
CREATE TABLE public.automation_executions (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    automation_id uuid NOT NULL,
    contact_id uuid NOT NULL,
    status text NOT NULL DEFAULT 'pending'::text,
    started_at timestamp with time zone DEFAULT now(),
    completed_at timestamp with time zone,
    metrics jsonb DEFAULT '{}'::jsonb,
    user_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Primary Key
ALTER TABLE public.automation_executions ADD CONSTRAINT automation_executions_pkey PRIMARY KEY (id);

-- Foreign Keys
ALTER TABLE public.automation_executions ADD CONSTRAINT automation_executions_automation_id_fkey 
    FOREIGN KEY (automation_id) REFERENCES public.email_automations(id);
ALTER TABLE public.automation_executions ADD CONSTRAINT automation_executions_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id);

-- Indexes
CREATE INDEX idx_automation_executions_automation_id ON public.automation_executions USING btree (automation_id);
CREATE INDEX idx_automation_executions_completed_at ON public.automation_executions USING btree (completed_at DESC);
CREATE INDEX idx_automation_executions_contact_id ON public.automation_executions USING btree (contact_id);
CREATE INDEX idx_automation_executions_started_at ON public.automation_executions USING btree (started_at DESC);
CREATE INDEX idx_automation_executions_status ON public.automation_executions USING btree (status);
CREATE INDEX idx_automation_executions_user_id ON public.automation_executions USING btree (user_id);

-- =====================================================
-- Table: automation_logs
-- =====================================================
CREATE TABLE public.automation_logs (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    system text,
    action text,
    source_table text,
    record_id uuid,
    status text,
    log text,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

-- Primary Key
ALTER TABLE public.automation_logs ADD CONSTRAINT automation_logs_pkey PRIMARY KEY (id);

-- =====================================================
-- Table: automation_magic_links
-- =====================================================
CREATE TABLE public.automation_magic_links (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    token text NOT NULL,
    workflow_type text NOT NULL,
    target_email text,
    target_contact_id uuid,
    used_at timestamp with time zone,
    expires_at timestamp with time zone NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now()
);

-- Primary Key
ALTER TABLE public.automation_magic_links ADD CONSTRAINT automation_magic_links_pkey PRIMARY KEY (id);

-- Unique Constraints
ALTER TABLE public.automation_magic_links ADD CONSTRAINT automation_magic_links_token_key UNIQUE (token);

-- Indexes
CREATE INDEX idx_automation_magic_links_expires_at ON public.automation_magic_links USING btree (expires_at);
CREATE INDEX idx_automation_magic_links_token ON public.automation_magic_links USING btree (token);

-- =====================================================
-- Table: automation_triggers
-- =====================================================
CREATE TABLE public.automation_triggers (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    automation_id uuid NOT NULL,
    trigger_type text NOT NULL,
    trigger_data jsonb DEFAULT '{}'::jsonb,
    conditions jsonb DEFAULT '{}'::jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Primary Key
ALTER TABLE public.automation_triggers ADD CONSTRAINT automation_triggers_pkey PRIMARY KEY (id);

-- Foreign Keys
ALTER TABLE public.automation_triggers ADD CONSTRAINT automation_triggers_automation_id_fkey 
    FOREIGN KEY (automation_id) REFERENCES public.email_automations(id);

-- Indexes
CREATE INDEX idx_automation_triggers_automation_id ON public.automation_triggers USING btree (automation_id);
CREATE INDEX idx_automation_triggers_created_at ON public.automation_triggers USING btree (created_at DESC);
CREATE INDEX idx_automation_triggers_is_active ON public.automation_triggers USING btree (is_active);
CREATE INDEX idx_automation_triggers_trigger_type ON public.automation_triggers USING btree (trigger_type);

-- =====================================================
-- Table: email_automations
-- =====================================================
CREATE TABLE public.email_automations (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    workflow_steps jsonb DEFAULT '[]'::jsonb,
    triggers jsonb DEFAULT '[]'::jsonb,
    is_active boolean DEFAULT false,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Primary Key
ALTER TABLE public.email_automations ADD CONSTRAINT email_automations_pkey PRIMARY KEY (id);

-- Foreign Keys
ALTER TABLE public.email_automations ADD CONSTRAINT email_automations_created_by_fkey 
    FOREIGN KEY (created_by) REFERENCES auth.users(id);

-- Indexes
CREATE INDEX idx_email_automations_created_at ON public.email_automations USING btree (created_at DESC);
CREATE INDEX idx_email_automations_created_by ON public.email_automations USING btree (created_by);
CREATE INDEX idx_email_automations_is_active ON public.email_automations USING btree (is_active);

-- =====================================================
-- Table: email_logs
-- =====================================================
CREATE TABLE public.email_logs (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    message_id text,
    from_email text NOT NULL,
    to_email text NOT NULL,
    subject text NOT NULL,
    status text NOT NULL,
    sent_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    campaign_id uuid,
    user_id uuid,
    error text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    contact_id uuid,
    opened_at timestamp with time zone,
    clicked_at timestamp with time zone,
    body_html text,
    body_text text
);

-- Primary Key
ALTER TABLE public.email_logs ADD CONSTRAINT email_logs_pkey PRIMARY KEY (id);

-- Foreign Keys
ALTER TABLE public.email_logs ADD CONSTRAINT email_logs_campaign_id_fkey 
    FOREIGN KEY (campaign_id) REFERENCES public.email_campaigns(id);
ALTER TABLE public.email_logs ADD CONSTRAINT email_logs_contact_id_fkey 
    FOREIGN KEY (contact_id) REFERENCES public.contacts(id);
ALTER TABLE public.email_logs ADD CONSTRAINT email_logs_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id);

-- Indexes
CREATE INDEX idx_email_logs_campaign_id ON public.email_logs USING btree (campaign_id);
CREATE INDEX idx_email_logs_contact_id ON public.email_logs USING btree (contact_id);
CREATE INDEX idx_email_logs_sent_at ON public.email_logs USING btree (sent_at);
CREATE INDEX idx_email_logs_status ON public.email_logs USING btree (status);
CREATE INDEX idx_email_logs_to_email ON public.email_logs USING btree (to_email);
CREATE INDEX idx_email_logs_user_id ON public.email_logs USING btree (user_id);

-- =====================================================
-- Table: email_templates
-- =====================================================
CREATE TABLE public.email_templates (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text NOT NULL,
    subject text NOT NULL,
    html_content text NOT NULL,
    text_content text,
    variables jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    user_id uuid,
    category text,
    usage_count integer DEFAULT 0
);

-- Primary Key
ALTER TABLE public.email_templates ADD CONSTRAINT email_templates_pkey PRIMARY KEY (id);

-- Unique Constraints
ALTER TABLE public.email_templates ADD CONSTRAINT email_templates_template_name_key UNIQUE (name);

-- Foreign Keys
ALTER TABLE public.email_templates ADD CONSTRAINT email_templates_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id);

-- Indexes
CREATE INDEX idx_email_templates_category ON public.email_templates USING btree (category);
CREATE INDEX idx_email_templates_user_id ON public.email_templates USING btree (user_id);

-- =====================================================
-- Table Dependencies Summary
-- =====================================================
-- 1. email_automations - Base table for automations
-- 2. automation_triggers - Depends on email_automations
-- 3. automation_executions - Depends on email_automations
-- 4. email_templates - Standalone table for email templates
-- 5. email_logs - Depends on email_campaigns and contacts
-- 6. automation_logs - Standalone logging table
-- 7. automation_magic_links - Standalone table for magic links

-- Note: Some foreign key references point to tables not included in this extract:
-- - auth.users (Supabase auth schema)
-- - public.email_campaigns
-- - public.contacts