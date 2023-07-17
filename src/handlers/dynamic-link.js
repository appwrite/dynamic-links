import AppwriteService from '../services/appwrite.js'
import environment from '../services/environment.js'
import views from '../services/views.js'
import DynamicLinkService from '../services/dynamic-link.js'
import { parseUrl } from '../utils.js'

const appwrite = AppwriteService(environment)

/** @type {import('appwrite-function-utils').Function} */
export default async ({ req, res, error }) => {
  const dynamicLink = DynamicLinkService(req)

  const paths = await appwrite.getPaths()
  const matchedPath = dynamicLink.findPath(paths)
  if (!matchedPath) {
    error(`Path not found for path: ${req.url}`)
    return res.send('Not found', 404)
  }

  const rule = dynamicLink.findRule(matchedPath)
  if (!rule) {
    error(`Rule not found for path: ${matchedPath.$id}`)
    return res.redirect(matchedPath.fallbackTarget, 302)
  }

  const target = parseUrl(rule.target)
  if (!target) {
    error(`Invalid target for rule: ${rule.$id}`)
    return res.redirect(matchedPath.fallbackTarget, 302)
  }

  if (target.protocol === 'intent://') {
    return res.send(views.deepLink(target.toString()), 200, {
      'Content-Type': 'text/html; charset=utf-8',
    })
  }

  return res.redirect(target.toString(), 302)
}
