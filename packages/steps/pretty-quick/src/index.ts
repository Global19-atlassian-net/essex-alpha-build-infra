// Adapted from https://github.com/azz/pretty-quick/blob/master/bin/pretty-quick.js
const chalk = require('chalk')
const pq = require('pretty-quick')

export interface PrettyQuickArgs {
	staged?: boolean
	check?: boolean
	verbose?: boolean
}
export async function prettyQuick(args: PrettyQuickArgs): Promise<void> {
	const prettyQuickResult = pq(process.cwd(), {
		...args,
		onFoundSinceRevision: (scm: string, revision: string) => {
			console.log(
				`🔍  Finding changed files since ${chalk.bold(
					scm,
				)} revision ${chalk.bold(revision)}.`,
			)
		},
		onFoundChangedFiles: (changedFiles: string[]) => {
			console.log(
				`🎯  Found ${chalk.bold(changedFiles.length)} changed ${
					changedFiles.length === 1 ? 'file' : 'files'
				}.`,
			)
		},
		onPartiallyStagedFile: (file: string) => {
			console.log(`✗ Found ${chalk.bold('partially')} staged file ${file}.`)
		},

		onWriteFile: (file: string) => {
			console.log(`✍️  Fixing up ${chalk.bold(file)}.`)
		},

		onCheckFile: (file: string, isFormatted: boolean) => {
			if (!isFormatted) {
				console.log(`⛔️  Check failed: ${chalk.bold(file)}`)
			}
		},

		onExamineFile: (file: string) => {
			console.log(`🔍  Examining ${chalk.bold(file)}.`)
		},
	})

	if (prettyQuickResult.success) {
		console.log('✅  Everything is awesome!')
	} else {
		if (prettyQuickResult.errors.indexOf('PARTIALLY_STAGED_FILE') !== -1) {
			console.log(
				'✗ Partially staged files were fixed up.' +
					` ${chalk.bold('Please update stage before committing')}.`,
			)
		}
		if (prettyQuickResult.errors.indexOf('BAIL_ON_WRITE') !== -1) {
			console.log(
				'✗ File had to be prettified and prettyQuick was set to bail mode.',
			)
		}
		if (prettyQuickResult.errors.indexOf('CHECK_FAILED') !== -1) {
			console.log(
				'✗ Code style issues found in the above file(s). Forgot to run Prettier?',
			)
		}
		throw new Error('pretty-quick failed')
	}
}
