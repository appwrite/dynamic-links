import { readFileSync } from 'node:fs'
import path from 'node:path'

function interpolate(template, data) {
  return template.replaceAll(/{{\s*([^}]+)\s*}}/g, (_, key) => data[key.trim()])
}

const views = {
  /**
   * @param {string} link
   * @returns {string} HTML response
   */
  deepLink: (link) => {
    const template = readFileSync(
      path.join(__dirname, 'deep-link.html')
    ).toString()

    return interpolate(template, {
      LINK: link,
    })
  },
}

export default views
