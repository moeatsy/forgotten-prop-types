# forgotten-prop-types
Simple module to runtime log forgotten prop-types declarations

[![forgotten-prop-types on NPM](https://img.shields.io/npm/v/forgotten-prop-types)](https://www.npmjs.com/package/forgotten-prop-types)

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [Example](#example)
4. [Options](#options)
5. [Known Issues](#known-issues)
5. [License](#license)

## Installation

```shell
npm install --save forgotten-prop-types
```

## Usage
After installation, import it and call in root of your application,
its take two arguments, React instance and optional user options.

```js
// Root of your application, usually index.js
import React from 'react';
import forgottenPropTypes from 'forgotten-prop-types';

forgottenPropTypes(React, {
    // custom options
});
```

## Example
![forgotten-prop-types Demo](https://raw.githubusercontent.com/moeatsy/forgotten-prop-types/master/readme-example-image.jpg)

## Options

```js
forgottenPropTypes(React, {
    propsBlackList: ['dispatch', 'onSelectNextTrack', 'onSelectPrevTrack'],
    componentsBlackList: ['PageHeader', 'PageFooter'],
    displayUnique: true,
    consoleNoticeType: 'info',
    consolePrefix: '@forgotten',
    consoleText: 'should contain in propTypes:',
    consolePrefixColor: 'grey',
    consoleComponentColor: 'skyblue',
    consoleTextColor: 'grey',
    consolePropsColor: 'yellow'
});
```
#### propsBlackList([String])
Array of props to ignore

If you need to ignore props of only one component, you can use alternative syntax and set static prop "forgetProps" with array of properties to ignore.
```js
ExampleComponent.forgetProps = ['match', 'location']
```

#### componentsBlackList ([String])
Array of components to ignore
You may have problem with some wrapped components, in this case you should copy name from console log with braces.

#### displayUnique (Boolean)
Allow to display property only first time, otherwise will show all undeclared propTypes properties for component everytime.

#### consoleNoticeType (String)
Called method of console. Should be warn, log, info, debug or error.

#### consolePrefix (String)
Prefix of log message

#### consoleText (String)
Delimiter text between component name and props in console`s message.

#### consolePrefixColor, consoleComponentColor, consoleTextColor, consolePropsColor (String)
CSS color code or HEX code that applies to console`s message

## Known issues
As long as this module just wrapper around React.createElement, we can`t get name of component that been wrapped by other
components, its may be problem in cases when you use a lot of these. For example, these components will display as "withRouter(C)".
You can blacklist these components by wrapper name or by shown component name, or copy whole string from console.

## License

Forgotten-prop-types is [MIT licensed](./LICENSE).
