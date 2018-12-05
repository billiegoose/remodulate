# remodulate [WORK IN PROGRESS]
Convert ES2015 modules to CommonJS modules (and vice versa?)

## Usage

```sh
npx remodulate [any jscodeshift options] <your files>
```

Use the `-d` option for a dry-run and use `-dp` to print the output for comparison without overwriting the originals. See all available [jscodeshift options](https://github.com/facebook/jscodeshift#usage-cli).

### Test
Clone, `npm install`, and run `npm test` to transform the files in `./examples` into `./output`

## TODO

ESM -> CJS
- [x] namespace imports
- [x] named exports
- [x] named imports
- [x] default exports
- [x] default imports

CJS -> ESM
- [ ] namespace imports
- [ ] named exports
- [ ] named imports
- [ ] default exports
- [ ] default imports
