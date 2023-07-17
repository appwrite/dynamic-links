import { Client, Databases } from 'node-appwrite'

export const PathType = {
  EXACT: 'exact',
  PREFIX: 'prefix',
  SUFFIX: 'suffix',
  REGEX: 'regex',
}

export const RuleType = {
  PLATFORM: 'platform',
  OS: 'os',
  BROWSER: 'browser',
  LANGUAGE: 'language',
  COUNTRY: 'country',
}

/**
 * @typedef {Object} DynamicLinkRule
 * @property {boolean} enabled
 * @property {("platform" | "os" | "browser" | "language" | "country")} ruleType
 * @property {string} ruleValue
 * @property {string} target
 *
 * @typedef {import('node-appwrite').Models.Document & DynamicLinkRule} DynamicLinkRuleDocument
 */

/**
 * @typedef {Object} DynamicLinkPath
 * @property {boolean} enabled
 * @property {("exact" | "prefix" | "suffix"| "regex")} pathType
 * @property {string} pathValue
 * @property {string} fallbackTarget
 * @property {DynamicLinkRuleDocument[]} rules
 *
 * @typedef {import('node-appwrite').Models.Document & DynamicLinkPath} DynamicLinkPathDocument
 */

/**
 * @typedef {Object} AppwriteService
 * @property {() => Promise<DynamicLinkPathDocument[]>} getPaths
 * @property {() => Promise<void>} setupDynamicLinksDatabase
 * @property {() => Promise<boolean>} doesDynamicLinksDatabaseExist
 */

/**
 * @param {typeof import('./environment').default} environment
 * @returns {AppwriteService}
 */
export default function AppwriteService(environment) {
  const {
    APPWRITE_ENDPOINT,
    APPWRITE_PROJECT_ID,
    APPWRITE_API_KEY,
    DATABASE_ID,
    DATABASE_NAME,
    PATH_COLLECTION_ID,
    PATH_COLLECTION_NAME,
    RULE_COLLECTION_ID,
    RULE_COLLECTION_NAME,
  } = environment

  const client = new Client()
  client
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY)

  const databases = new Databases(client)

  async function setupPathsCollection() {
    try {
      await databases.createCollection(
        DATABASE_ID,
        PATH_COLLECTION_ID,
        PATH_COLLECTION_NAME
      )
      await databases.createBooleanAttribute(
        DATABASE_ID,
        PATH_COLLECTION_ID,
        'enabled',
        true
      )
      await databases.createEnumAttribute(
        DATABASE_ID,
        PATH_COLLECTION_ID,
        'pathType',
        ['exact', 'prefix', 'suffix', 'regex'],
        true
      )
      await databases.createStringAttribute(
        DATABASE_ID,
        PATH_COLLECTION_ID,
        'pathValue',
        65536,
        true
      )
      await databases.createUrlAttribute(
        DATABASE_ID,
        PATH_COLLECTION_ID,
        'fallbackTarget',
        true
      )
    } catch (err) {
      // If resource already exists, we can ignore the error
      if (err.code !== 409) throw err
    }
  }

  async function setupRulesCollection() {
    try {
      await databases.createCollection(
        DATABASE_ID,
        RULE_COLLECTION_ID,
        RULE_COLLECTION_NAME
      )
      await databases.createBooleanAttribute(
        DATABASE_ID,
        RULE_COLLECTION_ID,
        'enabled',
        true
      )
      await databases.createEnumAttribute(
        DATABASE_ID,
        RULE_COLLECTION_ID,
        'ruleType',
        ['platform', 'os', 'browser', 'language', 'country'],
        true
      )
      await databases.createStringAttribute(
        DATABASE_ID,
        RULE_COLLECTION_ID,
        'ruleValue',
        255,
        true
      )
      await databases.createUrlAttribute(
        DATABASE_ID,
        RULE_COLLECTION_ID,
        'target',
        true
      )
    } catch (err) {
      // If resource already exists, we can ignore the error
      if (err.code !== 409) throw err
    }
  }

  async function setupRelationships() {
    try {
      await databases.createRelationshipAttribute(
        DATABASE_ID,
        PATH_COLLECTION_ID,
        RULE_COLLECTION_ID,
        'oneToMany',
        false,
        'rules',
        undefined,
        'cascade'
      )
    } catch (err) {
      // If resource already exists, we can ignore the error
      if (err.code !== 409) throw err
    }
  }

  return {
    /**
     * @returns {Promise<boolean>}
     */
    doesDynamicLinksDatabaseExist: async function () {
      try {
        await databases.get(DATABASE_ID)
        return true
      } catch (err) {
        if (err.code !== 404) throw err
        return false
      }
    },

    setupDynamicLinksDatabase: async function () {
      try {
        await databases.create(DATABASE_ID, DATABASE_NAME)
        await setupPathsCollection()
        await setupRulesCollection()
        await setupRelationships()
      } catch (err) {
        // If resource already exists, we can ignore the error
        if (err.code !== 409) throw err
      }
    },

    /**
     * @returns {Promise<DynamicLinkPathDocument[]>}
     */
    getPaths: async function () {
      const { documents } = await databases.listDocuments(
        DATABASE_ID,
        PATH_COLLECTION_ID
      )
      return /** @type {DynamicLinkPathDocument[]} */ (documents)
    },
  }
}
