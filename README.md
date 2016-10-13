# harviewer-react

harviewer-react is [HAR Viewer](https://github.com/janodvarko/harviewer)
implemented in [React](https://facebook.github.io/react/)!

Use it at [https://gitgrimbo.github.io/harviewer-react/](https://gitgrimbo.github.io/harviewer-react/).

# Develop

I use [Visual Studio Code](https://code.visualstudio.com).

# Running the code

harviewer-react uses [webpack](https://webpack.github.io/).

## Setup

Using [npm](https://www.npmjs.com/), pull in the required packages with:

    npm install

Until harviewer-react is stable, it will share some code from the original HAR
Viewer.  We need to set this up in the `webpack.config.js` file:

Change the following line:

````js
// Path to existing HAR Viewer. We can reuse some code from the following modules:
//   "core", "nls", "preview", "tabs", "syntax-highlighter"
// E.g.
const pathToLegacyHarViewerScripts = path.join(__dirname, "../harviewer/webapp/scripts");
// or
const pathToLegacyHarViewerScripts = "/full/path/to/harviewer/webapp/scripts";
````

so that the path points to the `webapp/scripts` folder of your local HAR
Viewer source code.

Clone [the repo](https://github.com/janodvarko/harviewer) to get the source
code.

## Start

To start the [webpack-dev-server](https://webpack.github.io/docs/webpack-dev-server.html), use:

    npm start

The Demo Shell will now be available at:

- http://localhost:8080/webapp/demos/demo-shell.html

And the main app will be available at:

- http://localhost:8080/webapp/

# Deploy

    npm run deploy-gh-pages

This will build the production version of harviewer-react and deploy it as a
[GitHub pages](https://pages.github.com/) site.
