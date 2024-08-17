import { GridFSBucket, ObjectId } from 'mongodb';

/**
 * Uploads a file to GridFS.
 * @param {string} filename - The name of the file to upload.
 * @param {Blob} data - The data of the file as a Blob.
 * @param {object} db - The MongoDB database instance.
 * @param {object} [options] - Options for the upload operation.
 *   - {string} [options.bucketName='fs'] - The name of the GridFS bucket.
 *   - {object} [options.metadata] - Metadata associated with the file.
 * @returns {Promise<string>} - A promise that resolves to the Object ID of the document storing the file.
 */
export async function uploadFile(filename, data, db, options = {}) {
  const buffer = Buffer.from(new Uint8Array(await data.arrayBuffer()));
  const bucketName = options.bucketName || 'fs';
  const gfs = new GridFSBucket(db, { bucketName });

  return new Promise((resolve, reject) => {
    const uploadStream = gfs.openUploadStream(filename, { metadata: options.metadata });

    uploadStream.on('error', reject);
    uploadStream.on('finish', () => resolve(uploadStream.id.toString()));

    uploadStream.write(buffer);
    uploadStream.end();
  });
}

/**
 * Downloads a file from GridFS by its Object ID.
 * @param {string|ObjectId} fileId - The Object ID of the file.
 * @param {object} db - The MongoDB database instance.
 * @param {string} [bucketName='fs'] - The name of the GridFS bucket.
 * @returns {Promise<Buffer[]>} - A promise that resolves to an array of buffers containing the file chunks.
 */
export async function downloadFile(fileId, db, bucketName = 'fs') {
  const gfs = new GridFSBucket(db, { bucketName });
  const objectId = typeof fileId === 'string' ? ObjectId.createFromHexString(fileId) : fileId;

  return new Promise((resolve, reject) => {
    const downloadStream = gfs.openDownloadStream(objectId);
    const chunks = [];

    downloadStream.on('data', chunk => chunks.push(chunk));
    downloadStream.on('end', () => resolve(chunks));
    downloadStream.on('error', reject);
  });
}

/**
 * Finds files in GridFS based on the filter criteria.
 * @param {object} [filter={}] - The filter conditions.
 * @param {object} db - The MongoDB database instance.
 * @param {object} [options={}] - The options for the find operation.
 * @param {string} [bucketName='fs'] - The name of the GridFS bucket.
 * @returns {Promise<object[]>} - A promise that resolves to an array of file metadata documents.
 */
export async function findUploadedFile(filter = {}, db, options = {}, bucketName = 'fs') {
  const gfs = new GridFSBucket(db, { bucketName });
  const cursor = gfs.find(filter, options);
  return cursor.toArray();
}

/**
 * Deletes a file from GridFS by its Object ID.
 * @param {string|ObjectId} fileId - The Object ID of the file.
 * @param {object} db - The MongoDB database instance.
 * @param {string} [bucketName='fs'] - The name of the GridFS bucket.
 * @returns {Promise<void>}
 */
export async function deleteFile(fileId, db, bucketName = 'fs') {
  const gfs = new GridFSBucket(db, { bucketName });
  const objectId = typeof fileId === 'string' ? ObjectId.createFromHexString(fileId) : fileId;
  await gfs.delete(objectId);
}

/**
 * Replaces a file in GridFS by deleting the existing file and uploading a new one.
 * @param {string|ObjectId} fileId - The Object ID of the file to be replaced.
 * @param {string} filename - The name of the new file to upload.
 * @param {Blob} data - The data of the new file as a Blob.
 * @param {object} db - The MongoDB database instance.
 * @param {object} [options={}] - Options for the upload operation.
 * @returns {Promise<string>} - A promise that resolves to the Object ID of the new file.
 */
export async function replaceFile(fileId, filename, data, db, options = {}) {
  await deleteFile(fileId, db, options.bucketName);
  return uploadFile(filename, data, db, options);
}

/**
 * Renames a file in GridFS by updating its filename.
 * @param {string|ObjectId} fileId - The Object ID of the file.
 * @param {string} newName - The new name for the file.
 * @param {object} db - The MongoDB database instance.
 * @param {string} [bucketName='fs'] - The name of the GridFS bucket.
 * @returns {Promise<void>}
 */
export async function renameFile(fileId, newName, db, bucketName = 'fs') {
  const gfs = new GridFSBucket(db, { bucketName });
  const objectId = typeof fileId === 'string' ? ObjectId.createFromHexString(fileId) : fileId;
  await gfs.rename(objectId, newName);
}

/**
 * Deletes all files and their metadata in a GridFS bucket.
 * @param {string} bucketName - The name of the GridFS bucket.
 * @param {object} db - The MongoDB database instance.
 * @returns {Promise<void>}
 */
export async function deleteBucket(bucketName, db) {
  const gfs = new GridFSBucket(db, { bucketName });
  await gfs.drop();
}
