# PX Blue CLI
This Command Line Interface is a utility for creating new PX Blue applications with automatic integration of themes, components, etc.

## Usage
The PX Blue CLI can be utilized via npx without having to install any global packages:
```
npx -p @pxblue/cli pxb <command>
```

If you would prefer to have a global install of the CLI you may do so via:
```shell
$ yarn global add @pxblue/cli
```
or
```shell
$ npm install -g @pxblue/cli
```

## Available Commands
|command                | description                                                                                                                                                              |
|-----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `pxb help`            | lists all available commands and descriptions                                                                                                                            |
| `pxb version`         | displays the version of the currently installed CLI                                                                                                                      |
| `pxb new <framework>` | Creates a new skeleton project with PX Blue integration. You'll be prompted to give your project a name and select various options depending on your selected framework. |
