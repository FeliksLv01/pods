#!/usr/bin/env node
import { Command } from 'commander'
import chalk from 'chalk'
import create from './command/create.js'
import tag from './command/tag.js'
import newProject from './command/new.js'

console.log(chalk.cyanBright('  ____              _      '))
console.log(chalk.cyanBright(' |  _ \\   ___    __| | ___ '))
console.log(chalk.cyanBright(' | |_) | / _ \\  / _` |/ __|'))
console.log(chalk.cyanBright(' |  __/ | (_) || (_| |\\__ \\'))
console.log(chalk.cyanBright(' |_|     \\___/  \\__._||___/\n'))

const program = new Command()

program.version('0.0.1').description(chalk.greenBright('CLI For Managing Pods')).parse(process.argv)

program
  .command('lib <name>')
  .description('create a swift pod')
  .action((name: string) => create(name))

program
  .command('new <name>')
  .description('new xcode project')
  .action((name: string) => newProject(name))

// program.command('tag').description('tag').action(tag)

program.parse(process.argv)
