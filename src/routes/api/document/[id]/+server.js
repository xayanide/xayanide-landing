import { json } from '@sveltejs/kit';
import mongoClient from '../../../../db/mongo';
import { DATABASE_NAME } from '$env/static/private';
import { ObjectId } from 'mongodb';

export const GET = async ({ params }) => {
	const { id } = params;

	try {
		const db = (await mongoClient).db(DATABASE_NAME);
		const collection = db.collection('jsondata');

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

		const data = await collection.findOne({ _id: ObjectId.createFromHexString(id) });

		if (!data) {
			return json({ error: 'Data not found' }, { status: 404 });
		}

		return json(data);
	} catch (error) {
		return json({ error: 'Failed to fetch data from MongoDB' }, { status: 500 });
	}
};
