declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EMAIL_HASH_SECRET: string;
    }
  }
}

export {};
