import { Command } from 'commander'
import chalk from 'chalk'
import create from './command/create'

const program = new Command()

program.version('0.0.1').description(chalk.greenBright('CLI For Managing Pods')).parse(process.argv)

program
  .command('create <name>')
  .description('create a swift pod')
  .action((name: string) => {
    create(name)
  })

program.parse(process.argv)
