import chalk from 'chalk'
import { spawn } from 'child_process'
import { access } from 'fs/promises'
import ora from 'ora'

const precheck = async (name: string): Promise<boolean> => {
  try {
    await access(name)
    return false
  } catch {
    return true
  }
}

export default async function create(name: string) {
  const isValid = await precheck(name)
  if (!isValid) {
    console.error(chalk.red(`目标路径 '${name}' 已经存在。`))
    return
  }

  const spinner = ora(chalk.greenBright(`Cloning template into ${name}`)).start()

  const command = spawn('pod', ['lib', 'create', name, '--template-url=git@github.com:FeliksLv01/pod-template.git'])
  command.stdout.on('data', (data: Buffer) => {
    const msg = data.toString()
    if (msg.startsWith('Configuring')) {
      spinner.text = chalk.blueBright('start generating')
    }
  })
  command.on('error', error => {
    spinner.fail(chalk.red(error.message))
  })
  command.on('close', _ => {
    spinner.succeed(chalk.greenBright('finished'))
  })
}
