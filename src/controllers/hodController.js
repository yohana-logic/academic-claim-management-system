import HOD from "../Schema/hodSchema.js";

export const getAllHods = async (req, res) => {
  try {
    const hods = await HOD.find().select("-password");
    res.json({ success: true, count: hods.length, data: hods });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to load HOD records.", error: err.message });
  }
};

export const getHodById = async (req, res) => {
  try {
    const hod = await HOD.findById(req.params.id).select("-password");
    if (!hod) return res.status(404).json({ success: false, message: "HOD not found." });
    res.json({ success: true, data: hod });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching HOD.", error: err.message });
  }
};

export const createHod = async (req, res) => {
  try {
    const { name, phone, email, department, password } = req.body;
    if (!name || !phone || !email || !department ) {
      return res.status(400).json({ success: false, message: "name, phone, email and department are required." });
    }

    const hod = new HOD({ name, phone, email, department, password: password || "ulk@123" });
    await hod.save();

    const saved = hod.toObject();
    delete saved.password;
    res.status(201).json({ success: true, message: "HOD created successfully.", data: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to create HOD.", error: err.message });
  }
};

export const updateHod = async (req, res) => {
  try {
    const { name, phone, department } = req.body;
    const updateData = {};
    if (name)       updateData.name       = name.trim();
    if (phone)      updateData.phone      = phone.trim();
    if (department) updateData.department = department.trim();

    const hod = await HOD.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!hod) return res.status(404).json({ success: false, message: "HOD not found." });
    res.json({ success: true, message: "HOD updated successfully.", data: hod });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update HOD.", error: err.message });
  }
};

export const resetHodPassword = async (req, res) => {
  try {
    const hod = await HOD.findById(req.params.id);
    if (!hod) return res.status(404).json({ success: false, message: "HOD not found." });

    hod.password = "ulk@123";
    await hod.save();

    res.json({ success: true, message: "HOD password reset to default (ulk@123)." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to reset password.", error: err.message });
  }
};

export const deleteHod = async (req, res) => {
  try {
    const hod = await HOD.findByIdAndDelete(req.params.id);
    if (!hod) return res.status(404).json({ success: false, message: "HOD not found." });
    res.json({ success: true, message: "HOD deleted successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete HOD.", error: err.message });
  }
};
