# Server Setup Guide

Before running the `deploy.yml` workflow, ensure that the server is properly set up. Without completing this setup, the workflow will not work as expected.

## Step 1: SSH into the DCISM Server

SSH into the server using the instructions provided at `admin.dcism.org`.

## Step 2: Clone the Repository

Clone the repository to the subdomain:

```bash
cd ciscode.dcism.org
git clone https://github.com/usc-cisco/ciscode.git
cd ciscode
mv * .[^.]* ../  # Move all files, including hidden ones, to the parent directory
cd ..
rmdir ciscode  # Remove the now-empty directory
```

## Step 3: Install Dependencies

Install the necessary dependencies using Bun:

```bash
npm install --include=optional
```

## Step 4: Set up environment variables for MySQL

```
DB_PORT=
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
```

## Step 5: Initialize the MySQL Database

To initialize the MySQL tables:
```bash
npm run db:sync
```

To seed the MySQL database:

```bash
npm run db:seed
```

## Step 6: Build the Server

Build the server for production:

```bash
npm run build
```

## Step 7: Start the Server

Start the server using PM2:

```bash
pm2 start npm --name 'ciscode' -- start
```

## Step 8: Configure `.htaccess`

Create or update the `.htaccess` file with the following rules:

```bash
DirectoryIndex disabled

RewriteEngine on

RewriteCond %{SERVER_PORT} 80
RewriteRule ^.*$ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]

RewriteRule (.*) http://127.0.0.1:{{ DCISM_PORT }}%{REQUEST_URI} [P,L,NE]
```

> [!NOTE] 
> Make sure to replace {{ DCISM_PORT }} with the port used for deployment. (You can find the allowed port ranges at `admin.dcism.org`)

This configuration ensures:

- Redirects HTTP traffic to HTTPS.
- Proxies traffic to `127.0.0.1:{{ DCISM_PORT }}`.

---

Once this setup is complete, you can proceed with the `deploy.yml` workflow.