import fs from 'fs';
import readline from 'readline';

const jsonFilePath = 'src/lib/data/links.json';
const backupFilePath = 'src/lib/data/links.json.bak';

const readJSONFile = (filePath) => {
	try {
		const data = fs.readFileSync(filePath, 'utf8');
		return JSON.parse(data);
	} catch (err) {
		console.error(`Error reading file from disk: ${err}`);
		return null;
	}
};

const writeJSONFile = (filePath, data) => {
	try {
		fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
	} catch (err) {
		console.error(`Error writing file to disk: ${err}`);
	}
};

const backupJSONFile = () => {
	try {
		fs.copyFileSync(jsonFilePath, backupFilePath);
	} catch (err) {
		console.error(`Error backing up file: ${err}`);
	}
};

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const askQuestion = (question) => {
	return new Promise((resolve) => rl.question(question, resolve));
};

const handleSIGINT = () => {
	console.log('\nProcess interrupted. No changes were made.');
	rl.close();
	process.exit();
};

const updateLinks = async () => {
	process.on('SIGINT', handleSIGINT);

	backupJSONFile();

	const data = readJSONFile(jsonFilePath);
	if (!data) return;

	const newLink = await askQuestion('What link to add? ');

	if (!newLink.trim()) {
		console.log('No link provided. No changes were made.');
		rl.close();
		return;
	}

	const newEntry = {
		url: newLink,
		metadata: {
			'link-date-added': new Date().toString(),
			'link-index': data.links.length > 0 ? data.links.length + 1 : 1
		}
	};

	data.links.push(newEntry);

	writeJSONFile(jsonFilePath, data);
	console.log('Link added successfully.');

	rl.close();
};

updateLinks();
