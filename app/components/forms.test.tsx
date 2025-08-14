import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { Button, PrimaryButton, DeleteButton, ErrorMessage, PrimaryInput } from './forms'

describe('Form Components', () => {
  describe('Button', () => {
    it('should render button with children', () => {
      render(<Button>Click me</Button>)
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      render(<Button className="custom-class">Test</Button>)
      const button = screen.getByRole('button', { name: 'Test' })
      expect(button).toHaveClass('custom-class')
    })

    it('should handle onClick events', async () => {
      const user = userEvent.setup()
      let clicked = false
      const handleClick = () => { clicked = true }
      
      render(<Button onClick={handleClick}>Click me</Button>)
      
      await user.click(screen.getByRole('button', { name: 'Click me' }))
      expect(clicked).toBe(true)
    })
  })

  describe('PrimaryButton', () => {
    it('should render primary button with correct styling', () => {
      render(<PrimaryButton>Primary</PrimaryButton>)
      const button = screen.getByRole('button', { name: 'Primary' })
      expect(button).toHaveClass('text-white', 'bg-primary', 'hover:bg-primary-light')
    })

    it('should apply loading styles when isLoading is true', () => {
      render(<PrimaryButton isLoading>Loading</PrimaryButton>)
      const button = screen.getByRole('button', { name: 'Loading' })
      expect(button).toHaveClass('bg-primary-light')
    })
  })

  describe('DeleteButton', () => {
    it('should render delete button with correct styling', () => {
      render(<DeleteButton>Delete</DeleteButton>)
      const button = screen.getByRole('button', { name: 'Delete' })
      expect(button).toHaveClass('border-2', 'border-red-600', 'text-red-600')
    })

    it('should apply loading styles when isLoading is true', () => {
      render(<DeleteButton isLoading>Delete</DeleteButton>)
      const button = screen.getByRole('button', { name: 'Delete' })
      expect(button).toHaveClass('border-red-400', 'text-red-400')
    })
  })

  describe('ErrorMessage', () => {
    it('should render error message when children are provided', () => {
      render(<ErrorMessage>This is an error</ErrorMessage>)
      expect(screen.getByText('This is an error')).toBeInTheDocument()
    })

    it('should not render when no children are provided', () => {
      render(<ErrorMessage />)
      expect(screen.queryByText('This is an error')).not.toBeInTheDocument()
    })

    it('should apply correct styling', () => {
      render(<ErrorMessage>Error text</ErrorMessage>)
      const errorElement = screen.getByText('Error text')
      expect(errorElement).toHaveClass('text-red-600', 'text-xs')
    })

    it('should apply custom className', () => {
      render(<ErrorMessage className="custom-error">Error</ErrorMessage>)
      const errorElement = screen.getByText('Error')
      expect(errorElement).toHaveClass('custom-error')
    })
  })

  describe('PrimaryInput', () => {
    it('should render input with correct styling', () => {
      render(<PrimaryInput placeholder="Enter text" />)
      const input = screen.getByPlaceholderText('Enter text')
      expect(input).toHaveClass('w-full', 'outline-none', 'border-2', 'border-gray-200')
    })

    it('should accept user input', async () => {
      const user = userEvent.setup()
      render(<PrimaryInput placeholder="Type here" />)
      const input = screen.getByPlaceholderText('Type here')
      
      await user.type(input, 'Hello world')
      expect(input).toHaveValue('Hello world')
    })

    it('should apply custom className', () => {
      render(<PrimaryInput className="custom-input" placeholder="Test" />)
      const input = screen.getByPlaceholderText('Test')
      expect(input).toHaveClass('custom-input')
    })
  })
})