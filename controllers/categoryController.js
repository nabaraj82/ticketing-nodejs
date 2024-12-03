const Category = require("../model/categoryModel");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");


exports.createCategory = asyncErrorHandler(async (req, res, next) => {
  const newCategory = await Category.create(req.body);
  res.status(201).json({
    status: "success",
    message: "Category created successfully",
    data: {
      category: newCategory,
    },
  });
});

exports.getAllCategory = asyncErrorHandler(async (req, res, next) => {
  const category = await Category.find();
  res.status(200).json({
    status: "success",
    data: {
      categories: category,
    },
  });
})

exports.updateCategory = asyncErrorHandler(async (req, res, next) => {
  const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });

  if (!updatedCategory) {
    const error = new CustomError('Category with given id is not found.', 404);
    return next(error);
  }
  res.status(200).json({
    status: "success",
    message: "Updated successfully",
    data: {
      category: updatedCategory
    }
  })
});

// exports.updateTopics = asyncErrorHandler(async (req, res, next) => {
//   const { categoryId, topicId } = req.params;
//   const category = await Category.findById(categoryId);
//   if (!category) {
//     const error = new CustomError('Category not found', 404);
//     return next(error);
//   }

//   const topic = category.topics.id(topicId);
//   if (!topic) {
//     const error = new CustomError('Topic not found', 404);
//     return next(error);
//   }
//   topic.title = req.body.title;
//   await category.save();
//   res.status(200).json({
//     status: "success",
//     message: "Topic updated successfully",
//     updatedTopic: topic,
//   });
// });

// exports.addTopic = asyncErrorHandler(async (req, res, next) => {
//   const category = await Category.findById(req.params.categoryId);

//   if (!category) {
//     const error = new CustomError("Category not found", 404);
//     return next(error);
//   }
//   if (!req.body.topics || req.body.topics.length === 0) {
//     const error = new CustomError("Please add atleaset one topic", 400);
//     return next(error)
//   }

//   const oldTopics = category.topics;
//   const newTopics = req.body.topics;
//   const filteredTopics = newTopics.filter(item => !oldTopics.some(existingTopic => existingTopic.title === item.title));
  
//   category.topics.push(...filteredTopics);
//   await category.save({ validateBeforeSave: true });
//   res.status(201).json({
//     message: "New topic added successfully",
//     topics: category.topics,
//   });
// });

exports.deleteCategory = asyncErrorHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    const error = new CustomError('Category not found', 404);
    return next(error);
  }
  await Category.findOneAndDelete({_id: req.params.id})
  res.status(204).json({
    status: "success",
    message: "Deleted Successfully",
  });
});

// exports.deleteTopic = asyncErrorHandler(async (req, res, next) => {
//   const { categoryId, topicId } = req.params;
//   const category = await Category.findById(categoryId);
//   if (!category) {
//     const error = new CustomError("Category not found", 404);
//     return next(error);
//   }
//   const topic = category.topics.id(topicId)
//   if (!topic) {
//     const error = new CustomError("Topic not found", 404);
//     return next(error);
//   }
//   category.topics.pull(topicId)

//   // Save the updated category document
//   await category.save();

//   // Send a success response
//   res.status(204).json({
//     success: true,
//     message: "Topic deleted successfully",
//   });
// })
