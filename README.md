# Geogram Server

> Pet project – backend server built with NestJS

Geogram Server is a backend application for social app. It includes features like:

- User authentication and session management
- Password reset and email verification
- Fetching user data through endpoints
- Friend/subscription management
- Posts: create, delete, like/dislike, comments, attachments
- User profile: avatar and cover images
- File uploads with validation (images and other files)
- Configurable token lifetimes and MinIO bucket settings

---

## Tech Stack / Dependencies

- Node.js / NestJS
- PostgreSQL
- Redis
- MinIO

All dependencies can be run via **Docker**.

---

## Environment Variables

Create a `.env` file in the project root:

```.env
# Server
PORT=<port_that_app_be_run>

# JWT
JWT_SECRET=<jwt_secret_key>

# PostgreSQL
POSTGRES_USER=<postgresql_user>
POSTGRES_PASSWORD=<postgresql_password>
POSTGRES_DB=<db_name>

# Redis
REDIS_HOST=<redis_host>
REDIS_PORT=<redis_port>

# MinIO
MINIO_ENDPOINT=<minio_host>
MINIO_PORT=<minio_port>
MINIO_ACCESS_KEY=<minio_access_key>
MINIO_SECRET_KEY=<minio_secret_key>

# Email (for password reset / verification)
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_email_password

# Frontend URL
FRONTEND_URL=<base_frontend_url> #like http://localhost:3000/
```

Optional configs can be found in `src/config/app.config.ts`, and `multer.config.ts`;


---
## Run server

```bash
npm install

# Dev-mode
npm run start:dev

# Build + Prod-mode
npm run build
npm run start
```

> Make sure `.env` is configured with required variables.

---

## Ports

| Service       | Port          |
|---------------|---------------|
| Server        | `$PORT` (default 4000) |
| PostgreSQL    | 5432          |
| Redis         | 6379          |
| MinIO         | 9000          |

---