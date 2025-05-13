const Blog = require("../model/blogModel");

const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");
const s3 = require("./../aws-config");

exports.createBlog = asyncErrorHandler(async (req, res) => {
  const { title, excerpt, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      success: false,
      message: "Title and content are required",
      data: null,
    });
  }

  const blog = new Blog({
    title,
    excerpt,
    content,
    image: req.imageUrl || null, // Assuming middleware sets this
    isActive: true, // Default to active
  });

  await blog.save();

  // Structure response to match what your Redux thunk expects
  res.status(201).json({
    success: true,
    message: "Blog created successfully",
    data: blog, // This should match your Blog type in Redux
  });
});
exports.toggleBlogStatus = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  const blog = await Blog.findById(id);
  if (!blog) {
    return next(new CustomError("Blog not found", 404));
  }

  blog.isActive = !blog.isActive;
  const updatedBlog = await blog.save();

  res.status(200).json({
    status: "success",
    data: {
      _id: updatedBlog._id,
      title: updatedBlog.title,
      excerpt: updatedBlog.excerpt,
      content: updatedBlog.content,
      image: updatedBlog.image,
      isActive: updatedBlog.isActive,
      createdAt: updatedBlog.createdAt,
      updatedAt: updatedBlog.updatedAt,
    },
    message: "Blog status updated successfully",
  });
});

exports.getBlogs = asyncErrorHandler(async (req, res, next) => {
  const blogs = await Blog.find().sort({ createdAt: -1 }); // -1 for descending (newest first)

  res.status(200).json({
    success: true,
    count: blogs.length,
    data: blogs,
  });
});

exports.getBlogById = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  const blog = await Blog.findById(id);
  
  if (!blog) {
    return next(new CustomError("Blog not found", 404));
  }

  res.status(200).json({
    success: true,
    data: blog
  });
});

exports.getBlogPreviews = asyncErrorHandler(async (req, res, next) => {
  const blogs = await Blog.find({ isActive: true }) 
    .select("_id excerpt image") 
    .sort({ createdAt: -1 }); 

  res.status(200).json({
    success: true,
    count: blogs.length,
    data: blogs,
  });
});



