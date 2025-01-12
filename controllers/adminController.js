const Admin = require("../model/adminModel");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const bcrypt = require("bcryptjs");
const CustomError = require("../utils/CustomError");


exports.createUser = asyncErrorHandler(async (req, res, next) => {
  const { username, password, role, email } = req.body;

  if (await Admin.findOne({ username })) {
    res.status(409).json({
      status: "failed",
      message: "username already exists.",
    });
    return;
  }
  if (await Admin.findOne({ email })) {
    res.status(409).json({
      status: "failed",
      message: "email already exists.",
    });
    return;
  }
    if (role === "super-admin") {
      res.status(401).json({
        status: "failed",
        message: "Unauthorized: you cannot create admin or super-admin",
      });
      return;
  }
  if (role === 'admin' && req.admin.role !== 'super-admin') {
     res.status(401).json({
       status: "failed",
       message: "Unauthorized: you cannot create admin or super-admin",
     });
     return;
  }

  if (req.admin.role === 'operator') {
    res.status(401).json({
      status: "failed",
      message: "Unauthorized: you cannot create admin or super-admin",
    });
    return;
  }

  const user = new Admin({ username, password, role, email });
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

exports.fetchAllUsers = asyncErrorHandler(async(req, res, next) => {
  const users = await Admin.find({ role: { $ne: 'super-admin' } });
  res.status(200).json({
    status: "success",
    data: {
      total: users.length,
      users,
    }
  })
})
exports.updateUserPassword = asyncErrorHandler(async (req, res, next) => {
    const { id, password } = req.body;
    const user = await Admin.findById(id);
  if (!user) {
    next(new CustomError("user does not exist", 404));
    return;
  }
  if (req.admin.role === 'operator') {
     res.status(401).json({
       status: "failed",
       message: "Unauthorized: You are not allowed to perform this action",
     });
     return;
  }
    if (user.role === 'super-admin') {
        res.status(401).json({
          status: "failed",
          message: "Unauthorized: You cannot update the super-admin password",
        });
        return;
  }
  if (user.role === 'admin' && req.admin.role === 'admin') {
    res.status(401).json({
      status: "failed",
      message: "Unauthorized: you cannot update admin or super-admin password",
    });
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

exports.emailAlertUpdate = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await Admin.findById(id);
  if (!user) {
    res.status(404).json({
      status: "failed",
      message: "user not found",
    });
    return;
  }
  if (typeof req.body.sendEmail !== 'boolean') {
     res.status(403).json({
       status: "failed",
       message: "invalid agrument! required boolean.",
     });
     return;
  }
  const updatedUser = await Admin.findByIdAndUpdate(id, { sendEmail: req.body.sendEmail }, { new: true });
   res.status(200).json({
     status: "success",
     data: {
       user: updatedUser
     }
   });
})

exports.deleteUser = asyncErrorHandler(async (req, res, next) => {
  const admin = await Admin.findById(req.params.id);
  if (!admin) {
    res.status(404).json({
      status: "failed",
      message: "user not found",
    });
    return;
  }
  if (req.admin.role === 'operator') {
    res.status(401).json({
      status: "failed",
      message: "Unauthorized: You are not allowed to perform this action",
    });
  }
  if (admin.role === 'super-admin') {
    res.status(401).json({
      status: "failed",
      message: "Unauthorized: You cannot delete super-admin or admin",
    });
    return;
  }
  if (admin.role === "admin" && req.admin.role !== 'super-admin') {
    res.status(401).json({
      status: "failed",
      message: "Unauthorized: You cannot delete super-admin or admin",
    });
    return;
  }
  await Admin.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    message: "user deleted successfully",
  });
});





