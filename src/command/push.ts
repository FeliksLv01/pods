import { spawn } from 'child_process';

const push = (name: string) => {
	if (!name) {
		console.log('error: name is null');
		return;
	}
	const command = spawn('pod', [
		'repo',
		'push',
		'UniSpecs',
		`${name}.podspec`,
		'--allow-warnings',
		'--skip-import-validation',
		'--skip-tests',
	]);
	command.stdout.on('data', (data: Buffer) => {
		const msg = data.toString();
		console.log(msg);
	});
	command.on('error', (error) => console.log(error.message));
	command.on('close', () => {
		console.log('end');
	});
};

export default push;
