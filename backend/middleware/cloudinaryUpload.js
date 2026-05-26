const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

// Configure Cloudinary only if credentials are set
const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

const UPLOADS_DIR = path.join(__dirname, "../uploads");

const processAndUploadFile = async (file) => {
  const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "-");
  const uniqueName = `${Date.now()}-${safe}`;

  if (isCloudinaryConfigured) {
    // Upload memory buffer to Cloudinary
    return new Promise((resolve, reject) => {
      const isPdf = file.originalname.toLowerCase().endsWith(".pdf");
      const baseName = path.parse(safe).name;
      
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "portfolio",
          resource_type: isPdf ? "raw" : "auto",
          public_id: `${baseName}-${Date.now()}`
        },
        (error, result) => {
          if (error) return reject(error);
          file.cloudinaryUrl = result.secure_url;
          resolve();
        }
      );
      uploadStream.end(file.buffer);
    });
  } else {
    // Write memory buffer to local disk (fallback for local development)
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
    const localPath = path.join(UPLOADS_DIR, uniqueName);
    fs.writeFileSync(localPath, file.buffer);
    file.filename = uniqueName; // Matches old multer structure
    file.cloudinaryUrl = null;
  }
};

const cloudinaryUpload = async (req, res, next) => {
  try {
    if (req.file) {
      await processAndUploadFile(req.file);
    }
    if (req.files) {
      for (const fieldName of Object.keys(req.files)) {
        const files = req.files[fieldName];
        for (const file of files) {
          await processAndUploadFile(file);
        }
      }
    }
    next();
  } catch (error) {
    console.error("Upload error:", error);
    next(error);
  }
};

module.exports = cloudinaryUpload;
