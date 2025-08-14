import type { ReactElement } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'

// Custom render function that includes React Router context
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[]
  route?: string
}

export function renderWithRouter(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  const { initialEntries = ['/'], route = '/', ...renderOptions } = options

  // Create a memory router for testing
  const router = createMemoryRouter(
    [
      {
        path: route,
        element: ui,
      },
    ],
    {
      initialEntries,
    }
  )

  function Wrapper() {
    return <RouterProvider router={router} />
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Mock user data for testing
export const mockUser = {
  id: '1',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
}

// Mock recipe data for testing
export const mockRecipe = {
  id: '1',
  name: 'Test Recipe',
  totalTime: '30 minutes',
  imageUrl: 'https://example.com/image.jpg',
  instructions: 'Test instructions',
  ingredients: [
    { id: '1', name: 'Test ingredient', amount: '1 cup' }
  ]
}

// Helper to create mock form data
export function createMockFormData(data: Record<string, string>) {
  const formData = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value)
  })
  return formData
}

// Re-export everything from testing-library
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'