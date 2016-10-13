module.exports = {
    extends: [
        "google",
        "plugin:react/recommended"
    ],
    // "extends": "eslint:recommended",
    plugins: [
        "react"
    ],
    installedESLint: true,
    rules: {
        "indent": ["error", 2],
        "linebreak-style": "off",

        "max-len": ["warn", {
            code: 100,
            tabWidth: 2,
            ignoreUrls: true,
            // JSX expression: Line starting with spaces then "<"
            // JSX assignment: Line containing " = <\w"
            // JSX return: Line starting with "return <\w"
            ignorePattern: "^ *<| = <\\w|^ *return <\\w"
        }],

        // E.g. to allow
        // <div ref={ref => this.holder = ref}>
        "no-return-assign": "warn",

        "object-curly-spacing": ["error", "always"]
    },
    env: {
        browser: true,
        jquery: true
    },
    parserOptions: {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true,
            "classes": true,
            "defaultParams": true,
            "experimentalObjectRestSpread": true
        }
    }
};
