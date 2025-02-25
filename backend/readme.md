# SFEIR - AI-magine - Backend

## Run it

Before starting the project, you'll probably need some customization.

### Environment variables

| Key                  | Default value | Description                                                  |
|----------------------|---------------|--------------------------------------------------------------|
| HOST                 | "localhost"   | Hostname where the server listen to                          |
| PORT                 | 3000          | Port where the server listen to                              |
| SWAGGER_BASE_PATH    | "docs"        | Base path for Swagger UI                                     |
| CORS_ALLOWED_ORIGINS |               | Allow requests from specified origins (CORS security)        |
| SQLITE_DB_PATH       | ":memory:"    | SQLite database file path, in memory if not set              | 
| EMAIL_HASH_SECRET    |               | Secret used to encrypt emails, server wont starts if not set |
