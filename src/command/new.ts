import path from 'path'
import ejs from 'ejs'
import fs from 'fs-extra'
import chalk from 'chalk'
import ora from 'ora'

// 异步地复制文件
const copyFile = (srcPath: string, destPath: string) => {
  return fs.promises.copyFile(srcPath, destPath)
}

// 异步地创建文件夹
const mkdir = (dirPath: string) => {
  return fs.promises.mkdir(dirPath, { recursive: true })
}

// 异步地复制模版文件夹中的所有文件和子文件夹到目标目录
const copyFiles = async (srcDir: string, destDir: string) => {
  // 读取源目录中的所有文件和文件夹
  const files = await fs.promises.readdir(srcDir)

  // 遍历所有文件和文件夹
  for (const file of files) {
    // 构造源文件路径和目标文件路径
    const srcPath = path.join(srcDir, file)
    const destPath = path.join(destDir, file)

    // 获取文件的状态信息
    const stat = await fs.promises.stat(srcPath)

    if (stat.isDirectory()) {
      // 如果是文件夹，递归处理文件夹下的所有文件和子文件夹
      await mkdir(destPath)
      await copyFiles(srcPath, destPath)
    } else {
      // 如果是文件，复制文件到目标目录
      await copyFile(srcPath, destPath)
    }
  }
}

// 复制模版文件夹到目标目录
const createProject = async (projectName: string) => {
  const srcDir = path.join(__dirname, 'template')
  const destDir = path.join(process.cwd(), projectName)

  await mkdir(destDir)
  await copyFiles(srcDir, destDir)

  console.log(`Created project "${projectName}" successfully.`)
}

export default async function newProject(tplPath: string, projectName: string) {
  // 获取项目路径
  const projectPath = path.join(process.cwd(), projectName)
  // 判断项目路径是否存在
  if (fs.existsSync(projectPath)) {
    console.error(chalk.red(`目标路径 '${projectName}' 已经存在。`))
    return
  }

  const spinner = ora(`Creating project ${chalk.greenBright(projectName)}`).start()

  // 获取模版文件列表
  const tplFiles = await fs.readdir(tplPath)
  // 读取模版文件并替换变量
  const tplData = await Promise.all(
    tplFiles.map(async file => {
      const filePath = path.join(tplPath, file)
      const stats = await fs.stat(filePath)
      // 判断是否是文件夹
      if (stats.isDirectory()) return
      // 读取文件内容
      let content = await fs.readFile(filePath, 'utf-8')
      // 替换变量
      content = ejs.render(content, { projectName })
      return {
        filePath: path.join(projectPath, file),
        content,
      }
    })
  )

  spinner.text = chalk.blueBright('start project configuration')
  await Promise.all(
    tplData.map(async data => {
      if (!data) return
      await fs.ensureDir(path.dirname(data.filePath))
      await fs.writeFile(data.filePath, data.content)
    })
  )

  // 结束生成项目
  spinner.succeed(`Projec generated ${chalk.cyanBright(projectName)} successfully!🎉🎉🎉`)
}
