import { readdirSync, existsSync, mkdirSync, lstatSync, copyFileSync } from 'fs'
import path from 'path'
import { promisify } from 'util'
import { exec, spawn } from 'child_process'
import { precheck } from '../util.js'
import chalk from 'chalk'
import ora from 'ora'

// 定义复制文件夹的函数
function copyFolderSync(source: string, target: string) {
  if (!existsSync(target)) {
    mkdirSync(target)
  }

  // 获取源文件夹中的所有文件
  const files = readdirSync(source)

  files.forEach(function (file) {
    const curSource = path.join(source, file)
    const curTarget = path.join(target, file)

    if (lstatSync(curSource).isDirectory()) {
      // 如果是文件夹则递归调用
      copyFolderSync(curSource, curTarget)
    } else {
      // 如果是文件则直接复制
      copyFileSync(curSource, curTarget)
    }
  })
}

const execPromise = promisify(exec)

async function gitClone(url: string, dest: string, branch?: string): Promise<void> {
  const cloneCommand = `git clone ${branch ? `--branch ${branch} ` : ''}${url} ${dest}`
  await execPromise(cloneCommand)
}

// 调用函数复制文件夹

// const newProject = (name: string) => {
// gitClone('https://github.com/user/repo.git', '/path/to/destination', 'my-branch')
//   .then(() => console.log('Git clone complete'))
//   .catch(error => console.error('Git clone failed', error))
// }

export default async function newProject(name: string) {
  const isValid = await precheck(name)
  if (!isValid) {
    console.error(chalk.red(`目标路径 '${name}' 已经存在。`))
    return
  }

  const spinner = ora(`cloning template into ${chalk.greenBright(name)}`).start()

  const command = spawn('pod', [
    'lib',
    'create',
    name,
    '--template-url=https://gitee.com/felikslv/project-template.git',
  ])
  command.stdout.on('data', (data: Buffer) => {
    const msg = data.toString()
    if (msg.startsWith('Configuring')) {
      spinner.text = chalk.blueBright('start project configuration')
    }
  })
  command.on('error', error => spinner.fail(chalk.red(error.message)))
  command.on('close', () => spinner.succeed(`create ${chalk.cyanBright(name)} successfully!🎉🎉🎉`))
}
