import { Page } from 'puppeteer'
// helpers
// import $ from './$'
// import click from './click'
// import clickBullet from './clickBullet'
import clickThought from './clickThought'

// import down from './down'
// import dragAndDrop from './dragAndDrop'
// import dragAndDropThought from './dragAndDropThought'
// import getComputedColor from './getComputedColor'
// import getEditable from './getEditable'
// import getEditingText from './getEditingText'
// import getPage from './getPage'
// import getSelection from './getSelection'
// import newThought from './newThought'
// import openModal from './openModal'
// import paste from './paste'
// import press from './press'
// import refresh from './refresh'
// import remove from './remove'
// import removeHUD from './removeHUD'
// import screenshot from './screenshot'
// import scroll from './scroll'
// import simulateDragAndDrop from './simulateDragAndDrop'
// import type from './type'
// import waitForContextHasChildWithValue from './waitForContextHasChildWithValue'
// import waitForEditable from './waitForEditable'
// import waitForHiddenEditable from './waitForHiddenEditable'
// import waitForState from './waitForState'
// import waitForThoughtExistInDb from './waitForThoughtExistInDb'
// import waitUntil from './waitUntil'

const helperCreators = {
  clickThought,
  // TODO: convert and add the rest
}

type HelperCreators = typeof helperCreators

export type Helpers = {
  [K in keyof HelperCreators]: ReturnType<HelperCreators[K]>
}

/** Creates helpers for the given page. */
const createHelpers = (page: Page): Helpers => {
  const helperKeys = Object.keys(helperCreators) as (keyof HelperCreators)[]
  const helpers = {} as Helpers
  helperKeys.forEach(key => {
    helpers[key] = helperCreators[key](page)
  })

  return helpers
}

export default createHelpers
