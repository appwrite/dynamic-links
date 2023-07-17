import { HttpMethod, router } from 'appwrite-function-utils'
import dynamicLinkHandler from './handlers/dynamic-link.js'

export default router({
  routes: [
    {
      path: '/admin',
      methods: [HttpMethod.GET],
      handler: async ({ res }) => {
        return res.send('Hello World')
      },
    },
    {
      path: '/(.*)',
      methods: [HttpMethod.GET],
      handler: dynamicLinkHandler,
    },
  ],
})
