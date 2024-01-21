// Based on the Vue Router packages/docs/generate-translation-status.mjs under MIT License

// run pnpm run docs:i18n-checkpoint <locale> [<commit>] after you have translated some files

/* eslint-disable no-console */
import { readFile, writeFile } from 'node:fs/promises'
import process from 'node:process'
import SimpleGit from 'simple-git'

const CHECKPOINT_FILE_PATH = './.vitepress/i18n-checkpoint.json'

const USAGE_INFO = `
Usage: pnpm run docs:i18n-checkpoint <locale> [<commit>]
    locale: the target locale you translated
    commit: the target commit you based
`
async function getCommitInfo(commit: string) {
  try {
    const git = SimpleGit()
    const log = await git.log([commit, '-n', '1'])
    const hash = log.latest?.hash && log.latest.hash.substring(0, 6)
    const date = log.latest?.date && new Date(log.latest.date).toISOString().substring(0, 10)
    return { hash, date }
  }
  catch (err) {
    throw Error
  }
}

interface CheckpointData {
  [key: string]: {
    hash: string
    date: string
  }
}

async function writeCheckpointFile(lang: string, hash: string, date: string) {
  const data: CheckpointData = {}
  try {
    const previousContent = await readFile(CHECKPOINT_FILE_PATH, 'utf8')
    const previousJson = JSON.parse(previousContent)
    Object.assign(data, previousJson)
  }
  catch (err) {
    console.warn('No previous status file. Will create a new one.')
  }
  data[lang] = {
    hash,
    date,
  }
  await writeFile(CHECKPOINT_FILE_PATH, `${JSON.stringify(data, null, 2)}\n`)
}

async function main() {
  if (process.argv.find(arg => arg === '--help' || arg === '-h')) {
    console.log(USAGE_INFO)
    return
  }

  const locale = process.argv[2]
  const commit = process.argv[3] || 'main'

  const { hash, date } = await getCommitInfo(commit)
  if (!hash || !date) {
    console.log(`❌ No commit found for "${commit}".`)
  }
  else {
    await writeCheckpointFile(locale, hash, date)
    console.log(`✅ Updated ${locale} to "${hash}" (${date})`)
  }
}

main()
