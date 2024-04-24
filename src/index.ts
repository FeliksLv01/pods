#!/usr/bin/env node
import { Command } from 'commander'
import chalk from 'chalk'
import create from './command/create.js'
import newProject from './command/new.js'
import path from 'path'
import { fileURLToPath } from 'url'
import push from './command/push.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const parentDirname = path.resolve(__dirname, '../')

const tplPath = path.join(parentDirname, 'templates')

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
	.action((name: string) => newProject(tplPath, name))

program
	.command('push <name>')
	.description('push pod to repo')
	.action((name: string) => push(name))

program.parse(process.argv)
