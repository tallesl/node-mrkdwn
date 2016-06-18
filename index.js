#! /usr/bin/env node

'use strict'

const argv = require('minimisty')
const fs = require('fs')
const marked = require('marked')
const opn = require('opn')
const pkg = require('./package')
const path = require('path')
const rfile = require('rfile')
const style = rfile('./style.css')
const temp = require('temp')

/* eslint-disable padded-blocks */

// if asked for help
if (argv._flags.h || argv._flags.help) help()

// or if asked for version
if (argv._flags.v || argv._flags.version) version()

// if hasn't passed anything help is shown anyway
if (!argv._.length) help()

// for each given file
argv._.forEach((filepath) => {

  // read file's content
  fs.readFile(filepath, 'utf8', (err, data) => {

    // if there's an error we end
    end(err)

    // if the file is blank we end
    if (!data) end(filepath + 'is blank.')

    // filename without extension
    const basename = path.basename(filepath, path.extname(filepath))

    // rendered markdown
    const markdown = marked(fs.readFileSync(filepath, 'utf8'))

    // ready to go html
    const html = `<title>${basename}</title>\n\n<style>${style}</style>\n\n${markdown}`

    // getting a temporary file
    temp.open({ suffix: '.html' }, (err, tempfile) => {

      // if there's an error we end
      end(err)

      // write the temporary file
      fs.writeFile(tempfile.path, html, (err) => {

        // if there's an error we end
        end(err)

        // open up a browser displaying the file
        opn(tempfile.path, { wait: false })
      })
    })
  })
})

/* eslint-enable padded-blocks */

function end (err) {
  if (err) {
    console.error(err.message || err)
    process.exit(1)
  }
}

function help () {
  console.log(`${pkg.description} Check the man page for details.`)
  process.exit()
}

function version () {
  console.log(pkg.version)
  process.exit()
}
