// Require the cloudinary library
import * as cloudinary from "cloudinary";

const cloudinaryV2 = cloudinary.v2;
// Return "https" URLs by setting secure: true
cloudinaryV2.config({
  secure: true,
});

// Log the configuration
export default cloudinaryV2;
