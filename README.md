# AirBNC - Backend

## Overview

A full-stack web application that mimics a property rental site. 

This repo is for the Backend portion of the project and is built using Node.js, Express, and PostgreSQL. Uses Supabase for database hosting, and is deployed on Render.

### 📋Prerequisites

- **Node.js**
- **PostgreSQL**
- **NPM**

### 👩‍💻Instalation steps:

**1. Fork and then clone the repositiory to work locally on your machine:**

```
git clone https://github.com/your_user_name/airbnc

```

**2. Install the necessary dependencies running:**

```
npm install
```

**3. To set up the database locally, run:**

```
npm run setup-dbs
```

**4. Create.env file at the root level where to store an environment variable for the connection pool to access database. Run:**

`.env.test`:

```
PGDATABASE=airbnc_test
```

`.env.dev`:

```
PGDATABASE=airbnc_dev
```

**_Ensure both .env files are added to a .gitignore file._**

**5. Seed the Databases:**

If you work with test data:

```
npm run seed-test
```

If you work with dev data run:

```
npm run seed-dev
```
