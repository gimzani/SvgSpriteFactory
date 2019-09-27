
# Webpack SVG Sprite Guide

The idea here is to put **RAW SVG icons** in the icons folder and then build the necessary assets.




Follow the "Getting Started" guide below, then go to the LAST section.



# Webpack Zero Config

This is a guide on how to set up a webpack environment that can handle the bundling of scripts, html files and css.  This guide is derived from the following Tutorial:

* [Webpack 4 Zero Config Tutorial](https://www.valentinog.com/blog/webpack/)




# Getting Started

## Setup for Scripting

1: Create a package.json file:

```
npm init -y
```

2: Install Webpack and the Webpack CLI:

```
npm i webpack webpack-cli --save-dev
```

3: Adjust your **Scripts** section in **package.json**:

```
"scripts": {
  "build": "webpack"
}
```

4: Create a source-folder called **src** and add the **index.js** file:

``` javascript
console.log("I'm a silly entry point");
```


5: Build:

```
npm run build
```

The build assets will show up in a folder called **/dist**.


## Setup for Development and Production builds

To set up environments for scripting change the **scripts** section to:

``` javascript
"scripts": {
  "dev": "webpack --mode development",
  "build": "webpack --mode production"
}
```

If you want to output to different locations, you can change **scripts** to:

``` javascript
"scripts": {
  "dev": "webpack --mode development ./foo/src/js/index.js --output ./foo/main.js",
  "build": "webpack --mode production ./foo/src/js/index.js --output ./foo/main.js"
}
```

# Using Loaders

## Babel

For transpilation into lower versions of JS, install Babel:

```
npm i @babel/core babel-loader @babel/preset-env --save-dev
```

### babelrc file
You must have a Babel config file called **.babelrc**.  Create that file in the same location as package.json:

``` javascript
{
    "presets": [
        "@babel/preset-env"
    ]
}
```

Once you have done this, you must have a **webpack.config.json** file:

``` javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};
```

To test to see if the configuration is working, change your **index.js** to:

``` javascript
const arr = [1, 2, 3];
const iAmJavascriptES6 = () => console.log(...arr);
window.iAmJavascriptES6 = iAmJavascriptES6;
```

... then build
```
npm run build
```

You should now have a transpiled **main.js** file.

---


## HTML files

To work with HTML files and HTML partials, you must start by installing an **html-loader**:
```
npm i html-webpack-plugin html-loader --save-dev
```

Update your **webpack.config.js** to:

``` javascript
const HtmlWebPackPlugin = require("html-webpack-plugin");
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    })
  ]
```

Create a test html file:

``` html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>webpack 4 quickstart</title>
</head>
<body>
    <div id="app">
    </div>
</body>
</html>
```

... then build
```
npm run build
```

You should now have an **index.html** file in your **/dist** folder.


To Use HTML Partials, use the **interpolate** option:

``` javascript
{
  test: /\.html$/,
  use: [
    {
      loader: "html-loader",
      options: { minimize: true, interpolate: true }
    }
  ]
}
```
---


## CSS files

To work with CSS you must install the **mini-css-extract-plugin**

```
npm i mini-css-extract-plugin css-loader --save-dev
```

Create a **main.css** file:

``` css
body {
    line-height: 2;
}
```

Update your **webpack.config.js** to:

``` javascript
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]
};
```

Import the file in your **index.js** file:

``` javascript
import style from "./main.css";
```
... then build
```
npm run build
```

You should now have an **main.css** file in your **/dist** folder.

---


## SASS / SCSS files

In order to use SCSS in your app, you must include node-sass, style-loader and sass-loader.

```
npm i node-sass sass-loader style-loader --save-dev
```


Update your **webpack.config.js** to:

``` javascript
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]
};
```

The **use array** must have the loaders in the right order.  The **MiniCssExtractPlugin** will compile these into an external file.

..so...  ...run build
```
npm run build
```

You should now have an **main.css** file with your compiled **scss** content in your **/dist** folder.

---

# Webpack Development Server

In order to facilitate rapid development, consider installing the **Webpack Development Server**.

```
npm i webpack-dev-server --save-dev
```

Change your **scripts** section in **package.json** to:
``` javascript
"scripts": {
  "start": "webpack-dev-server --mode development --open",
  "build": "webpack --mode production"
}
```

Now you can start the dev server by typing:
```
npm run start
```

If you want to set your saves to trigger a rebuild, then you can simply set the "watch" mode:

``` javascript
module.exports = {
  //...
  watch: true
};
```


# SVG Spriting

Install the **svg-sprite-loader**

```
npm install svg-sprite-loader --save-dev
```

Create a **webpack.config.js** file:

``` javascript
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

module.exports = {
  rules: [{
    test: /src\/icons\/.*\.svg$/, // your icons directory
    loader: 'svg-sprite-loader',
    options: {
      extract: true,
      spriteFilename: './dist/icons.svg', // this is the destination of your sprite sheet
    }
  }],
  plugins: [
    new SpriteLoaderPlugin({
      plainSprite: true
    })
  ]
}
```

Using Gulp to add classes:

```
npm install --save-dev webpack-stream
```


``` javascript
const gulp = require('gulp');
const webpack = require('webpack-stream');
gulp.task('default', function() {
  return gulp.src('src/entry.js')
    .pipe(webpack({
      // Any configuration options...
    }))
    .pipe(gulp.dest('dist/'));
});
```

Final config should look like:

``` javascript
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  module: {
    rules: [
    {
      test: /\.svg$/,
      loader: 'svg-sprite-loader',
      options: {
        extract: true,
        spriteFilename: './icons.svg',
        runtimeCompat: true
      }
    },
    {
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, "css-loader"]
    },
    {
      test: /\.s[ac]ss$/i,
      use: [
        'style-loader',
        MiniCssExtractPlugin.loader,
        'css-loader',
        'sass-loader',
      ],
    }
   ]
  },
  plugins: [
    new SpriteLoaderPlugin({
      plainSprite: true
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]
};
```