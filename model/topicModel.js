const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema(
  {
    title: {
          type: String,
        unique: [true, "Topic already exist"],
      maxlength: [50, "Topic title must not exceed more than 50 characters"],
      trim: true,
        },
        description: {
            type: String,
      },
    category: {
      type: mongoose.Schema.Types.ObjectId, // Reference to Category model
      ref: "Category", // This tells Mongoose to expect a reference to the Category collection
      required: true, // Ensure each topic is associated with a category
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Topic = mongoose.model("Topic", topicSchema);
module.exports = Topic;
