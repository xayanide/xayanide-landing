import { downloadFile, findUploadedFile } from "$db/gfs";
import { DATABASE_NAME } from "$env/static/private";
import { json } from "@sveltejs/kit";
import { ObjectId } from "mongodb";
import clientPromise from "$db/mongo";

// A request to get the raw data of a file.
// This request accepts two properties:
// `fileId` (a string) which is the Object ID of the file to get the data from.
// `bucketName` (a string) which is the name of the bucket currently storing the data.
export const POST = async ({ request }) => {
  const db = (await clientPromise).db(DATABASE_NAME);
  const { fileId, bucketName } = await request.json();

  if (!fileId) {
    return new Response("Missing file ID.", { status: 400 });
  }

  try {
    const imageDocuments = await findUploadedFile({ _id: new ObjectId(fileId) }, db, undefined, bucketName);
    const imageDocument = imageDocuments[0];

    if (!imageDocument) {
      return new Response("The file doesn't exist.", { status: 404 });
    }

    // Safely handle metadata and type
    const type = imageDocument.metadata ? imageDocument.metadata.type : "unknown";
    const image = await downloadFile(fileId, db, bucketName);

    return json({
      data: image,
      type
    });
  } catch (e) {
    return new Response("The image couldn't be retrieved from the database. Maybe it doesn't exist.", { status: 404 });
  }
};
