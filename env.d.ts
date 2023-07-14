declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CONFIG?: string;
    }
  }
}

export {};
