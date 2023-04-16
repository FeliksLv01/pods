import chalk from 'chalk'
import { exec } from 'child_process'

/**
 * 判断当前是否是一个git仓库
 */
const isInGitRepo = async (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    exec('git rev-parse --is-inside-work-tree', (err, stdout) => {
      if (err) {
        reject(err)
        return
      }

      const isInsideWorkTree = stdout.trim() === 'true'
      resolve(isInsideWorkTree)
    })
  })
}

const getLastestTag = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec('git describe --abbrev=0 --tags', (err, stdout) => {
      if (err) {
        reject(err.message)
        return
      }

      resolve(stdout.trim())
    })
  })
}

export default async function tag() {
  const isValid = await isInGitRepo()
  if (!isValid) {
    console.error(chalk.red('fatal error: no git repo'))
    return
  }
  try {
    const tag = await getLastestTag()
    console.log(`current tag ${chalk.blue(tag)}`)
  } catch (error) {
    console.error(chalk.red('cannot find tags'))
  }
}
