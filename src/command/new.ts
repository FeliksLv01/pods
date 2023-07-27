import path from 'path'
import ejs from 'ejs'
import fs from 'fs-extra'
import chalk from 'chalk'
import ora from 'ora'
import { spawn, exec } from 'child_process'

interface TemplateFile {
  name: string
  path: string
  isDirectory: boolean
}

async function createProject(
  projectName: string,
  templatePath: string,
  outputPath: string,
  userName: string
): Promise<void> {
  const templateFiles = getTemplateFiles(templatePath)
  await copyTemplateFiles(templateFiles, projectName, templatePath, outputPath, userName)
}

function getTemplateFiles(templatePath: string): TemplateFile[] {
  const templateFiles: TemplateFile[] = []
  const files = fs.readdirSync(templatePath)

  for (const file of files) {
    const filePath = path.join(templatePath, file)
    const stats = fs.statSync(filePath)

    templateFiles.push({
      name: file,
      path: filePath,
      isDirectory: stats.isDirectory(),
    })
  }

  return templateFiles
}

async function copyTemplateFiles(
  templateFiles: TemplateFile[],
  projectName: string,
  templatePath: string,
  outputPath: string,
  userName: string
): Promise<void> {
  for (const templateFile of templateFiles) {
    const outputFilePath = getOutputFilePath(templateFile, projectName, templatePath, outputPath)

    if (templateFile.isDirectory) {
      await fs.promises.mkdir(outputFilePath)
      const subTemplateFiles = getTemplateFiles(templateFile.path)
      await copyTemplateFiles(subTemplateFiles, projectName, templateFile.path, outputFilePath, userName)
    } else {
      const fileContent = await fs.promises.readFile(templateFile.path, 'utf-8')
      const renderedContent = ejs.render(fileContent, { projectName: projectName, projectOwner: userName })
      await fs.promises.writeFile(outputFilePath, renderedContent, 'utf-8')
    }
  }
}

function getOutputFilePath(
  templateFile: TemplateFile,
  projectName: string,
  templatePath: string,
  outputPath: string
): string {
  const relativePath = path.relative(templatePath, templateFile.path)
  const renderedPath = relativePath.replace('PROJECTTEMP', projectName)
  return path.join(outputPath, renderedPath)
}

function getGitUserName(): Promise<string> {
  return new Promise((resolve, reject) => {
    exec('git config user.name', (err, stdout, stderr) => {
      if (err) {
        reject(err)
      }
      if (stderr) {
        reject(stderr)
      }
      resolve(stdout.trim())
    })
  })
}

// const delay = (ms: number) => {
//   return new Promise(resolve => setTimeout(resolve, ms))
// }

export default async function newProject(templatePath: string, projectName: string) {
  // 获取项目路径
  const projectPath = path.join(process.cwd(), projectName)
  // 判断项目路径是否存在
  if (fs.existsSync(projectPath)) {
    console.error(chalk.red(`目标路径 '${projectName}' 已经存在。`))
    return
  }

  const spinner = ora(`Creating project ${chalk.greenBright(projectName)}`).start()

  await fs.promises.mkdir(projectPath)
  spinner.text = chalk.blueBright('start project configuration')

  const userName = (await getGitUserName()) ?? 'Pods CLI'

  await createProject(projectName, templatePath, projectPath, userName)

  const command = spawn('pod', ['install'], {
    cwd: projectPath,
    shell: true,
  })
  command.stdout.on('data', (data: Buffer) => {
    console.log(data.toString())
    spinner.text = chalk.blueBright('pod installing ...')
  })
  command.on('error', error => spinner.fail(chalk.red(error.message)))
  command.on('close', () => spinner.succeed(`Projec generated ${chalk.cyanBright(projectName)} successfully!🎉🎉🎉`))
}
