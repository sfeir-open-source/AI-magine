declare global {
  namespace NodeJS {
    interface ProcessEnv {
      npm_package_name: string;
      npm_package_version: string;
      SWAGGER_BASE_PATH: string;
      EMAIL_HASH_SECRET: string;
      CORS_ALLOWED_ORIGINS: string;
      SQLITE_DB_PATH: string;
      IMAGEN_GCP_PROJECT_ID: string;
      IMAGEN_REGION: string;
      IMAGEN_ENABLED: string;
      FIRESTORE_ENABLED: string;
      FIRESTORE_GCP_PROJECT_ID: string;
      BUCKET_ENABLED: string;
      BUCKET_GCP_PROJECT_ID: string;
    }
  }
}

export {};
