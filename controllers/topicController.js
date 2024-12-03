const asyncErrorHandler = require('../utils/asyncErrorHandler');
const CustomError = require('../utils/CustomError');
const Topic = require('./../model/topicModel');


exports.createTopic = asyncErrorHandler(async (req, res, next) => {
    const newTopic = await Topic.create({
        title: req.body.title,
        description: req.body.description,
        category: req.body.categoryId
    });
    const populatedTopic = await newTopic.populate('category');
    res.status(201).json({
        status: "success",
        message: "Category created successfully",
        data: {
            topic: populatedTopic,
        },
    });
});

exports.getAllTopics = asyncErrorHandler(async(req, res, next) =>{
    const topics = await Topic.find()
        .populate('category');
    if (!topics) {
        const error = new CustomError('Topic is empty', 404);
        return next(error);
    }
    res.status(200).json({
        status: "success",
        data: {
            topics,
        }
    })
})

exports.getAllTopicsByCategory = asyncErrorHandler(async (req, res, next) => {

    const topics = await Topic.find({ category: req.params.id });
      if (!topics) {
        const error = new CustomError("Topic is empty", 404);
        return next(error);
      }
    res.status(200).json({
      status: "success",
      data: {
        topics,
      },
    });
})


exports.updateTopic = asyncErrorHandler(async (req, res, next) => {
    const updatedTopic = await Topic.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTopic) {
        const error = new CustomError('Topic not found', 404);
        return next(error);
    }

    res.status(200).json({
        status: "success",
        message: "Topic updated successfully",
        data: {
            topic: updatedTopic
        }
    })
});

exports.deleteTopic = asyncErrorHandler(async (req, res, next) => {
    await Topic.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      message: "Topic deleted Successfully",
    });
})