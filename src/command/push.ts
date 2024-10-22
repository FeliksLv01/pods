import chalk from 'chalk';
import ora from 'ora';
import { spawn } from 'child_process';

const push = (name: string) => {
	if (!name) {
		console.log('error: name is null');
		return;
	}
	const spinner = ora(`Building ${chalk.greenBright(name)}`).start();
	const command = spawn('pod', [
		'repo',
		'push',
		'UniSpecs',
		`${name}.podspec`,
		'--verbose',
		'--allow-warnings',
		'--use-libraries',
		'--use-modular-headers',
		'--skip-tests',
	]);
	command.stdout.on('data', (data: Buffer) => {
		const msg = data.toString();
		console.log(msg);
	});
	command.on('error', (error) => spinner.fail(chalk.red(error.message)));
	command.on('close', () => {});
};

export default push;
