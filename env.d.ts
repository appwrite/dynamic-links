declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CONFIG?: string;
      GOOGLE_ANALYTICS_API_KEY?: string;
    }
  }
}

export {};
