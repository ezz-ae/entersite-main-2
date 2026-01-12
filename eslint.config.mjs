import next from 'eslint-config-next';

const config = Array.isArray(next) ? next : [next];

export default [
  ...config,
  {
    ignores: ['node_modules/**', '.next/**', 'public/**', 'dist/**'],
  },
  {
    rules: {
      'react/no-unescaped-entities': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/use-memo': 'off',
    },
  },
];
