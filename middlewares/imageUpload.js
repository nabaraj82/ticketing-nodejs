const upload = require("../multerConfig");
const s3 = require("../aws-config");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3")

const uploadImageToS3 = async (req, res, next) => {
  if (!req.file) return next();

  const fileExtension = path.extname(req.file.originalname);
 const fileName = `${uuidv4()}${fileExtension}`;


  const params = {
    Bucket: process.env.BUCKET_BLOG,
    Key: fileName,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  try {
   await s3.send(new PutObjectCommand(params));
   const imageUrl = `https://${params.Bucket}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${fileName}`;
   req.imageUrl = imageUrl;
   next();
  } catch (error) {
    console.error("S3 Upload Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Image upload failed" });
  }
};

module.exports = {
  upload,
  uploadImageToS3,
};
