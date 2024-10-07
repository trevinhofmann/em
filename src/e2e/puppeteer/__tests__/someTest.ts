import createPuppeteerTest from '../createPuppeteerTest'

it(
  'SomeTest',
  createPuppeteerTest(async helpers => {
    await helpers.clickThought('someThought')
    await helpers.clickThought('someOtherThought')
    const image = await helpers.screenshot()
    expect(image).toMatchImageSnapshot()
  }),
)
