module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', ['backend', 'private-frontend', 'public-frontend', 'global']]
  }
};
