const express = require('express');
let router = express.Router();
let roleSchema = require('../schemas/roles');
let userSchema = require('../schemas/users');

// GET all roles
router.get('/', async (req, res) => {
    try {
        let roles = await roleSchema.find({ isDeleted: false });
        res.send(roles);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// GET role by ID
router.get('/:id', async (req, res) => {
    try {
        let role = await roleSchema.findOne({ _id: req.params.id, isDeleted: false });
        if (!role) {
            return res.status(404).send({ message: "Role not found" });
        }
        res.send(role);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// CREATE role
router.post('/', async (req, res) => {
    try {
        let newRole = new roleSchema(req.body);
        await newRole.save();
        res.status(201).send(newRole);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// UPDATE role
router.put('/:id', async (req, res) => {
    try {
        let role = await roleSchema.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true }
        );
        if (!role) {
            return res.status(404).send({ message: "Role not found" });
        }
        res.send(role);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// DELETE (soft delete) role
router.delete('/:id', async (req, res) => {
    try {
        let role = await roleSchema.findOne({ _id: req.params.id, isDeleted: false });
        if (!role) {
            return res.status(404).send({ message: "Role not found" });
        }
        role.isDeleted = true;
        await role.save();
        res.send({ message: "Role deleted successfully", role });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// GET all users with a specific role ID
// request /roles/id/users
router.get('/:id/users', async (req, res) => {
    try {
        let users = await userSchema.find({ role: req.params.id, isDeleted: false });
        res.send(users);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
