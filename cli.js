#!/usr/bin/env node
// Yes I realize this is silly. But how else can I make this usable with npx?
const {execSync} = require('child_process')
const path = require('path')
const jscodeshift = path.join(__dirname, 'node_modules', '.bin', 'jscodeshift')
execSync(`${jscodeshift} -t ${path.join(__dirname, 'index.js')} ${process.argv.slice(2).join(' ')}`, {stdio: 'inherit'})
