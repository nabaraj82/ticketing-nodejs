const Admin = require("../model/adminModel");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/CustomError");
const bcrypt = require("bcryptjs");

exports.createUser = asyncErrorHandler(async (req, res, next) => {
  const { username, password, role } = req.headers;
  const admin = await Admin.find({ username });
  if (admin.length > 0) {
    next(new CustomError("username already exists.", 409));
    return;
  }

  if (role === 'super-admin') {
    res.status(401).json({
      status: 'failed',
      message: "you are not authorized to create super-admin"
    });
    return;
  }

  const user = new Admin({ username, password, role });

  const newUser = await user.save();
  const userWithoutPassword = newUser.toObject();
  delete userWithoutPassword.password;

  res.status(201).json({
    status: "success",
    message: "new user created successfully",
    data: {
      user: userWithoutPassword,
    },
  });
});

exports.updateUserPassword = asyncErrorHandler(async (req, res, next) => {
  const { id, password } = req.body;
  if (!(await Admin.findById(id))) {
    next(new CustomError("user does not exist", 404));
    return;
  }
  const hashedPassword = await bcrypt.hash(password, 12);

  const updatedUser = await Admin.findByIdAndUpdate(
    id,
    { password: hashedPassword },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "password updated successfully",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteUser = asyncErrorHandler(async (req, res, next) => {
  const admin = await Admin.findById(req.body.id);
  if (!admin) {
    res.status(404).json({
      status: "failed",
      message: "user not found",
    });
    return;
  }
  if (admin.role === "super-admin") {
    res.status(401).json({
      status: "failed",
      message: "user cannot delete their own account",
    });
    return;
  }
  await Admin.findByIdAndDelete(req.body.id);
  res.status(204).json({
    status: "success",
    message: "user deleted successfully",
  });
});
