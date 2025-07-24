# **VSTN CRM – Final Business Requirements**

## **1\. Company Background**

**VSTN Consultancy Pvt. Ltd.** is an Indian audit firm specializing in Operational Transfer Pricing (OTP). It serves both **direct customers** and **partner-referred clients**. This CRM system will support all activities from proposals to engagement management, invoicing, task tracking, and internal operations like employee and payroll management.

## **2\. Core Entities**

### **2.1 Customers**

Customers are the organizations VSTN provides services to. Each customer is categorized into one of three types, managed via a standard customer\_type\_enum:

* **direct**: Invoiced directly by VSTN.  
* **partner\_referred**: Referred by a partner. VSTN invoices the customer and pays a commission to the partner. These customers must be linked to a partner record.  
* **partner\_managed**: The partner invoices the end customer, and VSTN works on behalf of the partner. These customers must be linked to a partner record.

### **2.2 Partners**

Partners are typically other audit or consultancy firms who refer clients to VSTN. The system will track a default commission rate for each partner and manage commission payables for referred engagements.

### **2.3 Employees**

Employee profiles are managed internally, with roles (Admin, Manager, Consultant) defined by an employee\_role\_enum that corresponds to their permissions in Azure AD.

## **4\. Multi-Branch Management**

To properly segregate data for VSTN's different legal entities, the CRM will support a multi-branch architecture.

* **VSTN Branches**: The system will manage VSTN's distinct operational branches as separate legal entities using the master.vstn\_branch table.  
* **Data Association**: Every core record in the crm schema must be associated with a specific VSTN branch. This includes Customers, Partners, Proposals, and Engagements.




## **5\. Engagement Lifecycle**

The CRM follows a structured workflow from initial proposal to final execution.

### **5.1 Proposal Flow**

The proposal is a detailed, pre-engagement document that defines the scope and cost of work. It is not a binding contract.

* **Target Audience**: A proposal can be prepared for a **customer** or directly **for a partner**.  

* **Structure:**  
  * **proposal**: The main record, linked to a customer.  
  * **proposal\_service\_item**: which are detailed descriptions of the work to be performed (e.g., 'Transaction Analysis and benchmarking').  
  * **proposal\_clause**: A flexible section for adding multiple, custom-titled text blocks like 'Notes', 'Terms & Conditions', or 'Exclusions'.  
* **Workflow:** The proposal's status is tracked via the master\_status table (e.g., 'Draft', 'Sent', 'Approved', 'Rejected').

### **5.2 Engagement Letter Flow**

Once a proposal is approved, an Engagement Letter is created for a specific piece of work. This is the binding contract.

* **Creation:** An `engagement_letter` is generated based on an approved proposal. The user **selects the specific service items** from the `proposal_service_item` list that are included in this particular engagement.
* **Traceability:** Each service item in the engagement letter (`engagement_letter_service_item`) will maintain a direct link to the original `proposal_service_item` it came from.
* **Enrichment:** The Engagement Letter adds the final contractual details, such as:
    * Final agreed-upon rates for the selected services.
    * Specific timelines, deliverables, and payment terms for the engagement.
    * Any special conditions not present in the original proposal.
* **Approval:** The letter follows its own approval workflow, tracked via the `master_status` table.


### **5.3 Engagement Execution**

Work begins only after the Engagement Letter is approved. An engagement record is created to track the entire execution phase of the project. To ensure detailed management and tracking, the engagement is managed through a clear hierarchy:

* **Engagement:** The top-level container for the project, assigned to an Engagement Manager.  
* **Engagement Phase:** The engagement is broken down into logical stages (e.g., 'Data Gathering', 'Analysis', 'Final Reporting'). Each phase has its own timeline and status.  
* **Engagement Service Item:** Within each phase, the specific contractual deliverables from the Engagement Letter are listed as service items. These are the core work products.  
* **Tasks:** To execute a service item, one or more tasks are created. These are the granular, day-to-day work units assigned to consultants.

The status of the engagement, its phases, and its service items (e.g., 'Not Started', 'Active', 'Completed') is managed via the master\_status table.

### **5.4 Engagement Progress and Health Tracking**

To move beyond simple status updates, the CRM will provide powerful tools for measuring true project progress and health.

* **Effort-Based Progress:** Progress will be calculated based on effort, not just a checklist of completed items.  
  * Each task will have an estimated\_hours field for planning and resource allocation.  
  * Consultants will log their actual\_hours spent against each task, providing a clear picture of the work completed.  
  * Progress at the phase and engagement level will be a roll-up of logged hours versus estimated hours, giving a far more accurate completion percentage.  
* **Baseline and Variance Analysis:** To enforce project discipline and provide clear insights into performance, the system will use baselines.  
  * When an engagement or phase officially starts, its initial start\_date and end\_date are copied into immutable baseline\_start\_date and baseline\_end\_date fields.  
  * This baseline is a "frozen" snapshot of the original plan and cannot be changed.  
  * As the project progresses, the system will calculate **schedule variance** by comparing the actual\_end\_date to the baseline\_end\_date. This clearly shows if the project was delivered on time, early, or late, even if the planned dates were changed during execution.  
* **Reporting and Visualization for Management:** This detailed data will power several key views for managers and admins to handle a large number of engagements effectively:  
  * **Gantt Charts:** A visual timeline view of all phases and service items, showing their start/end dates, progress, and dependencies. This view will also be able to display the baseline dates against the actual dates to visualize schedule variance.  
  * **Kanban Boards:** At the team level, tasks for a specific phase can be viewed on a Kanban board, with columns defined by the master\_status table (e.g., 'To Do', 'In Progress', 'Done'). This helps teams manage their workflow.  
  * **Portfolio Health Dashboard:** A high-level dashboard for managers showing all active engagements with key metrics, including overall progress percentage and a "Health Status" (Red, Amber, Green) determined by schedule and budget variance.

## **6\. Master Data Management**

The CRM uses a combination of master tables and ENUM types to ensure data consistency and flexibility.

* **master\_status**: A central table to manage all status types across different modules (Tasks, Invoices, Proposals, etc.). It defines the status name, a workflow sequence, and whether a status is "final" (i.e., locks the record from further edits).  
* **master\_service**: A catalog of all standard services offered by VSTN, including default descriptions, rates, and categories.  
* **master\_currency**: Manages all supported currencies, their symbols, and identifies the base currency for reporting.  
* **ENUM Types**: For simple, static lists like customer type, employee role, and leave type, the system uses PostgreSQL ENUM types to enforce data integrity at the database level.

## **7\. Collaboration & Communication**

### **7.1 Comments**

A central, polymorphic comment table allows for threaded conversations on any key record in the system (e.g., a Proposal, an Invoice, a Customer). This enables contextual discussions without cluttering the interface.

### **7.2 Document Management (SharePoint/OneDrive Integration)**

The system will not support native file uploads. All documents will be managed in SharePoint or OneDrive to maintain a single source of truth.

* The polymorphic document table will store links to these M365 documents.  
* The CRM will use the Microsoft Graph API to fetch metadata (file name, type, size) and the direct webUrl for seamless access.

### **7.3 Email Logging (Office 365 Integration)**

To maintain a complete audit trail of client communication, the system will implement a hybrid email logging strategy.

* When an employee links an email from Outlook, the system will use the Microsoft Graph API to:  
  1. **Link to the Live Email:** Store the email's graph\_message\_id and web\_link for easy access to the original email and its thread in Outlook.  
  2. **Store a Permanent Softcopy:** Download the email's full MIME content as an .eml file and store it in a secure cloud blob storage. The path to this file is saved in the linked\_email table.  
* This ensures that a permanent record exists for compliance, even if the original email is deleted from the user's mailbox.

## **8\. Task Management**

Tasks are internal units of work linked to various CRM entities.

* **Context:** Tasks can be linked to a Proposal, Engagement Letter, or a specific Service Item during execution.  
* **Priority:** Task priority is managed by a standard task\_priority\_enum ('low', 'normal', 'high', 'urgent').  
* **Approval Workflow:**  
  * A task can be configured to require approval.  
  * Multiple employees can be assigned as potential approvers in the task\_approver table.  
  * The task table records who ultimately approved the task (approved\_by) and when. Any one of the designated approvers can provide the approval.

## **9\. Financials**

### **9.1 Invoicing**

Invoices are generated based on the billing schedule defined in the Engagement Letter phases. The system supports multi-currency invoicing and tracks the INR equivalent.

### **9.2 Partner Commissions**

For partner\_referred engagements, commissions must be tracked.

* The commission\_payable table will create a record for each commission due, linked to the engagement and the specific invoice that triggered it.  
* The status of the commission (e.g., 'Due', 'Paid') will be managed via the master\_status table.


## 10. Document Management Best Practices with SharePoint

This design employs SharePoint as a dedicated document management backend, which is a best practice for long-term scalability, security, and compliance. The CRM does not store files; it only stores references to them in the `document` table.

#### SharePoint Folder Structure

A dedicated SharePoint site will be used with a structured hierarchy to keep files organized, scalable, and easy to manage. This structure is designed for the long run, preventing a chaotic flat-file system.



/Documents/
|-- Customers/
| |-- {Customer_Name}{Customer_Code}/
| |-- {Engagement_Code}{Engagement_Name}/
| |-- 01_Proposal/
| |-- 02_Engagement_Letter/
| |-- 03_Working_Files/
| |-- 04_Client_Deliverables/
| |-- 05_Correspondence/
|
|-- Partners/
| |-- {Partner_Name}{Partner_Code}/
| |-- Managed_Customers/
| |-- {End_Customer_Name}/
| |-- {Engagement_Code}{Engagement_Name}/
| |-- (same sub-folder structure as above)
|
|-- Internal/
|-- Employee_Documents/
| |-- {Employee_Name}_{Employee_Code}/
#### Core Upload Workflow

1.  **Initiation (React)**: A user clicks "Upload Document" within the context of a CRM record.
2.  **Get Upload URL (FastAPI)**: The backend constructs the correct SharePoint folder path, creates it if it doesn't exist, and requests a secure `uploadUrl` from the Microsoft Graph API. This avoids handling file streams on the server.
3.  **Direct Upload (React)**: The frontend uploads the file directly to the SharePoint `uploadUrl`.
4.  **Finalize (FastAPI)**: The backend fetches the final file metadata from the Graph API and saves it to the polymorphic `document` table in the CRM database, linking it to the correct entity.

#### Permissions Management

Permissions are managed in SharePoint using Microsoft 365 Groups, which are programmatically associated with engagements. This is a best practice as it centralizes access control within the M365 environment.

* **Admin**: Has "Owner" or "Full Control" over the entire SharePoint site.
* **Manager**: When assigned to an engagement, they are added to the engagement's M365 Group with **"Edit"** rights, giving them full control over the engagement's folder.
* **Consultant**: When assigned to a task within an engagement, they are added to the M365 Group as a **Member**. This grants them:
    * **"Edit"** permissions on the `03_Working_Files` folder for day-to-day work.
    * **"Read"** permissions on the `01_Proposal` and `02_Engagement_Letter` folders to ensure they cannot alter contractual documents.


## **11\. Auditing**

A comprehensive audit\_log table will record all significant changes to data. For every INSERT, UPDATE, or DELETE action on key tables, the log will store the table name, the record ID, the user who made the change, and a JSON snapshot of the old and new values.