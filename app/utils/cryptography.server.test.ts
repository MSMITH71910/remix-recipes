import { describe, it, expect } from 'vitest'
import { hash } from './cryptography.server'

describe('cryptography utilities', () => {
  describe('hash', () => {
    it('should hash a string value', () => {
      const input = 'test-string'
      const result = hash(input)
      
      expect(result).toBe('ffe65f1d98fafedea3514adc956c8ada5980c6c5d2552fd61f48401aefd5c00e')
      expect(result).toHaveLength(64) // SHA256 produces 64 character hex string
    })

    it('should produce different hashes for different inputs', () => {
      const input1 = 'test-string-1'
      const input2 = 'test-string-2'
      
      const hash1 = hash(input1)
      const hash2 = hash(input2)
      
      expect(hash1).not.toBe(hash2)
    })

    it('should produce consistent hashes for the same input', () => {
      const input = 'consistent-input'
      
      const hash1 = hash(input)
      const hash2 = hash(input)
      
      expect(hash1).toBe(hash2)
    })

    it('should handle empty string', () => {
      const result = hash('')
      
      expect(result).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')
      expect(result).toHaveLength(64)
    })

    it('should handle unicode characters', () => {
      const input = '你好世界🌍'
      const result = hash(input)
      
      expect(result).toHaveLength(64)
      expect(typeof result).toBe('string')
    })
  })
})