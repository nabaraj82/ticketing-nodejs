const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: [true, "Category already exists"],
      maxlength: [50, "Category name must not exceed more than 50 characters"],
      trim: true,
    },
    description: {
      type: String,
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

categorySchema.pre("findOneAndDelete", async function (next) {
    const categoryId = this.getQuery() && this.getQuery()._id;
    await mongoose.model("Topic").deleteMany({ category: categoryId });
    next();
  }
);
const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
