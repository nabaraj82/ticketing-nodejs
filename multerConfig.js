const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./public/images");
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const filename = Date.now() + ext;
//     cb(null, filename);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
//   if (!allowedTypes.includes(file.mimetype)) {
//     return cb(new Error("Only image files are allowed", false));
//   }
//   cb(null, true);
// };

// const upload = multer({
//     storage: storage,
//     fileFilter: fileFilter,
//     limits: {
//         fileSize: 5 * 1024 * 1024,
//     },
// });
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = upload;