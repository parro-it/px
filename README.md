<p align="center">
  <img alt="px banner" src="https://raw.githubusercontent.com/parro-it/px/master/images/logo.png">
</p>

<h2 align="center">Posix cross platform npm scripts.</h2>

<p align="center">
  <em>
  Write your npm scripts using posix bash syntax, cross platform
  </em>
</p>

<p align="center">
  <a href="http://travis-ci.org/parro-it/px">
    <img alt="travis build status" src="https://img.shields.io/travis/parro-it/px/master.svg?style=for-the-badge">
  </a>
  <a href="https://npmjs.org/package/@posix/px">
    <img alt="npm" src="https://img.shields.io/npm/v/@posix/px.svg?style=for-the-badge">
  </a>
</p>

## Features

* Command sequences

_Execute a set of command serially_

```bash
command1; command2; command3;
```

* Logical or

_Execute commandB only if execution of commandA fail (exit code <> 0)_

```bash
command1 || command2
```

* Logical and

_Execute commandB only if execution of commandA succeed (exit code = 0)_

```bash
command1 && command2
```

## Usage

description of the example

```js
const px = require("px");

console.log({ px });
```

This will output

```

```

## API

## Install

With [npm](https://npmjs.org/) installed, run

```bash
npm install --save px
```

## See Also

* [`noffle/common-readme`](https://github.com/noffle/common-readme)

## License

MIT
