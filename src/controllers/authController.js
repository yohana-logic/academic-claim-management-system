import jwt from "jsonwebtoken";
import Student from "../Schema/studentSchema.js";
import HOD from "../Schema/hodSchema.js";

const JWT_SECRET  = process.env.JWT_SECRET  || "claim_secret_key_2024";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";

const generateToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "email and password are required." });
    }

    let user;

    const normalizedEmail = email.trim().toLowerCase();
    user = await Student.findOne({ email: normalizedEmail });

    if (!user) {
      user = await HOD.findOne({ email: normalizedEmail });
    }

    if (!user) {
      return res.status(401).json({ success: false, message: "email or password is incorrect." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "email or password is incorrect." });
    }

    const tokenPayload = {
      id:   user._id,
      role: user.role,
      ...(user.role === "student"
        ? { roll: user.roll, name: user.name }
        : { name: user.name, department: user.department }),
    };

    const token = generateToken(tokenPayload);

    const userData = user.toObject();
    delete userData.password;

    res.json({
      success: true,
      message: "Login successful.",
      token,
      user: userData,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Login failed.", error: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Logout successful.",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Logout failed.", error: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { id, role, oldPassword, newPassword } = req.body;
    if (!id || !role || !oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "id, role, oldPassword and newPassword are required." });
    }

    const Model = role === "hod" ? HOD : Student;
    const user  = await Model.findById(id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) return res.status(401).json({ success: false, message: "Old password is incorrect." });

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Password changed successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to change password.", error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { id, role } = req.body;
    if (!id || !role) return res.status(400).json({ success: false, message: "id and role are required." });

    const Model = role === "hod" ? HOD : Student;
    const user  = await Model.findById(id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    user.password = "ulk@123";  
    await user.save();

    res.json({ success: true, message: "Password reset to default (ulk@123)." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to reset password.", error: err.message });
  }
};
