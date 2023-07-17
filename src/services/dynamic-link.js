import { PathType, RuleType } from './appwrite.js'

const detector = {
  /**
   * @param {string} userAgent
   */
  platform: (userAgent) => {
    if (/Android|webOS/i.test(userAgent)) return 'mobile'
    if (/iPhone|iPad|iPod/i.test(userAgent)) return 'mobile'
    if (/BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) return 'mobile'
    if (/Windows|Macintosh|Linux/i.test(userAgent)) return 'desktop'
    return 'unknown'
  },
  /**
   * @param {string} userAgent
   */
  os: (userAgent) => {
    if (/Android/i.test(userAgent)) return 'android'
    if (/iPhone|iPad|iPod/i.test(userAgent)) return 'ios'
    if (/Windows/i.test(userAgent)) return 'windows'
    if (/Macintosh/i.test(userAgent)) return 'macos'
    if (/Linux/i.test(userAgent)) return 'linux'
    return 'unknown'
  },
  /**
   * @param {string} userAgent
   */
  browser: (userAgent) => {
    if (/Edg/i.test(userAgent)) return 'edge'
    if (/Chrome/i.test(userAgent)) return 'chrome'
    if (/Safari/i.test(userAgent)) return 'safari'
    if (/Firefox/i.test(userAgent)) return 'firefox'
    if (/Opera/i.test(userAgent)) return 'opera'
    if (/MSIE|Trident/i.test(userAgent)) return 'ie'
    return 'unknown'
  },
}

/**
 * @param {string} path
 * @param {import('./appwrite').DynamicLinkPathDocument} pathDocument
 * @returns {boolean}
 */
function matchPath(path, pathDocument) {
  switch (pathDocument.pathType) {
    case PathType.EXACT:
      return pathDocument.pathValue === path
    case PathType.PREFIX:
      return path.startsWith(pathDocument.pathValue)
    case PathType.SUFFIX:
      return path.endsWith(pathDocument.pathValue)
    case PathType.REGEX:
      return new RegExp(pathDocument.pathValue).test(path)
    default:
      return false
  }
}

/**
 * @param {import('./appwrite').DynamicLinkRuleDocument} rule
 * @returns {boolean}
 */
function matchRule(rule, req) {
  const userAgent = req.headers['user-agent'] ?? ''
  switch (rule.ruleType) {
    case RuleType.PLATFORM:
      return detector.platform(userAgent) === rule.ruleValue
    case RuleType.OS:
      return detector.os(userAgent) === rule.ruleValue
    case RuleType.BROWSER:
      return detector.browser(userAgent) === rule.ruleValue
    default:
      return false
  }
}

/**
 * @typedef {Object} DynamicLinkService
 * @property {(paths: import('./appwrite').DynamicLinkPathDocument[]) => import('./appwrite').DynamicLinkPathDocument | undefined} findPath
 * @property {(path: import('./appwrite').DynamicLinkPathDocument) => import('./appwrite').DynamicLinkRuleDocument | undefined} findRule
 */

/**
 * @param {import('appwrite-function-utils').HttpRequest} req
 * @returns {DynamicLinkService}
 */
export default function DynamicLinkService(req) {
  return {
    /**
     * @param {import('./appwrite').DynamicLinkPathDocument[]} paths
     * @returns {import('./appwrite').DynamicLinkPathDocument | undefined}
     */
    findPath: function (paths) {
      return paths.find((path) => path.enabled && matchPath(req.path, path))
    },
    /**
     * @param {import('./appwrite').DynamicLinkPathDocument} path
     * @returns {import('./appwrite').DynamicLinkRuleDocument | undefined}
     */
    findRule: function (path) {
      return path.rules.find((rule) => rule.enabled && matchRule(rule, req))
    },
  }
}
