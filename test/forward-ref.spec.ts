import { forwardRef, ForwardRef, InjectionToken } from '@tanbo/di'

describe('forwardRef', () => {
  test('返回正确的实例', () => {
    expect(forwardRef(() => {
      return {}
    }) instanceof ForwardRef).toBeTruthy()
  })

  test('返回正确的引用', () => {
    const token = new InjectionToken('')

    expect(forwardRef(() => token).getRef()).toBe(token)
  })
})
