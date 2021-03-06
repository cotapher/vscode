/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import * as cp from 'child_process';
import * as os from 'os';
import * as platform from 'vs/base/common/platform';
import * as processes from 'vs/base/node/processes';
import { readFile, fileExists } from 'vs/base/node/pfs';

export const TERMINAL_DEFAULT_SHELL_LINUX = !platform.isWindows ? (process.env.SHELL || 'sh') : 'sh';
export const TERMINAL_DEFAULT_SHELL_OSX = !platform.isWindows ? (process.env.SHELL || 'sh') : 'sh';

const isAtLeastWindows10 = platform.isWindows && parseFloat(os.release()) >= 10;
const is32ProcessOn64Windows = process.env.hasOwnProperty('PROCESSOR_ARCHITEW6432');
const powerShellPath = `${process.env.windir}\\${is32ProcessOn64Windows ? 'Sysnative' : 'System32'}\\WindowsPowerShell\\v1.0\\powershell.exe`;

export const TERMINAL_DEFAULT_SHELL_WINDOWS = isAtLeastWindows10 ? powerShellPath : processes.getWindowsShell();

export interface ITerminalProcessFactory {
	create(env: { [key: string]: string }): cp.ChildProcess;
}

if (platform.isLinux) {
	const file = '/etc/os-release';
	fileExists(file).then(exists => {
		if (!exists) {
			return;
		}
		readFile(file).then(b => {
			const contents = b.toString();
			if (contents.indexOf('NAME=Fedora') >= 0) {
				isFedora = true;
			}
		});
	});
}

export let isFedora = false;