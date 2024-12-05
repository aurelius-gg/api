declare global {
  namespace NodeJS {
    interface ProcessEnv {
    //   DATABASE_URL: string;
    //   REDIS_URL: string;

      POSTGRES_USER: string;
      POSTGRES_PASSWORD: string;
      POSTGRES_PORT: string;
      POSTGRES_HOST: string;

      REDIS_USER: string;
      REDIS_PASSWORD: string;
      REDIS_PORT: string;
      REDIS_HOST: string;
    }
  }
}

export {};
