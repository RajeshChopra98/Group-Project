import { bucket } from './firebase.js';
import { getStorage, getDownloadURL } from 'firebase-admin/storage';
import path from "path";
import fs from "fs";
import { errorHandler } from './error.js';

const uploadToFirebase = async (localFilePath, mimetype, folder) => {
    try {
        const fileName = path.basename(localFilePath);
        const destination = folder ? `${folder}/${fileName}` : fileName; // Construct the destination path

        const blob = bucket.file(destination); // Specify the destination path
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: mimetype,
            },
        });

        const uploadPromise = new Promise((resolve, reject) => {
            blobStream.on('error', (err) => reject(err));
            blobStream.on('finish', () => {
                resolve();
            });
        });

        blobStream.end(fs.readFileSync(localFilePath));

        await uploadPromise;
        fs.unlinkSync(localFilePath);

        // Generate downloadable URL for the uploaded file
        const downloadURL = await getDownloadURL(blob);

        return {
            url : downloadURL,
            publicId : destination // Use the destination as the publicId
        };
    } catch (error) {
        if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
        throw new Error(error.message);
    }
};


const deleteImageFromFirebase = async (fullPath) => {
    try {
        if (!fullPath) {
            throw errorHandler(400, "No fullPath was provided");
        }

        // Get a reference to the file
        const fileRef = getStorage().bucket().file(fullPath);

        // Delete the file
        await fileRef.delete();

        return true; // Successfully deleted
    } catch (error) {
        throw errorHandler(error.http_code || 500, error.message || "Internal Server Error");
    }
};


export { uploadToFirebase, deleteImageFromFirebase };
