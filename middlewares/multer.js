import multer from 'multer';
import { v4 as uuidv4 } from 'uuid'; // Import UUID for generating unique identifiers

// Define storage settings for multer
const storage = multer.diskStorage({
    // Set the destination for uploaded files
    destination: function (req, file, cb) {
        cb(null, 'public'); // Files will be saved in the 'public' directory
    },
    // Define the naming convention for uploaded files
    filename: function (req, file, cb) {
        const uniqueSuffix = `${uuidv4()}-${Date.now()}`; // Generate a unique suffix using UUID and timestamp
        const originalName = file.originalname;
        const extension = originalName.substring(originalName.lastIndexOf('.')); // Extract the file extension
        const newFilename = `${file.originalname.split('.')[0]}-${uniqueSuffix}${extension}`; // Combine unique suffix with original name and extension
        cb(null, newFilename); 
    }
});

// Initialize multer with the defined storage settings
export const upload = multer({ storage });
