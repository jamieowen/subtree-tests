module.exports = {
  extends: [
    'eslint:recommended',
    'react-app',
    'prettier',
    '.eslintrc-auto-import.json',
    './.eslintrc-auto-import.json',
  ],
  plugins: ['eslint-plugin-react-compiler'],
  rules: {
    'react-compiler/react-compiler': 'error',
  },
};
