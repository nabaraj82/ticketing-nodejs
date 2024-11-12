const mongoose = require("mongoose");


const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
        maxlength: [50, "Topic title must not exceed more than 50 characters"],
    unique: [true, "Topic already exists"]
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        unique: [true, "Cagtegory already exists"],
        maxlength: [50, "Category name must not exceed more than 50 characters"],
        trim: true,
    },
    topics: {
        type: [topicSchema]
    }
})

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;