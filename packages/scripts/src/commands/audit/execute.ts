/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { run } from '@essex/shellrunner'
import { resolve } from 'path'

const auditCiConfig = resolve(__dirname, '../../../config/.audit-ci.js')

const licenseConfig = resolve(
	__dirname,
	'../../../config/licenses-to-fail-config.js',
)

export interface AuditCommandOptions {
	verbose: boolean
}

export async function execute(options: AuditCommandOptions): Promise<number> {
	const { code } = await run(
		// Audit CVEs
		{ exec: 'audit-ci', args: ['--config', auditCiConfig], npx: true },

		// Check Licenses
		{ exec: 'license-to-fail', args: [licenseConfig], npx: true },
	)
	return code
}
