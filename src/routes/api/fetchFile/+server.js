import { downloadFile, findUploadedFile } from '../../../db/gfs';
import { DATABASE_NAME } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import mongoClient from '../../../db/gfs';

// A request to get the raw data of a file.
// This request accepts two properties:
// `fileId` (a string) which is the Object ID of the file to get the data from.
// `bucketName` (a string) which is the name of the bucket currently storing the data.
export const POST = async ({ request }) => {
	const db = (await mongoClient).db(DATABASE_NAME);
	const { fileId, bucketName } = await request.json();

	if (!fileId) {
		return new Response('Missing file ID.', { status: 400 });
	}

	try {
		const fileDocuments = await findUploadedFile(
			{ _id: ObjectId.createFromHexString(fileId) },
			db,
			undefined,
			bucketName
		);
		const fileDocument = fileDocuments[0];

		if (!fileDocument) {
			return new Response('The file does not exist.', { status: 404 });
		}

		// Safely handle metadata and type
		const type = fileDocument.metadata ? fileDocument.metadata.type : 'unknown';
		const file = await downloadFile(fileId, db, bucketName);

		return json({
			data: file,
			type
		});
	} catch (e) {
		return new Response(
			"The file couldn't be retrieved from the database. Maybe it does not exist.",
			{ status: 404 }
		);
	}
};
