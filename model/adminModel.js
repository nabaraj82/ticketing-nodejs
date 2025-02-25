const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
        unique: [true, "email already exist"],
        maxlength: [50, "email must not exceed more than 50 characters"],
        trim: true,
        required: [true, "email is required"],
    },
    sendEmail: {
      type: Boolean,
      default: false,
    },
    // username: {
    //   type: String,
    //   unique: [true, "username already exist"],
    //   maxlength: [30, "username must not exceed more than 30 characters"],
    //   trim: true,
    //   required: [true, "username is required"],
    // },
    role: {
      type: String,
      enum: ["super-admin", "admin", "operator"],
      default: "operator",
      required: [true, "role is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      select: false,
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

adminSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

adminSchema.methods.comparePasswordInDb = async function (pass, passDB) {
  return await bcrypt.compare(pass, passDB);
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
