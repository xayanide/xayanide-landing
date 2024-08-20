import { json } from '@sveltejs/kit';
import mongoClient from '../../../db/mongo';
import { DATABASE_NAME } from '$env/static/private';

export const POST = async ({ request }) => {
	const formData = await request.formData();
	const file = formData.get('jsonfile');
	const jsonData = JSON.parse(await file.text());
	jsonData['upload_date'] = new Date(
		new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
	).toString();
	try {
		const db = (await mongoClient).db(DATABASE_NAME);
		const collection = db.collection('jsondata');
		const result = await collection.insertOne(jsonData);
		// If more than 3 documents, delete older ones
		const documentCount = await collection.countDocuments();
		if (documentCount > 3) {
			// Fetch the oldest documents except for the latest three
			const excessDocuments = await collection
				.find()
				.sort({ _id: 1 }) // Sort by `_id` in ascending order to get the oldest first
				.limit(documentCount - 3) // Get only the documents that exceed the count of 3
				.toArray();

			// Delete each of these older documents
			const deletePromises = excessDocuments.map((doc) => collection.deleteOne({ _id: doc._id }));
			await Promise.all(deletePromises);
		}

		return json({ insertedId: result.insertedId });
	} catch (error) {
		return json({ error: 'Failed to insert data into MongoDB' }, { status: 500 });
	}
};
