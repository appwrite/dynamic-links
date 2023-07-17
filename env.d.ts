declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APPWRITE_ENDPOINT?: string
      APPWRITE_PROJECT_ID?: string
      APPWRITE_API_KEY?: string
      DATABASE_ID?: string
      DATABASE_NAME?: string
      PATH_COLLECTION_ID?: string
      PATH_COLLECTION_NAME?: string
      RULE_COLLECTION_ID?: string
      RULE_COLLECTION_NAME?: string
    }
  }
}

export {}
