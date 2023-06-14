import chalk from 'chalk'
import { spawn } from 'child_process'
import ora from 'ora'
import { precheck } from '../util.js'

export default async function create(name: string) {
  const isValid = await precheck(name)
  if (!isValid) {
    console.error(chalk.red(`目标路径 '${name}' 已经存在。`))
    return
  }

  const spinner = ora(`cloning template into ${chalk.greenBright(name)}`).start()

  const command = spawn('pod', ['lib', 'create', name, '--template-url=git@github.com:FeliksLv01/pod-template.git'])
  command.stdout.on('data', (data: Buffer) => {
    const msg = data.toString()
    if (msg.startsWith('Configuring')) {
      spinner.text = chalk.blueBright('start project configuration')
    }
  })
  command.on('error', error => spinner.fail(chalk.red(error.message)))
  command.on('close', () => spinner.succeed(`create pod ${chalk.cyanBright(name)} successfully!🎉🎉🎉`))
}
