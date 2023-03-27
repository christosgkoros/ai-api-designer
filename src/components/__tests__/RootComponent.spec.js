import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import RootComponent from '../RootComponent.vue'

describe('RootComponent', () => {
  it('renders properly', () => {
    const wrapper = mount(RootComponent, { props: { msg: 'Hello Vitest' } })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})
