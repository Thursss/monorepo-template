import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import HelloWorld from './HelloWorld.vue'

describe('increment', () => {
  // The `render` method renders the component into the document.
  // It also binds to `screen` all the available queries to interact with
  // the component.

  it('renders the component', () => {
    const { getByText } = render(HelloWorld, {
      props: {
        msg: 'Hello World',
      },
    })
    expect(getByText('Hello World')).toBeTruthy()
  })

  it('increments value on click', async () => {
    const { getByText, queryByText } = render(HelloWorld, {
      props: {
        msg: 'Hello World',
      },
    })
    // queryByText returns the first matching node for the provided text
    // or returns null.
    expect(queryByText('count is 0')).toBeTruthy()

    // getByText returns the first matching node for the provided text
    // or throws an error.
    const button = getByText('increment')

    // Click a couple of times.
    await fireEvent.click(button)
    await fireEvent.click(button)

    expect(queryByText('count is 2')).toBeTruthy()
  })
})
