module.exports = {
  "parser": "babel-eslint",
  "extends": [
    "google",
    "plugin:react/recommended",
  ],
  "settings": {
    "react": {
      "version": "16.6.0",
    },
  },
  "plugins": [
    "babel",
    "react",
  ],
  "rules": {
    "indent": ["error", 2],
    "linebreak-style": "off",

    "max-len": ["warn", {
      "code": 100,
      "tabWidth": 2,
      "ignoreUrls": true,
      // JSX expression: Line starting with spaces then "<"
      // JSX assignment: Line containing " = <\w"
      // JSX return: Line starting with "return <\w"
      "ignorePattern": "^ *<| = <\\w|^ *return <\\w",
    }],

    // E.g. to allow
    // <div ref={ref => this.holder = ref}>
    "no-return-assign": "warn",

    "object-curly-spacing": ["error", "always"],

    "quotes": ["error", "double", { "allowTemplateLiterals": true }],

    "require-jsdoc": "off",

    // Use "babel/no-invalid-this" because we use ES7 class properties
    "no-invalid-this": "off",
    "babel/no-invalid-this": "error",
  },
  "env": {
    "browser": true,
    "jquery": true,
  },
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true,
      "classes": true,
      "defaultParams": true,
      "experimentalObjectRestSpread": true
    },
  },
};
