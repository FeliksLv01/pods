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
	const keyWords = [
		'Testing with `xcodebuild`',
		"Updating the `UniSpecs' repo",
		"Adding the spec to the `UniSpecs' repo",
		"Pushing the `UniSpecs' repo",
	];
	command.stdout.on('data', (data: Buffer) => {
		const msg = data.toString();
		if (keyWords.some((keyWord) => msg.includes(keyWord))) {
			spinner.text = chalk.blueBright(msg);
		}
	});
	command.on('error', (error) => spinner.fail(chalk.red(error.message)));
	command.on('close', () => spinner.succeed(`Pushed ${chalk.cyanBright(name)} successfully!🎉🎉🎉`));
};

export default push;
