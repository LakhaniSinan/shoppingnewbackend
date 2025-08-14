const User = require("../../model/user/userModel");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../../utilities/email");
const {
  successHelper,
  errorHelper,
  hashPassword,
  generateToken,
  signToken,
} = require("../../utilities/helpers");

// Register new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("Request body:", req.body);

    if (!name || !email || !password)
      return errorHelper(res, null, "All fields are required", 400);

    const existingUser = await User.findOne({ email });
    console.log("Existing user:", existingUser);

    if (existingUser)
      return errorHelper(res, null, "Email already registered", 400);

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    console.log("New user created:", newUser);

    const token = generateToken(newUser);
    return successHelper(
      res,
      { user: newUser, token },
      "User registered successfully",
      201
    );
  } catch (error) {
    console.error(error);
    return errorHelper(res, error, "Registration failed", 500);
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return errorHelper(res, null, "Email and password required", 400);

    const user = await User.findOne({ email }).select("+password");
    if (!user) return errorHelper(res, null, "User not found", 404);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return errorHelper(res, null, "Invalid credentials", 401);

    const token = generateToken(user);
    user.password = undefined;

    return successHelper(res, { user, token }, "Login successful");
  } catch (error) {
    return errorHelper(res, error, "Login failed", 500);
  }
};

// Update user info
const updateUser = async (req, res) => {
  const id = req.params.id;
  try {
    const updates = { ...req.body };
    if ("password" in updates) delete updates.password;
    if ("role" in updates) delete updates.role;

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) return errorHelper(res, null, "User not found", 404);

    return successHelper(res, updatedUser, "User updated successfully");
  } catch (error) {
    return errorHelper(res, error, "Update failed", 500);
  }
};

// // Forgot password → send email with reset link
// const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//     if (!email) return errorHelper(res, null, "Email required", 400);

//     const user = await User.findOne({ email });
//     if (!user) return errorHelper(res, null, "User not found", 404);

//     const resetToken = signToken({ id: user._id });
//     user.resetPasswordToken = crypto
//       .createHash("sha256")
//       .update(resetToken)
//       .digest("hex");
//     user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 mins
//     await user.save({ validateBeforeSave: false });

//     const resetURL = `${req.protocol}://${req.get(
//       "host"
//     )}/api/user/reset/${resetToken}`;
//     const message = `Click this link to reset your password:\n\n${resetURL}`;

//     await sendEmail(user.email, "Password Reset Request", message);

//     return successHelper(res, null, "Reset link sent to email");
//   } catch (error) {
//     return errorHelper(res, error, "Failed to send reset email", 500);
//   }
// };

// // Reset password using token
// const resetPassword = async (req, res) => {
//   try {
//     const { token } = req.params;
//     const { newPassword } = req.body;

//     const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

//     const user = await User.findOne({
//       resetPasswordToken: hashedToken,
//       resetPasswordExpire: { $gt: Date.now() },
//     });

//     if (!user) return errorHelper(res, null, "Invalid or expired token", 400);

//     user.password = await hashPassword(newPassword);
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;

//     await user.save();

//     return successHelper(res, null, "Password reset successfully");
//   } catch (error) {
//     return errorHelper(res, error, "Reset password failed", 500);
//   }
// };

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    if (!users.length) return errorHelper(res, null, "No users found", 404);

    return successHelper(res, users, "Users fetched successfully");
  } catch (error) {
    return errorHelper(res, error, "Failed to fetch users", 500);
  }
};

const getUsersById = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id).select("-password");
    if (!user) return errorHelper(res, null, "User not found", 404);

    return successHelper(res, user, "Users fetched successfully");
  } catch (error) {
    return errorHelper(res, error, "Failed to fetch user", 500);
  }
};

const changePassword = async (req, res) => {
  const id = req.params.id;
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(id).select("+password");

    if (!user) return errorHelper(res, null, "User not found", 404);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return errorHelper(res, null, "Old password incorrect", 400);

    user.password = await hashPassword(newPassword);
    await user.save();

    return successHelper(res, null, "Password changed successfully");
  } catch (error) {
    return errorHelper(res, error, "Failed to change password", 500);
  }
};

const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    let user = await User.findById(id);
    console.log("User found:", user);
    if (!user) {
      return errorHelper(res, null, "User not found", 404);
    }

    if (user.role === "admin")
      return errorHelper(res, null, "Cannot delete admin user", 403);
  
    const deletingUser = await User.findByIdAndDelete(id);
    console.log("User deleted successfully:", deletingUser);
   
    return successHelper(res, user, "User deleted successfully");
  } catch (error) {
    console.log("Error deleting user:", error);
    return errorHelper(res, error, "Delete failed", 500);
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUser,
  // forgotPassword,
  // resetPassword,
  changePassword,
  deleteUser,
  getUsers,
  getUsersById,
};
