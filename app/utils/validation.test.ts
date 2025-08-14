import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import { validateForm } from './validation'

describe('validation utilities', () => {
  describe('validateForm', () => {
    const testSchema = z.object({
      name: z.string().min(1, 'Name is required'),
      email: z.string().email('Invalid email'),
      age: z.coerce.number().min(18, 'Must be 18 or older'),
      tags: z.array(z.string()).optional()
    })

    it('should call successFn with valid data', () => {
      const formData = new FormData()
      formData.append('name', 'John Doe')
      formData.append('email', 'john@example.com')
      formData.append('age', '25')

      const result = validateForm(
        formData,
        testSchema,
        (data) => ({ success: true, data }),
        (errors) => ({ success: false, errors })
      )

      expect(result).toEqual({
        success: true,
        data: {
          name: 'John Doe',
          email: 'john@example.com',
          age: 25,
        }
      })
    })

    it('should call errorFn with validation errors', () => {
      const formData = new FormData()
      formData.append('name', '')
      formData.append('email', 'invalid-email')
      formData.append('age', '15')

      const result = validateForm(
        formData,
        testSchema,
        (data) => ({ success: true, data }),
        (errors) => ({ success: false, errors })
      )

      expect(result).toEqual({
        success: false,
        errors: {
          name: 'Name is required',
          email: 'Invalid email',
          age: 'Must be 18 or older'
        }
      })
    })

    it('should handle array fields correctly', () => {
      const formData = new FormData()
      formData.append('name', 'John Doe')
      formData.append('email', 'john@example.com')
      formData.append('age', '25')
      formData.append('tags[]', 'javascript')
      formData.append('tags[]', 'react')
      formData.append('tags[]', 'testing')

      const result = validateForm(
        formData,
        testSchema,
        (data) => ({ success: true, data }),
        (errors) => ({ success: false, errors })
      )

      expect(result).toEqual({
        success: true,
        data: {
          name: 'John Doe',
          email: 'john@example.com',
          age: 25,
          tags: ['javascript', 'react', 'testing']
        }
      })
    })

    it('should handle empty form data', () => {
      const formData = new FormData()

      const result = validateForm(
        formData,
        testSchema,
        (data) => ({ success: true, data }),
        (errors) => ({ success: false, errors })
      )

      expect(result.success).toBe(false)
      if ('errors' in result) {
        expect(result.errors).toHaveProperty('name')
        expect(result.errors).toHaveProperty('email')
      }
    })

    it('should handle nested validation errors', () => {
      const nestedSchema = z.object({
        user: z.object({
          profile: z.object({
            name: z.string().min(1, 'Profile name is required')
          })
        })
      })

      const formData = new FormData()
      // This will fail because user.profile.name is missing

      const result = validateForm(
        formData,
        nestedSchema,
        (data) => ({ success: true, data }),
        (errors) => ({ success: false, errors })
      )

      expect(result.success).toBe(false)
      if ('errors' in result) {
        expect(Object.keys(result.errors).length).toBeGreaterThan(0)
      }
    })
  })
})