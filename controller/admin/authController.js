const Admin = require("../../model/admin/adminModel");
const bcrypt = require("bcryptjs");
const {
  successHelper,
  errorHelper,
  hashPassword,
  generateToken,
} = require("../../utilities/helpers");

// Register admin
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return errorHelper(res, null, "All fields are required", 400);

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin)
      return errorHelper(res, null, "Email already registered", 400);

    const hashedPassword = await hashPassword(password);
    const newAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(newAdmin);

    return successHelper(
      res,
      { admin: newAdmin, token },
      "Admin registered successfully",
      201
    );
  } catch (error) {
    console.error(error);
    return errorHelper(res, error, "Admin registration failed", 500);
  }
};

// Login admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return errorHelper(res, null, "Email and password required", 400);

    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) return errorHelper(res, null, "Admin not found", 404);

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return errorHelper(res, null, "Invalid credentials", 401);

    const token = generateToken(admin);
    admin.password = undefined;

    return successHelper(res, { admin, token }, "Admin login successful");
  } catch (error) {
    return errorHelper(res, error, "Admin login failed", 500);
  }
};

const changePassword = async (req, res) => {
  const id = req.params.id;
  try {
    const { oldPassword, newPassword } = req.body;
    const admin = await Admin.findById(id).select("+password");

    if (!oldPassword || !newPassword)
      return errorHelper(res, null, "Old and new passwords are required", 400);

    if (!admin) return errorHelper(res, null, "Admin not found", 404);

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) return errorHelper(res, null, "Old password incorrect", 400);

    admin.password = await hashPassword(newPassword);
    await admin.save();

    return successHelper(res, null, "Password changed successfully");
  } catch (error) {
    return errorHelper(res, error, "Failed to change password", 500);
  }
};

module.exports = { registerAdmin, loginAdmin, changePassword };
