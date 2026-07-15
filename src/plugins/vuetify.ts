import 'vuetify/styles'

import { createVuetify, type ThemeDefinition } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

const liveArtDark: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#111318',
    surface: '#191c23',
    'surface-bright': '#252932',
    primary: '#8ba4ff',
    secondary: '#a9b5d1',
    error: '#ffb4ab',
    info: '#a8c7fa',
    success: '#89d5a3',
    warning: '#f2c66d',
  },
}

export const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme: 'liveArtDark',
    themes: { liveArtDark },
  },
})
