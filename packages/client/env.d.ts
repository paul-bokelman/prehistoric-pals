declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_JWT_SECRET: string;
      NEXT_PUBLIC_URL: string;
      NODE_ENV: "development" | "production";
    }
  }
}

export {};
