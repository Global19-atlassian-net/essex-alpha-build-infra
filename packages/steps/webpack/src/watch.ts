/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import webpack = require('webpack')
import { getCompiler, WebpackCompilerOptions } from './getCompiler'

export function webpackWatch(config: WebpackCompilerOptions): Promise<number> {
	return new Promise((resolve, reject) => {
		const compiler = getCompiler(config)
		const watcher = compiler.watch(
			{
				aggregateTimeout: 500,
				ignored: /node_modules/,
			},
			(err: Error, stats: webpack.Stats) => {
				if (err) {
					reject(err)
				}
				console.log(stats.toString({ colors: true }))
			},
		)
	})
}
