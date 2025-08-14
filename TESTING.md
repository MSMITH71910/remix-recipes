# Testing Setup for Remix Recipes

This project is fully configured with a comprehensive testing setup using Vitest, Testing Library, and related tools.

## Test Framework Stack

- **Vitest** - Fast unit test runner built on Vite
- **@testing-library/react** - Simple and complete testing utilities for React components
- **@testing-library/jest-dom** - Custom jest matchers for DOM elements
- **@testing-library/user-event** - Fire events the same way the user does
- **jsdom** - DOM environment for testing

## Available Scripts

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI interface
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Test File Structure

Tests are located alongside their source files with the `.test.ts` or `.test.tsx` extension:

```
app/
├── components/
│   ├── forms.tsx
│   └── forms.test.tsx          # Component tests
├── utils/
│   ├── misc.ts
│   ├── misc.test.ts            # Utility function tests
│   ├── validation.ts
│   ├── validation.test.ts      # Server-side validation tests
│   ├── cryptography.server.ts
│   └── cryptography.server.test.ts
└── models/
    ├── utils.ts
    └── utils.test.ts           # Database utility tests
```

## Test Utilities

### Custom Render Function

Located in `test/test-utils.tsx`, provides a `renderWithRouter` function for testing components that use React Router:

```tsx
import { renderWithRouter } from '../test/test-utils'

test('component with router', () => {
  renderWithRouter(<MyComponent />, { 
    initialEntries: ['/test-route'],
    route: '/test-route'
  })
})
```

### Mock Data

The test utilities also export mock data for common entities:

```tsx
import { mockUser, mockRecipe, createMockFormData } from '../test/test-utils'
```

## Writing Tests

### Component Tests

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { MyComponent } from './MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('should handle user interactions', async () => {
    const user = userEvent.setup()
    render(<MyComponent />)
    
    await user.click(screen.getByRole('button'))
    expect(screen.getByText('Clicked!')).toBeInTheDocument()
  })
})
```

### Utility Function Tests

```tsx
import { describe, it, expect } from 'vitest'
import { myUtility } from './myUtility'

describe('myUtility', () => {
  it('should return expected result', () => {
    expect(myUtility('input')).toBe('expected-output')
  })
})
```

### Async/Server Tests

```tsx
import { describe, it, expect, vi } from 'vitest'
import { myAsyncFunction } from './myAsyncFunction'

describe('myAsyncFunction', () => {
  it('should handle async operations', async () => {
    const mockFn = vi.fn().mockResolvedValue('result')
    const result = await myAsyncFunction(mockFn)
    
    expect(result).toBe('result')
    expect(mockFn).toHaveBeenCalledOnce()
  })
})
```

## Configuration Files

- `vitest.config.ts` - Main Vitest configuration
- `test/setup.ts` - Global test setup and imports
- `test/test-utils.tsx` - Custom testing utilities

## Coverage Reports

Coverage reports are generated in the `coverage/` directory when running `npm run test:coverage`. The project currently has:

- **36 passing tests** across 5 test files
- Coverage reporting for statements, branches, functions, and lines
- HTML coverage reports available at `coverage/index.html`

## Best Practices

1. **Test file naming**: Use `.test.ts` or `.test.tsx` extensions
2. **Test organization**: Group related tests with `describe` blocks
3. **User-centric testing**: Test behavior, not implementation details
4. **Mock external dependencies**: Use `vi.fn()` and `vi.mock()` for mocking
5. **Async testing**: Always use `await` with async operations in tests
6. **Cleanup**: Tests automatically cleanup after each test case

## Current Test Coverage

The test suite covers:
- ✅ Form components (Button, PrimaryButton, DeleteButton, ErrorMessage, PrimaryInput)
- ✅ Utility functions (classNames, isRunningOnServer, debounced functions)
- ✅ Validation utilities (form validation with Zod schemas)
- ✅ Cryptography utilities (hash function)
- ✅ Database utilities (error handling for deletions)

## Next Steps

To expand test coverage, consider adding tests for:
- Route components and loaders
- Database models and queries  
- Authentication utilities
- Email services
- Recipe and pantry management features