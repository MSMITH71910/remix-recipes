import { describe, it, expect, vi } from 'vitest'
import { classNames, isRunningOnServer } from './misc'

describe('misc utilities', () => {
  describe('classNames', () => {
    it('should join multiple class names', () => {
      const result = classNames('class1', 'class2', 'class3')
      expect(result).toBe(' class1 class2 class3')
    })

    it('should handle undefined values', () => {
      const result = classNames('class1', undefined, 'class3')
      expect(result).toBe(' class1 class3')
    })

    it('should return empty string for no arguments', () => {
      const result = classNames()
      expect(result).toBe('')
    })

    it('should return empty string for all undefined arguments', () => {
      const result = classNames(undefined, undefined)
      expect(result).toBe('')
    })

    it('should handle single class name', () => {
      const result = classNames('single-class')
      expect(result).toBe(' single-class')
    })
  })

  describe('isRunningOnServer', () => {
    it('should return true when window is undefined', async () => {
      // In vitest with jsdom, window is defined, so we need to mock it
      const originalWindow = global.window
      // @ts-expect-error - we're intentionally setting window to undefined for testing
      delete global.window
      
      // Re-import to get fresh evaluation
      vi.resetModules()
      const { isRunningOnServer: serverCheck } = await import('./misc')
      
      expect(serverCheck()).toBe(true)
      
      // Restore window
      global.window = originalWindow
    })

    it('should return false when window is defined', () => {
      expect(isRunningOnServer()).toBe(false)
    })
  })
})