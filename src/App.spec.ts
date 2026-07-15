import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { describe, expect, it } from 'vitest'

import App from './App.vue'
import { vuetify } from './plugins/vuetify'

describe('App', () => {
  it('renders the editor shell', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia(), vuetify],
      },
    })

    expect(wrapper.get('h1').text()).toBe('Image editor')
    expect(wrapper.text()).toContain('LiveArt')

    wrapper.unmount()
  })
})
