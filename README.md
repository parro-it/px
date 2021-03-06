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
  ⌘
  <a href="http://travis-ci.org/parro-it/px">
    <img alt="travis ci" src="https://img.shields.io/travis/parro-it/px/master.svg?style=plastic">
  </a>
  ⌘
  <a href="https://npmjs.org/package/@posix/px">
    <img alt="npm version" src="https://img.shields.io/npm/v/@posix/px.svg?style=plastic">
  </a>
  ⌘
  <a href="https://ci.appveyor.com/project/parro-it/px">
    <img alt="appveyor ci" src="https://ci.appveyor.com/api/projects/status/ajja4gd5j5u221v9/branch/master?svg=true">
  </a>
  ⌘
</p>

## Features

#### Command sequences

> _Execute a set of command serially_

```bash
command1; command2; command3;
```

#### Logical or

> _Execute commandB only if execution of commandA fail (exit code <> 0)_

```bash
command1 || command2
```

#### Logical and

> _Execute commandB only if execution of commandA succeed (exit code = 0)_

```bash
command1 && command2
```

#### Setting environment variables

> _Set an environment variable (could replace the use of cross-env)_

```bash
DEBUG=cmd cmd
```

#### Asynchronous execution of a process

> _Run cmd1, cmd2 and cmd3 in parallel_

```bash
cmd1 & cmd2 & cmd3
```

## Usage

1. Install `px`:

```bash
$ npm i @posix/px --save-dev
```

2. Add a line to your project `.npmrc` file to configure the script-shell config:

```
script-shell = "px"
```

**_on windows you shall use px.cmd:_**

```
px.cmd
```

> The setup process above will be automated using a `px --init` command.

## See Also

* [`noffle/common-readme`](https://github.com/noffle/common-readme)
* [`bash-parser`](https://github.com/vorpaljs/bash-parser)

## License

MIT - © 2017 Andrea Parodi
