const Role = require('../models/Role');

exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (err) { res.status(500).json(err); }
};

exports.createRole = async (req, res) => {
    try {
        const newRole = new Role(req.body);
        await newRole.save();
        res.status(201).json(newRole);
    } catch (err) { res.status(400).json(err); }
};

exports.updateRole = async (req, res) => {
    try {
        const updated = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) { res.status(400).json(err); }
};

exports.deleteRole = async (req, res) => {
    try {
        await Role.findByIdAndDelete(req.params.id);
        res.json({ message: "Xoá thành công Role" });
    } catch (err) { res.status(400).json(err); }
};
