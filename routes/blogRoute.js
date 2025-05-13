const express = require("express");
const router = express.Router();
const blogController = require("./../controllers/blogController");
const middlewaresAdmin = require("../middlewares/protectAdminRoute");
const { upload, uploadImageToS3 } = require("../middlewares/imageUpload");


router.route("/blog").post(middlewaresAdmin.protectAdmin, upload.single("image"), uploadImageToS3, blogController.createBlog);

router.route("/blog/toggle/:id").patch(middlewaresAdmin.protectAdmin, blogController.toggleBlogStatus);

router.route("/blogs").get(blogController.getBlogs);
router.route("/blog/:id").get(blogController.getBlogById);
router.route("/blog-previews").get(blogController.getBlogPreviews)

module.exports = router;
