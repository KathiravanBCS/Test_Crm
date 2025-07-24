-- VSTN CRM Schema - Updated & Consolidated (2025-07-12)
-- This schema incorporates master tables and ENUM types for improved flexibility and data integrity.


-- =================================================================
-- Section 1: enum type  Definitions
-- =================================================================

CREATE TYPE public.customer_type_enum AS ENUM (
    'DIRECT',
    'PARTNER_REFERRED',
    'PARTNER_MANAGED'
);

CREATE TYPE public.marital_status AS ENUM (
    'SINGLE',
    'MARRIED'
);

CREATE TYPE public.employee_role_enum AS ENUM (
    'ADMIN',
    'MANAGER',
    'CONSULTANT'
);

CREATE TYPE public.leave_type_enum AS ENUM (
    'Casual',
    'Sick',
    'Optional'
);

-- To standardize task priorities as requested in the business requirements.
CREATE TYPE public.task_priority_enum AS ENUM (
    'low',
    'normal',
    'high',
    'urgent'
);

-- To identify whether a proposal is sent to a partner or customer.
CREATE TYPE public.proposal_target_enum AS ENUM (
    'customer',
    'partner'
);

--enum types ends here
-- =================================================================
-- Section 1: enum type  Definitions
-- =================================================================


-- =================================================================
-- Section 2: Master Table Definitions
-- =================================================================

-- Manages VSTN's own legal entities/branches (e.g., VSTN India, VSTN Dubai)

CREATE TABLE master.vstn_branch (
    id SERIAL PRIMARY KEY,
    branch_name TEXT NOT NULL, -- e.g., 'VSTN Consultancy Pvt. Ltd.'
    branch_code TEXT NOT NULL UNIQUE, -- e.g., 'VSTN_PVT', 'VSTN_LLC'
    country TEXT NOT NULL, -- e.g., 'India', 'United Arab Emirates'
    base_currency_code VARCHAR(3) REFERENCES master.master_currency(code),
    is_active BOOLEAN DEFAULT TRUE
);

--insert into master.vstn_branch(branch_name, branch_code, country, base_currency_code, is_active) VALUES('VSTN Consultancy Pvt. Ltd.', 'VSTN-PVT', 'India', 'INR', true);
--insert into master.vstn_branch(branch_name, branch_code, country, base_currency_code, is_active) VALUES('VSTN Consultancy LLC.', 'VSTN-LLC', 'United Arab Emirates', 'USD', true);


-- To generate unique codes for entities.

CREATE TABLE master.code_sequence (
entity_type TEXT PRIMARY KEY, -- 'customer', 'partner', etc.    
last_number INTEGER NOT NULL
);

--insert into master.code_sequence(entity_type, last_number) VALUES('PARTNER', 60);
--insert into master.code_sequence(entity_type, last_number) VALUES('CUSTOMER', 60);

CREATE TABLE master.master_currency (
	code VARCHAR(3) PRIMARY KEY, -- 'INR', 'USD', 'AED'
    name TEXT NOT NULL, -- 'Indian Rupee', 'United States Dollar'
    symbol VARCHAR(5) NOT NULL, -- '₹', '$'
    is_base_currency BOOLEAN DEFAULT false    
);

--insert into master.master_currency VALUES('INR', 'Indian Rupee', '₹', TRUE);
--insert into master.master_currency VALUES('USD', 'United States Dollar', '$', FALSE);
--insert into master.master_currency VALUES('AED', 'United Arab Emirates Dirham', 'د.إ;', FALSE);

CREATE TABLE master.master_status (
    id SERIAL PRIMARY KEY,
    context TEXT NOT NULL, -- e.g., 'TASK', 'INVOICE', 'PROPOSAL', 'ENGAGEMENT'
    status_code TEXT NOT NULL, -- e.g., 'in_progress', 'sent', 'approved'
    status_name TEXT NOT NULL, -- e.g., 'In Progress', 'Sent', 'Approved'
    sequence INTEGER, -- For workflow order, e.g., 10, 20, 30
    is_final BOOLEAN DEFAULT FALSE, -- Indicates if a record in this status can be edited
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(context, status_code)
);

CREATE TABLE master.master_service (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    default_rate NUMERIC,
    category TEXT, -- e.g., 'OTP', 'Advisory', 'Compliance'
    is_active BOOLEAN DEFAULT TRUE
);

-- =================================================================
-- Section 2: Master Table Definitions
-- =================================================================



-- =================================================================
-- Section 3: Core Application Tables
-- =================================================================

--drop table crm.employee_profile;

CREATE TABLE crm.employee_profile (
    id SERIAL PRIMARY KEY,
    employee_code TEXT UNIQUE NOT NULL, -- e.g., '
    last_name  TEXT NOT NULL,
    first_name TEXT NOT NULL,
    middle_name TEXT,
    date_of_birth DATE,
    gender TEXT,
    nationality TEXT,
    marital_status marital_status,
    Father_name TEXT,
    Mother_name TEXT,
    spouse_name TEXT,
    email TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    personal_email TEXT NOT NULL,
    alternate_phone TEXT,       
    pan TEXT,
    aadhaar TEXT,          
    role employee_role_enum NOT NULL, -- do we need to keep the role here?
    status_id INTEGER REFERENCES master.master_status(id),
    is_deleted BOOLEAN DEFAULT FALSE,      
    created_at TIMESTAMP DEFAULT NOW(),
    created_by TEXT,
    updated_at TIMESTAMP,
    updated_by TEXT
);

CREATE TABLE crm.partner (
    id SERIAL PRIMARY KEY,
    vstn_branch_id INTEGER REFERENCES master.vstn_branch(id) NOT NULL,
    partner_code TEXT UNIQUE NOT NULL,    
    partner_name TEXT NOT NULL,
    partner_type TEXT, -- 'individual', 'Firm'
    pan TEXT,
    gstin TEXT,
    web_url TEXT,   
    currency_code VARCHAR(3) DEFAULT 'INR' REFERENCES master.master_currency(code), 
    payment_term TEXT,
    commission_type TEXT CHECK (commission_type IN ('PERCENTAGE', 'FIXED')), 
    commission_rate NUMERIC, -- e.g., 10 for 10% or 100
    commission_currency_code VARCHAR(3) DEFAULT 'INR' REFERENCES master.master_currency(code),
    partner_description TEXT,
    onboarded_date TIMESTAMP ,
    is_deleted BOOLEAN DEFAULT FALSE, 
    created_at TIMESTAMP DEFAULT NOW(),
    created_by TEXT,
    updated_at TIMESTAMP,
    updated_by TEXT
);


CREATE TABLE crm.customer (
    id SERIAL PRIMARY KEY,
    vstn_branch_id INTEGER REFERENCES master.vstn_branch(id) NOT NULL,
    customer_code TEXT UNIQUE NOT NULL,
    customer_name TEXT,
    email TEXT,
    phone TEXT,
    customer_type customer_type_enum,
    industry TEXT,
    customer_segment TEXT,
    partner_id INTEGER REFERENCES crm.partner(id), -- Added to link referred/managed customers to a partner.
    partnership_note TEXT,    
    currency_code VARCHAR(3) DEFAULT 'INR' REFERENCES master.master_currency(code),
    pan TEXT,
    gstin TEXT,
    tan TEXT,
    web_url TEXT,    
    payment_term TEXT,
    customer_description TEXT,  
    onboarded_date TIMESTAMP ,
    is_deleted BOOLEAN DEFAULT FALSE, 
    created_at TIMESTAMP DEFAULT NOW(),
    created_by TEXT,
    updated_at TIMESTAMP,
    updated_by TEXT
);


CREATE TABLE crm.contact_person (
    id SERIAL PRIMARY KEY,
    entity_type TEXT CHECK (entity_type IN ('CUSTOMER', 'PARTNER')),
    entity_id INTEGER,
    contact_person_name TEXT,
    email TEXT,
    phone TEXT,
    designation TEXT,
    is_primary BOOLEAN DEFAULT FALSE, 
    is_deleted BOOLEAN DEFAULT FALSE, 
    created_at TIMESTAMP,
    created_by TEXT,
    updated_at TIMESTAMP,
    updated_by TEXT
);

CREATE TABLE crm.addresses (
    id SERIAL PRIMARY KEY,
    entity_type TEXT CHECK (entity_type IN ('CUSTOMER', 'PARTNER')),
    entity_id INTEGER,
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    postal_code TEXT,
    country TEXT,
    is_primary BOOLEAN DEFAULT FALSE, 
    is_billing BOOLEAN DEFAULT FALSE, 
    is_shipping BOOLEAN DEFAULT FALSE, 
    is_deleted BOOLEAN DEFAULT FALSE, 
    created_at TIMESTAMP,
    created_by TEXT,
    updated_at TIMESTAMP,
    updated_by TEXT
);

CREATE TABLE crm.partner_bank_accounts (
    id SERIAL PRIMARY KEY,
    partner_id INTEGER REFERENCES crm.partner(id),
    account_holder_name TEXT NOT NULL,
    account_number TEXT NOT NULL,
    ifsc_code TEXT  NULL,
    bank_name TEXT  NULL,       
    account_type TEXT CHECK (account_type IN ('SAVINGS', 'CURRENT', 'FIXED_DEPOSIT')), 
    swift_code TEXT NULL, -- For international transfers
    currency_code VARCHAR(3) DEFAULT 'INR' REFERENCES master.master_currency(code),  
    effective_date TIMESTAMP,
    term_date TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,      
    created_at TIMESTAMP DEFAULT NOW(),
    created_by TEXT,
    updated_at TIMESTAMP,
    updated_by TEXT
);

-- Engagement Lifecycle Tables
--proposal dodument attachment to be add (are we going to bring that in documents table or as a separate table)
--approval reference to be added in proposal and engagement letter
CREATE TABLE crm.proposal (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES crm.customer(id),
    partner_id INTEGER REFERENCES crm.partner(id),
    proposal_target proposal_target_enum NOT NULL DEFAULT 'customer', -- Identifies whether proposal is for customer or partner
    proposal_code TEXT UNIQUE NOT NULL, -- e.g., 'PROP-2025-001
    proposal_date TIMESTAMP NOT NULL,
    proposal_title TEXT NOT NULL, -- e.g., 'Advisory Services for Q1 2025'
    proposal_description TEXT, -- e.g., 'Detailed proposal for advisory services'
    proposal_valid_until TIMESTAMP,
    terms_and_conditions TEXT, -- e.g., 'Standard terms and conditions apply'
    timelines TEXT, -- e.g., 'Project to start on 2025-01-01 and end on 2025-03-31'
    status_id INTEGER REFERENCES master.master_status(id),
    status_updated_date TIMESTAMP,
    currency_code VARCHAR(3) DEFAULT 'INR' REFERENCES master.master_currency(code),
    proposal_prepared_by INTEGER REFERENCES crm.employee_profile(id), -- Employee who prepared the proposal
    proposal_reviewed_by INTEGER REFERENCES crm.employee_profile(id), -- Employee who reviewed the proposal 
    is_deleted BOOLEAN DEFAULT FALSE,      
    created_at TIMESTAMP DEFAULT NOW(),
    created_by TEXT,
    updated_at TIMESTAMP,
    updated_by TEXT,
    CONSTRAINT chk_proposal_target_consistency CHECK (
        (proposal_target = 'customer' AND customer_id IS NOT NULL) OR
        (proposal_target = 'partner' AND partner_id IS NOT NULL)
    )
);


CREATE TABLE crm.proposal_service_item (
    id SERIAL PRIMARY KEY,
    proposal_id INTEGER REFERENCES proposal(id),
    master_service_id INTEGER REFERENCES master.master_service(id),
    service_name TEXT NOT NULL, -- e.g., 'Advisory Service'
    service_description TEXT NOT NULL, -- e.g., 'Advisory Services for Q1 2025'
    service_rate NUMERIC NOT NULL, -- e.g., 1000
    -- currency_code VARCHAR(3) DEFAULT 'INR' REFERENCES master_currency(code),
    is_deleted BOOLEAN DEFAULT FALSE,      
    created_at TIMESTAMP DEFAULT NOW(),
    created_by TEXT,
    updated_at TIMESTAMP,
    updated_by TEXT
);


CREATE TABLE crm.engagement_letter (
    id SERIAL PRIMARY KEY,
    proposal_id INTEGER REFERENCES crm.proposal(id),
    customer_id INTEGER REFERENCES crm.customer(id),
    partner_id INTEGER REFERENCES crm.partner(id),
    engagement_letter_code TEXT UNIQUE NOT NULL, -- e.g., 'EL-2025-001'
    engagement_letter_date TIMESTAMP NOT NULL,
    engagement_letter_title TEXT NOT NULL, -- e.g., 'Engagement Letter for Advisory Services Q1 2025'
    engagement_letter_description TEXT, -- e.g., 'Engagement letter for advisory services'
    currency_code VARCHAR(3) DEFAULT 'INR' REFERENCES master.master_currency(code),
    status_id INTEGER REFERENCES master.master_status(id),
    approval_date TIMESTAMP,
    sign_off_notes TEXT, -- e.g., 'Approved by customer on 2025-01-01 with so on so mode'  
    engagement_resource_id INTEGER REFERENCES crm.employee_profile(id), -- Employee who prepared the engagement letter
    scope_of_work TEXT, 
    deliverables TEXT, 
    timelines TEXT, 
    payment_terms TEXT, 
    special_conditions TEXT, 
    terms_and_conditions TEXT, 
    payment_required_percentage_before_work_start NUMERIC, -- e.g., 10 for 10%
    is_deleted BOOLEAN DEFAULT FALSE,      
    created_at TIMESTAMP DEFAULT NOW(),
    created_by TEXT,
    updated_at TIMESTAMP,
    updated_by TEXT
);

--even after approval we can add some service items and when we add like this we need to add it in engagement as well
CREATE TABLE crm.engagement_letter_service_item (
    id SERIAL PRIMARY KEY,
    engagement_letter_id INTEGER REFERENCES crm.engagement_letter(id),
    proposal_service_item_id INTEGER REFERENCES crm.proposal_service_item(id), -- << NEW: Links back to the selected proposal item
    master_service_id INTEGER REFERENCES crm.master_service(id),
    service_name TEXT NOT NULL, -- Can be copied from proposal or customized
    service_description TEXT NOT NULL, -- Can be copied from proposal or customized
    service_rate NUMERIC NOT NULL, -- The final, agreed-upon rate for this engagement
    is_deleted BOOLEAN DEFAULT FALSE,      
    created_at TIMESTAMP DEFAULT NOW(),
    created_by TEXT,
    updated_at TIMESTAMP,
    updated_by TEXT
);


-- Execution Tables
CREATE TABLE crm.engagement (
    id SERIAL PRIMARY KEY,
    engagement_name TEXT NOT NULL,
    engagement_letter_id INTEGER REFERENCES crm.engagement_letter(id),    
    status_id INTEGER REFERENCES master.master_status(id),
    manager_id INTEGER REFERENCES crm.employee_profile(id),
    progress_percentage NUMERIC DEFAULT 0, -- ADDED: For high-level progress tracking
      -- Timeline
   -- Planned Timeline (Can be updated if the project plan changes)
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,

    -- Baseline Timeline (A snapshot of the original plan, set once and never changed)
    baseline_start_date DATE, -- ADDED: Stores the original planned start date for variance analysis.
    baseline_end_date DATE,   -- ADDED: Stores the original planned end date for variance analysis.
    
    -- Actual Execution Timeline (Records what actually happened)
    actual_start_date DATE,
    actual_end_date DATE
);

CREATE TABLE crm.engagement_phase (
    id SERIAL PRIMARY KEY,
    engagement_id INTEGER REFERENCES crm.engagement(id),
    phase_name TEXT NOT NULL,
    phase_description TEXT,
    status_id INTEGER REFERENCES master.master_status(id),
    progress_percentage NUMERIC DEFAULT 0, -- ADDED: For phase-level progress tracking
    
     -- Planned Timeline for the phase
    phase_start_date DATE NOT NULL,
    phase_end_date DATE NOT NULL,

    -- Baseline Timeline for the phase
    baseline_start_date DATE, -- ADDED: The phase's original start date. Copied from phase_start_date when the engagement begins.
    baseline_end_date DATE,   -- ADDED: The phase's original end date. Copied from phase_end_date when the engagement begins.

    -- Actual Execution Timeline for the phase
    actual_start_date DATE,
    actual_end_date DATE,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

--No price required in Engagement module
CREATE TABLE crm.engagement_service_item (
    id SERIAL PRIMARY KEY,
    engagement_phase_id INTEGER REFERENCES crm.engagement_phase(id),
    engagement_letter_service_item_id INTEGER REFERENCES crm.engagement_letter_service_item(id),
    master_service_id INTEGER REFERENCES master.master_service(id),
    service_name TEXT NOT NULL, -- e.g., 'Advisory Service'
    service_description TEXT NOT NULL, -- e.g., 'Advisory Services for Q1 2025' 
    status_id INTEGER REFERENCES master.master_status(id),
    delivery_notes TEXT,
    assigned_to INTEGER REFERENCES crm.employee_profile(id),

    -- Planned Timeline for the service item
    planned_start_date DATE,
    planned_end_date DATE,

    -- Baseline Timeline for the service item
    baseline_start_date DATE, -- ADDED: The service item's original start date for granular variance tracking.
    baseline_end_date DATE,   -- ADDED: The service item's original end date for granular variance tracking.

    -- Actual Execution Timeline for the service item
    actual_start_date DATE,
    actual_end_date DATE, 
   
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ADDED: New junction table for defining dependencies between service items
CREATE TABLE crm.service_item_dependency (
    service_item_id INTEGER REFERENCES crm.engagement_service_item(id) ON DELETE CASCADE,
    depends_on_service_item_id INTEGER REFERENCES crm.engagement_service_item(id) ON DELETE CASCADE,
    PRIMARY KEY (service_item_id, depends_on_service_item_id)
);
 

-- Financial Tables
CREATE TABLE crm.invoice (
    id SERIAL PRIMARY KEY,
    invoice_number TEXT UNIQUE NOT NULL,
    vstn_branch_id INTEGER REFERENCES master.vstn_branch(id) NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE,
    amount NUMERIC NOT NULL,
    tax_amount NUMERIC DEFAULT 0,
    total_amount NUMERIC GENERATED ALWAYS AS (amount + tax_amount) STORED,
    issued_to TEXT NOT NULL,
    issued_to_type TEXT CHECK (issued_to_type IN ('customer', 'partner')),
    status_id INTEGER REFERENCES master.master_status(id),
    currency_code VARCHAR(3) DEFAULT 'INR' REFERENCES master.master_currency(code),
    exchange_rate_to_inr NUMERIC,
    exchange_rate_date DATE,
    amount_inr NUMERIC,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE crm.employments (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES crm.employee_profile(id),
    date_of_joining DATE,
    date_of_resignation DATE,
    department  TEXT,  --do we need to keep master for this?
    designation TEXT, -- do we need to keep master for this?
    employment_type TEXT CHECK (public.employment_type IN ('full_time', 'part_time', 'contract', 'internship')),
    reporting_to_employee_id INTEGER REFERENCES crm.employee_profile(id), 
    skills TEXT,
    languages TEXT,
    is_deleted BOOLEAN DEFAULT FALSE, 
    created_at TIMESTAMP DEFAULT NOW(),
    created_by TEXT,
    updated_at TIMESTAMP,
    updated_by TEXT
);


CREATE TABLE crm.employee_contact_person (
    id SERIAL PRIMARY KEY,    
    employee_id INTEGER REFERENCES crm.employee_profile(id),
    contact_person_name TEXT,
    email TEXT,
    phone TEXT,
    relation TEXT,
    is_primary BOOLEAN DEFAULT FALSE, 
    is_deleted BOOLEAN DEFAULT FALSE, 
    created_at TIMESTAMP DEFAULT NOW(),
    created_by TEXT,
    updated_at TIMESTAMP,
    updated_by TEXT
);

CREATE TABLE crm.employee_addresses (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES crm.employee_profile(id),
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    postal_code TEXT,
    country TEXT,
    is_current BOOLEAN DEFAULT FALSE, 
    is_permanant BOOLEAN DEFAULT FALSE, 
    is_deleted BOOLEAN DEFAULT FALSE, 
    created_at TIMESTAMP DEFAULT NOW(),
    created_by TEXT,
    updated_at TIMESTAMP,
    updated_by TEXT
);

CREATE TABLE crm.emplouyee_bank_accounts (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES crm.employee_profile(id),
    account_holder_name TEXT NOT NULL,
    account_number TEXT NOT NULL,
    ifsc_code TEXT  NULL,
    bank_name TEXT  NULL,       
    account_type TEXT CHECK (public.account_type IN ('savings', 'current', 'fixed_deposit')),     
    currency_code VARCHAR(3) DEFAULT 'INR' REFERENCES master.master_currency(code),  
    effective_date TIMESTAMP,
    term_date TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,      
    created_at TIMESTAMP DEFAULT NOW(),
    created_by NOW(),
    updated_at TIMESTAMP,
    updated_by NOW()
);

-- CREATE TABLE employee_document (
--     id SERIAL PRIMARY KEY,
--     employee_id INTEGER REFERENCES employee_profile(id),
--     documebnt_type TEXT NOT NULL, -- e.g., 'resume', 'offer_letter', 'id_proof' etc
--     file_name TEXT NOT NULL, -- The original name of the file
--     file_path TEXT NOT NULL, -- The path/URL to the file in cloud storage
--     file_type TEXT, -- e.g., 'application/pdf', 'image/png'
--     location_url TEXT NOT NULL, -- The webUrl from Graph API for direct access
--     file_size_kb INTEGER,
--     is_deleted BOOLEAN DEFAULT FALSE,      
--     created_at TIMESTAMP DEFAULT NOW(),
--     created_by INTEGER REFERENCES employee_profile(id),
--     updated_at TIMESTAMP,
--     updated_by INTEGER REFERENCES employee_profile(id)
-- );

CREATE TABLE crm.user_account (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employee_profile(id),
    azure_ad_id TEXT,
    email TEXT
);

CREATE TABLE crm.payroll (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES crm.employee_profile(id),
    month DATE,
    base_salary NUMERIC,
    allowances NUMERIC,
    deductions NUMERIC,
    net_pay NUMERIC,
    status_id INTEGER REFERENCES master.master_status(id), -- Changed from payment_status to use master_status for consistency.
    payment_date DATE
);

-- Leave Management Tables
CREATE TABLE crm.leave_policy (
    id SERIAL PRIMARY KEY,
    role employee_role_enum NOT NULL,
    cycle_months INTEGER NOT NULL,
    quota INTEGER NOT NULL,
    carry_forward BOOLEAN DEFAULT FALSE,
    max_carry_forward_days INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE crm.leave_cycle (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES crm.employee_profile(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    quota INTEGER NOT NULL,
    used INTEGER DEFAULT 0,
    balance INTEGER GENERATED ALWAYS AS (quota + carried_forward - used) STORED,
    overused INTEGER GENERATED ALWAYS AS (GREATEST(0, used - quota - carried_forward)) STORED,
    carried_forward INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE crm.leave_request (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES crm.employee_profile(id),
    leave_date DATE NOT NULL,
    leave_type leave_type_enum,
    reason TEXT,
    acknowledged_by INTEGER REFERENCES crm.employee_profile(id),
    acknowledged_at TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,      
    created_at TIMESTAMP DEFAULT NOW(),
    created_by TEXT,
    updated_at TIMESTAMP,
    updated_by TEXT
);

-- Task Management Tables
CREATE TABLE crm.task (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    assigned_to INTEGER REFERENCES crm.employee_profile(id),
    created_by INTEGER REFERENCES crm.employee_profile(id),
    status_id INTEGER REFERENCES master.master_status(id),
    priority task_priority_enum, -- Changed from TEXT to ENUM for consistency.
    due_date DATE,
    context_type TEXT, -- e.g., 'PROPOSAL', 'ENGAGEMENT_LETTER', 'ENGAGEMENT', 'ENGAGEMENT_PHASE', 'ENGAGEMENT_SERVICE_ITEM'
    context_id INTEGER NOT NULL,
    estimated_hours NUMERIC, -- ADDED: For effort estimation
    logged_hours NUMERIC DEFAULT 0, -- ADDED: To track actual work done
    requires_approval BOOLEAN DEFAULT FALSE,
    approved_by INTEGER REFERENCES crm.employee_profile(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ADDED: A more robust way to track time against tasks
CREATE TABLE crm.timesheet_log (
    id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES crm.task(id) ON DELETE CASCADE,
    employee_id INTEGER REFERENCES crm.employee_profile(id),
    log_date DATE NOT NULL,
    hours_spent NUMERIC NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE crm.task_approver (
    id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES crm.task(id) ON DELETE CASCADE,
    employee_id INTEGER REFERENCES crm.employee_profile(id),
    UNIQUE(task_id, employee_id)
);


-- =================================================================
-- Section 4: Polymorphic Association Tables
-- =================================================================
-- Generic tables for comments and documents that can be attached to any entity.

-- This single table can hold threaded conversations for any record in the database.
-- It is "polymorphic" because it uses entity_type and entity_id to link to different parent tables.
-- It is "threaded" because the parent_comment_id allows comments to be replies to other comments.

CREATE TABLE crm.comment (
    id SERIAL PRIMARY KEY,
    entity_type TEXT NOT NULL, -- e.g., 'PROPOSAL', 'ENGAGEMENT', 'INVOICE', 'CUSTOMER'
    entity_id INTEGER NOT NULL,
    parent_comment_id INTEGER REFERENCES crm.comment(id), -- For threading replies
    content TEXT NOT NULL,
    created_by INTEGER REFERENCES crm.employee_profile(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);

CREATE TABLE crm.document (
    id SERIAL PRIMARY KEY,
    entity_type TEXT NOT NULL, -- e.g., 'PROPOSAL', 'ENGAGEMENT', 'CUSTOMER'
    entity_id INTEGER NOT NULL,
    file_name TEXT NOT NULL, -- The original name of the file
    file_path TEXT NOT NULL, -- The path/URL to the file in cloud storage
    file_type TEXT, -- e.g., 'application/pdf', 'image/png'
    location_url TEXT NOT NULL, -- The webUrl from Graph API for direct access
    file_size_kb INTEGER,
    uploaded_by TEXT,
    uploaded_at TIMESTAMP DEFAULT NOW()
);

-- =================================================================
-- Section 5: Office 365 Integration Tables
-- =================================================================
-- Best practice: Store only references to external content, not the content itself

CREATE TABLE crm.linked_email (
    id SERIAL PRIMARY KEY,
    entity_type TEXT NOT NULL, -- 'proposal', 'engagement_letter', 'engagement', 'customer'
    entity_id INTEGER NOT NULL,
    message_id TEXT NOT NULL, -- Microsoft Graph message ID
    conversation_id TEXT, -- Microsoft Graph conversation ID
    subject TEXT,
    sender_email TEXT,
    recipients TEXT[], -- Array of recipient emails
    cc_recipients TEXT[],
    sent_timestamp TIMESTAMP,
    direction TEXT CHECK (direction IN ('inbound', 'outbound')),
    has_attachments BOOLEAN DEFAULT FALSE,
    importance TEXT CHECK (importance IN ('low', 'normal', 'high')),
    graph_api_url TEXT, -- Direct link to message in Graph API
    synced_at TIMESTAMP DEFAULT NOW(),
    sync_status TEXT DEFAULT 'synced',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE crm.calendar_sync (
    id SERIAL PRIMARY KEY,
    entity_type TEXT NOT NULL, -- 'engagement_phase', 'task'
    entity_id INTEGER NOT NULL,
    event_id TEXT NOT NULL, -- Microsoft Graph event ID
    calendar_id TEXT, -- Which calendar it's in
    subject TEXT,
    start_datetime TIMESTAMP,
    end_datetime TIMESTAMP,
    is_all_day BOOLEAN DEFAULT FALSE,
    location TEXT,
    attendees TEXT[], -- Array of attendee emails
    organizer_email TEXT,
    web_link TEXT, -- Link to event in Outlook Web
    sync_direction TEXT CHECK (sync_direction IN ('to_outlook', 'from_outlook', 'bidirectional')),
    last_synced_at TIMESTAMP DEFAULT NOW(),
    sync_status TEXT DEFAULT 'synced',
    created_at TIMESTAMP DEFAULT NOW()
);

-- =================================================================
-- Section 6: Financial Extension Tables
-- =================================================================

CREATE TABLE crm.partner_commission (
    id SERIAL PRIMARY KEY,
    partner_id INTEGER REFERENCES crm.partner(id),
    invoice_id INTEGER REFERENCES crm.invoice(id),
    engagement_letter_id INTEGER REFERENCES crm.engagement_letter(id),
    commission_percentage NUMERIC CHECK (commission_percentage >= 0 AND commission_percentage <= 100),
    commission_amount NUMERIC NOT NULL,
    currency_code VARCHAR(3) DEFAULT 'INR' REFERENCES master.master_currency(code),
    commission_amount_inr NUMERIC,
    status_id INTEGER REFERENCES master.master_status(id),
    payment_date DATE,
    payment_reference TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =================================================================
-- Section 7: Logging Tables
-- =================================================================

CREATE TABLE crm.audit_log (
    id SERIAL PRIMARY KEY,
    table_name TEXT,
    record_id INTEGER,
    action TEXT, -- e.g., 'INSERT', 'UPDATE', 'DELETE'
    old_value JSONB,
    new_value JSONB,
    changed_by TEXT,
    changed_at TIMESTAMP DEFAULT NOW()
);

-- =================================================================
-- Section 8: Indexes
-- =================================================================

-- Index for better query performance on proposal target
CREATE INDEX idx_proposal_target ON crm.proposal(proposal_target);
