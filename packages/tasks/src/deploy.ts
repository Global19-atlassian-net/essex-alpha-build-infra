/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { deployBlob } from '@essex/build-step-azure'

export interface DeployCommandOptions {
	verbose: boolean
	type: DeployType
	storageAccount: string
	storageAccountKey: string
}

export enum DeployType {
	AzureBlobStorage = 'azure-blob-storage',
}

export function deployTask(options: DeployCommandOptions): Promise<void> {
	if (!options.type) {
		throw new Error("'type' argument not set")
	}
	switch (options.type) {
		case DeployType.AzureBlobStorage: {
			return executeAzureBlobDeploy(options)
		}
		default:
			throw new Error(`Unhandled deploy type: ${options.type}`)
	}
}

function executeAzureBlobDeploy({
	storageAccount,
	storageAccountKey,
	verbose = false,
}: DeployCommandOptions) {
	if (!storageAccount) {
		throw new Error('storageAccount must be set')
	}
	if (!storageAccountKey) {
		throw new Error('storageAccountKey must be set')
	}
	return deployBlob(storageAccount, storageAccountKey, verbose)
}
