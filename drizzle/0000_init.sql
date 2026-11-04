-- Generated schema for Sientax dashboard (Postgres)
CREATE TYPE "public"."portal_role" AS ENUM('admin', 'employee', 'client', 'refer');
CREATE TYPE "public"."document_kind" AS ENUM('deduction', 'spouse_deduction', 'review', 'other');
CREATE TYPE "public"."payment_source" AS ENUM('zelle', 'other');

CREATE TABLE "employees" (
  "id" serial PRIMARY KEY NOT NULL,
  "first_name" varchar(200) NOT NULL,
  "last_name" varchar(200) NOT NULL,
  "email" varchar(200) DEFAULT '' NOT NULL,
  "phone" varchar(200) DEFAULT '' NOT NULL,
  "login" varchar(255) NOT NULL,
  "password_hash" varchar(255) NOT NULL,
  "business_email" varchar(200) DEFAULT '' NOT NULL,
  "level" integer DEFAULT 0 NOT NULL,
  "is_admin" boolean DEFAULT false NOT NULL,
  "active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "employees_login_unique" UNIQUE("login")
);

CREATE TABLE "clients" (
  "id" serial PRIMARY KEY NOT NULL,
  "first_name" varchar(200) NOT NULL,
  "middle_name" varchar(100) DEFAULT '' NOT NULL,
  "last_name" varchar(200) NOT NULL,
  "email" varchar(200) NOT NULL,
  "phone" varchar(200) DEFAULT '' NOT NULL,
  "alt_phone" varchar(200) DEFAULT '' NOT NULL,
  "password_hash" varchar(255) NOT NULL,
  "payment_status" integer DEFAULT 0 NOT NULL,
  "registered_by" varchar(100) DEFAULT 'self' NOT NULL,
  "file_no" varchar(100) DEFAULT '' NOT NULL,
  "year" integer,
  "referral" varchar(100) DEFAULT '0' NOT NULL,
  "time_zone" varchar(255) DEFAULT 'none' NOT NULL,
  "pref" varchar(255) DEFAULT 'none' NOT NULL,
  "role" "portal_role" DEFAULT 'client' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX "clients_email_idx" ON "clients" USING btree ("email");
CREATE INDEX "clients_file_no_idx" ON "clients" USING btree ("file_no");

CREATE TABLE "tax_files" (
  "id" serial PRIMARY KEY NOT NULL,
  "file_no" varchar(32) NOT NULL,
  "client_id" integer NOT NULL,
  "emp_id" integer DEFAULT 1 NOT NULL,
  "year" integer NOT NULL,
  "stage" varchar(100) DEFAULT 'Pre Process' NOT NULL,
  "substage" varchar(200) DEFAULT 'Interview Pending' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX "tax_files_file_no_year_uidx" ON "tax_files" USING btree ("file_no","year");
CREATE INDEX "tax_files_emp_year_idx" ON "tax_files" USING btree ("emp_id","year");

CREATE TABLE "interview_sheets" (
  "id" serial PRIMARY KEY NOT NULL,
  "file_no" varchar(32) NOT NULL,
  "year" integer NOT NULL,
  "marital_status" varchar(200) DEFAULT '' NOT NULL,
  "ssn_encrypted" text DEFAULT '' NOT NULL,
  "date_of_marriage" varchar(100) DEFAULT '' NOT NULL,
  "date_of_birth" varchar(100) DEFAULT '' NOT NULL,
  "current_visa_category" varchar(100) DEFAULT '' NOT NULL,
  "current_address" varchar(255) DEFAULT '' NOT NULL,
  "occupation" varchar(100) DEFAULT '' NOT NULL,
  "current_city" varchar(100) DEFAULT '' NOT NULL,
  "current_state" varchar(100) DEFAULT '' NOT NULL,
  "zipcode" varchar(100) DEFAULT '' NOT NULL,
  "comment" varchar(255) DEFAULT ' ' NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX "interview_file_year_uidx" ON "interview_sheets" USING btree ("file_no","year");

CREATE TABLE "interview_sheet_spouses" (
  "id" serial PRIMARY KEY NOT NULL,
  "file_no" varchar(32) NOT NULL,
  "year" integer NOT NULL,
  "first_name" varchar(255) DEFAULT '' NOT NULL,
  "middle_name" varchar(255) DEFAULT '' NOT NULL,
  "last_name" varchar(255) DEFAULT '' NOT NULL,
  "email" varchar(255) DEFAULT '' NOT NULL,
  "phone" varchar(255) DEFAULT '' NOT NULL,
  "marital_status" varchar(200) DEFAULT '' NOT NULL,
  "ssn_encrypted" text DEFAULT '' NOT NULL,
  "date_of_marriage" varchar(100) DEFAULT '' NOT NULL,
  "date_of_birth" varchar(100) DEFAULT '' NOT NULL,
  "current_visa_category" varchar(100) DEFAULT '' NOT NULL,
  "current_address" varchar(255) DEFAULT '' NOT NULL,
  "occupation" varchar(100) DEFAULT '' NOT NULL,
  "current_city" varchar(100) DEFAULT '' NOT NULL,
  "current_state" varchar(100) DEFAULT '' NOT NULL,
  "zipcode" varchar(100) DEFAULT '' NOT NULL,
  "comment" varchar(255) DEFAULT ' ' NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX "interview_spouse_file_year_uidx" ON "interview_sheet_spouses" USING btree ("file_no","year");

CREATE TABLE "dependents" (
  "id" serial PRIMARY KEY NOT NULL,
  "file_no" varchar(32) NOT NULL,
  "year" integer NOT NULL,
  "first_name" varchar(255) NOT NULL,
  "middle_name" varchar(255) DEFAULT ' ' NOT NULL,
  "last_name" varchar(255) NOT NULL,
  "relation" varchar(200) NOT NULL,
  "date_of_birth" varchar(255) DEFAULT '' NOT NULL,
  "ssn_encrypted" text DEFAULT '' NOT NULL
);

CREATE TABLE "residencies" (
  "id" serial PRIMARY KEY NOT NULL,
  "file_no" varchar(32) NOT NULL,
  "year" integer NOT NULL,
  "state" varchar(200) NOT NULL,
  "comment" varchar(255) DEFAULT ' ' NOT NULL
);

CREATE TABLE "documents" (
  "id" serial PRIMARY KEY NOT NULL,
  "file_no" varchar(32) NOT NULL,
  "year" integer NOT NULL,
  "kind" "document_kind" DEFAULT 'deduction' NOT NULL,
  "type" varchar(255) NOT NULL,
  "original_name" varchar(512) DEFAULT '' NOT NULL,
  "storage_key" varchar(1024) NOT NULL,
  "mime_type" varchar(255) DEFAULT 'application/octet-stream' NOT NULL,
  "size_bytes" integer DEFAULT 0 NOT NULL,
  "uploader_role" varchar(50) DEFAULT 'client' NOT NULL,
  "remarks" varchar(255) DEFAULT '' NOT NULL,
  "legacy_missing" boolean DEFAULT false NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX "documents_file_year_idx" ON "documents" USING btree ("file_no","year");

CREATE TABLE "estimates" (
  "id" serial PRIMARY KEY NOT NULL,
  "file_no" varchar(32) NOT NULL,
  "year" integer NOT NULL,
  "body" text DEFAULT '' NOT NULL,
  "line_items" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "remark" varchar(255) DEFAULT '' NOT NULL,
  "created_by" varchar(255) NOT NULL,
  "status" varchar(50) DEFAULT 'draft' NOT NULL,
  "created_on" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "invoices" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar(255) DEFAULT 'none' NOT NULL,
  "address" varchar(255) DEFAULT 'none' NOT NULL,
  "description" text DEFAULT '[]' NOT NULL,
  "line_items" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "file_no" varchar(32) DEFAULT '0' NOT NULL,
  "year" integer,
  "total" varchar(255) DEFAULT '0' NOT NULL,
  "coupon" varchar(255) DEFAULT 'none' NOT NULL,
  "referral" varchar(255) DEFAULT 'none' NOT NULL,
  "date" varchar(255) DEFAULT 'none' NOT NULL,
  "payment_status" varchar(100) DEFAULT 'none' NOT NULL,
  "payment_mode" varchar(100) DEFAULT 'none' NOT NULL,
  "created_by" varchar(255) DEFAULT 'ADMIN' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "payments" (
  "id" serial PRIMARY KEY NOT NULL,
  "file_no" varchar(32) NOT NULL,
  "year" integer NOT NULL,
  "invoice_id" integer,
  "invoice_no" varchar(255) DEFAULT '' NOT NULL,
  "source" "payment_source" DEFAULT 'zelle' NOT NULL,
  "discount" varchar(255) DEFAULT '0' NOT NULL,
  "referral_bonus" varchar(100) DEFAULT '0' NOT NULL,
  "payment_received" varchar(100) NOT NULL,
  "total_fee" integer DEFAULT 0 NOT NULL,
  "date" varchar(100) DEFAULT '' NOT NULL,
  "remarks" varchar(255) DEFAULT '' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "notifications" (
  "id" serial PRIMARY KEY NOT NULL,
  "file_no" varchar(32) DEFAULT '' NOT NULL,
  "title" varchar(255) NOT NULL,
  "description" varchar(512) DEFAULT '' NOT NULL,
  "status" integer DEFAULT 0 NOT NULL,
  "target_emp_id" integer,
  "target_client_id" integer,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "history" (
  "id" serial PRIMARY KEY NOT NULL,
  "file_no" varchar(32) NOT NULL,
  "year" integer NOT NULL,
  "employee" varchar(255) NOT NULL,
  "action" varchar(255) NOT NULL,
  "remark" text DEFAULT '' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "mails" (
  "id" serial PRIMARY KEY NOT NULL,
  "file_no" varchar(32) NOT NULL,
  "year" integer NOT NULL,
  "summary" varchar(255) NOT NULL,
  "body" text DEFAULT '' NOT NULL,
  "created_by" varchar(255) NOT NULL,
  "created_on" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "password_reset_tokens" (
  "id" serial PRIMARY KEY NOT NULL,
  "portal" varchar(20) NOT NULL,
  "subject_id" integer NOT NULL,
  "email" varchar(255) NOT NULL,
  "token_hash" varchar(255) NOT NULL,
  "expires_at" timestamp with time zone NOT NULL,
  "used_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "settings" (
  "id" serial PRIMARY KEY NOT NULL,
  "key" varchar(100) NOT NULL,
  "value" jsonb NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "settings_key_unique" UNIQUE("key")
);

CREATE TABLE "auth_user" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "email" text NOT NULL,
  "email_verified" boolean DEFAULT false NOT NULL,
  "image" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  "role" varchar(50) DEFAULT 'client' NOT NULL,
  "portal" varchar(20) DEFAULT 'client' NOT NULL,
  "legacy_client_id" integer,
  "legacy_employee_id" integer,
  "login" varchar(255),
  CONSTRAINT "auth_user_email_unique" UNIQUE("email")
);

CREATE TABLE "auth_session" (
  "id" text PRIMARY KEY NOT NULL,
  "expires_at" timestamp NOT NULL,
  "token" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  "ip_address" text,
  "user_agent" text,
  "user_id" text NOT NULL,
  "tax_year" integer,
  CONSTRAINT "auth_session_token_unique" UNIQUE("token")
);

CREATE TABLE "auth_account" (
  "id" text PRIMARY KEY NOT NULL,
  "account_id" text NOT NULL,
  "provider_id" text NOT NULL,
  "user_id" text NOT NULL,
  "access_token" text,
  "refresh_token" text,
  "id_token" text,
  "access_token_expires_at" timestamp,
  "refresh_token_expires_at" timestamp,
  "scope" text,
  "password" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "auth_verification" (
  "id" text PRIMARY KEY NOT NULL,
  "identifier" text NOT NULL,
  "value" text NOT NULL,
  "expires_at" timestamp NOT NULL,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

ALTER TABLE "tax_files" ADD CONSTRAINT "tax_files_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "tax_files" ADD CONSTRAINT "tax_files_emp_id_employees_id_fk" FOREIGN KEY ("emp_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "auth_session" ADD CONSTRAINT "auth_session_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_user"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "auth_account" ADD CONSTRAINT "auth_account_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_user"("id") ON DELETE no action ON UPDATE no action;
