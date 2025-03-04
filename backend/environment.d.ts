declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EMAIL_HASH_SECRET: string;
      CORS_ALLOWED_ORIGINS: string;
      SQLITE_DB_PATH: string;
      IMAGEN_GCP_PROJECT_ID: string;
      IMAGEN_REGION: string;
    }
  }
}

export {};
