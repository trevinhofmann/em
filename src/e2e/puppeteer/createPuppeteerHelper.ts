// The goal of this function is to allow us to do this:
import { Page } from 'puppeteer'

/** Creates a puppeteer helper function. */
const createPuppeteerHelper = <TArgs extends any[], TReturn>(
  helper: (page: Page, ...args: TArgs) => Promise<TReturn>,
): ((page: Page) => (...args: TArgs) => Promise<TReturn>) => {
  return (page: Page) => {
    return async (...args: TArgs): Promise<TReturn> => {
      return await helper(page, ...args)
    }
  }
}

export default createPuppeteerHelper
