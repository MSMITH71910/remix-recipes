import { describe, it, expect, vi } from 'vitest'
import { Prisma } from '@prisma/client'
import { handleDelete } from './utils'

describe('model utilities', () => {
  describe('handleDelete', () => {
    it('should return the result of successful delete operation', async () => {
      const mockDeleteFn = vi.fn().mockResolvedValue({ id: '1', deleted: true })
      
      const result = await handleDelete(mockDeleteFn)
      
      expect(result).toEqual({ id: '1', deleted: true })
      expect(mockDeleteFn).toHaveBeenCalledOnce()
    })

    it('should handle P2025 (record not found) error by returning error message', async () => {
      const errorMessage = 'An operation failed because it depends on one or more records that were required but not found.'
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        errorMessage,
        { code: 'P2025', clientVersion: '4.0.0' }
      )
      
      const mockDeleteFn = vi.fn().mockRejectedValue(prismaError)
      
      const result = await handleDelete(mockDeleteFn)
      
      expect(result).toBe(errorMessage)
      expect(mockDeleteFn).toHaveBeenCalledOnce()
    })

    it('should re-throw non-P2025 Prisma errors', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Some other error',
        { code: 'P2002', clientVersion: '4.0.0' }
      )
      
      const mockDeleteFn = vi.fn().mockRejectedValue(prismaError)
      
      await expect(handleDelete(mockDeleteFn)).rejects.toThrow(prismaError)
      expect(mockDeleteFn).toHaveBeenCalledOnce()
    })

    it('should re-throw unknown errors', async () => {
      const unknownError = new Error('Unknown error')
      const mockDeleteFn = vi.fn().mockRejectedValue(unknownError)
      
      await expect(handleDelete(mockDeleteFn)).rejects.toThrow(unknownError)
      expect(mockDeleteFn).toHaveBeenCalledOnce()
    })

    it('should handle non-Prisma errors', async () => {
      const genericError = new Error('Generic error')
      const mockDeleteFn = vi.fn().mockRejectedValue(genericError)
      
      await expect(handleDelete(mockDeleteFn)).rejects.toThrow(genericError)
      expect(mockDeleteFn).toHaveBeenCalledOnce()
    })
  })
})