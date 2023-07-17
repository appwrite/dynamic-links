/**
 * @param {string} key
 * @return {string}
 */
function getRequiredEnv(key) {
  const value = process.env[key]
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not set`)
  }
  return value
}

const environment = {
  APPWRITE_API_KEY: getRequiredEnv('APPWRITE_API_KEY'),
  APPWRITE_ENDPOINT: getRequiredEnv('APPWRITE_ENDPOINT'),
  APPWRITE_PROJECT_ID: getRequiredEnv('APPWRITE_PROJECT_ID'),
  DATABASE_ID: process.env.DATABASE_ID ?? 'dynamic-links',
  DATABASE_NAME: 'Dynamic Links',
  PATH_COLLECTION_ID: process.env.COLLECTION_ID ?? 'paths',
  PATH_COLLECTION_NAME: 'Paths',
  RULE_COLLECTION_ID: process.env.COLLECTION_ID ?? 'rules',
  RULE_COLLECTION_NAME: 'Rules',
}

export default environment
