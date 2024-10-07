import helpers, { type Helpers } from './helpers'
import setup from './helpers/setup'

type TestFunction = (helpers: Helpers) => Promise<void>

type CreatePuppeteerTest = (testFunction: TestFunction) => () => Promise<void>

/** Creates a Puppeteer test. */
const createPuppeteerTest: CreatePuppeteerTest = testFunction => async () => {
  const page = await setup()
  const testHelpers = helpers(page)
  await testFunction(testHelpers)
}

export default createPuppeteerTest
