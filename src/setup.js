import AppwriteService from './services/appwrite.js'
import environment from './services/environment.js'

const appwrite = AppwriteService(environment)

async function setup() {
  console.log('Executing setup script...')

  if (await appwrite.doesDynamicLinksDatabaseExist()) {
    console.log(`Database exists.`)
    return
  }

  await appwrite.setupDynamicLinksDatabase()
  console.log(`Database created.`)
}

setup()
