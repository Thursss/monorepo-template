import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Button from './index'

describe('increment', () => {
  it('renders button with correct label', () => {
    render(<Button label="Click me" />)
    const buttonElement = screen.getByText(/click me/i)
    screen.debug(buttonElement)
    expect(buttonElement).toBeInstanceOf(Node)
  })
})
