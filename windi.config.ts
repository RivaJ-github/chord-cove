import { defineConfig } from 'windicss/helpers'
import formsPlugin from 'windicss/plugin/forms'

export default defineConfig({
  theme: {
    extend: {
      boxShadow: {
        "t-lg": '0 -10px 15px -3px rgba(0, 0, 0, 0.1), 0 -4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      backgroundColor: {
        theme: '#f3f1f4'
      },
      textColor: {
        primary: '#36ad6a',
        secondary: '#ffed4a',
        danger: '#e3342f',
        white: '#fff',
      },
    },
  },
  plugins: [formsPlugin],
});
