# SFEIR - AI-magine - Backend

## Run it

Before starting the project, you'll probably need some customization.

### Environment variables

| Key                      | Default value | Description                                                                               |
|--------------------------|---------------|-------------------------------------------------------------------------------------------|
| HOST                     | "localhost"   | Hostname where the server listen to                                                       |
| PORT                     | 3000          | Port where the server listen to                                                           |
| SWAGGER_BASE_PATH        | "docs"        | Base path for Swagger UI                                                                  |
| CORS_ALLOWED_ORIGINS     |               | Allow requests from specified origins (CORS security). Values should be coma separated.   |
| SQLITE_DB_PATH           | ":memory:"    | SQLite database file path, in memory if not set                                           |
| EMAIL_ENCRYPTION_KEY     |               | Key used to encrypt emails, server wont starts if not set. Should be 32 characters length |
| EMAIL_ENCRYPTION_IV      |               | IV used to encrypt emails, server wont starts if not set. Should be 16 characters length  |
| IMAGEN_GCP_PROJECT_ID    |               | Google Cloud Platform project identifier to use Imagen                                    |
| IMAGEN_REGION            |               | Google Cloud Platform region to use in Imagen                                             |
| IMAGEN_ENABLED           | false         | Will use Imagen if enabled or fallback to LoremPicsum                                     |
| FIRESTORE_GCP_PROJECT_ID |               | Google Cloud Platform project identifier to use Firestore                                 |
| FIRESTORE_ENABLED        | false         | Will use Firestore if enabled or fallback to SQLite                                       |
| BUCKET_GCP_PROJECT_ID    |               | Google Cloud Platform project identifier to use GCP Buckets                               |                                           |
| BUCKET_ENABLED           | false         | Will use GCP Bucket if enabled or fallback to no-storage                                  |
