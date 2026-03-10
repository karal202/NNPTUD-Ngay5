const express = require('express');
let router = express.Router();
let userSchema = require('../schemas/users');

// GET all users (with optional username query)
router.get('/', async (req, res) => {
  try {
    let filter = { isDeleted: false };
    if (req.query.username) {
      filter.username = { $regex: req.query.username, $options: 'i' }; // Includes (case insensitive)
    }
    let users = await userSchema.find(filter).populate('role');
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// GET user by ID
router.get('/:id', async (req, res) => {
  try {
    let user = await userSchema.findOne({ _id: req.params.id, isDeleted: false }).populate('role');
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// CREATE user
router.post('/', async (req, res) => {
  try {
    let newUser = new userSchema(req.body);
    await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// UPDATE user
router.put('/:id', async (req, res) => {
  try {
    let user = await userSchema.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      req.body,
      { new: true }
    );
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send(user);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// DELETE (soft delete) user
router.delete('/:id', async (req, res) => {
  try {
    let user = await userSchema.findOne({ _id: req.params.id, isDeleted: false });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    user.isDeleted = true;
    await user.save();
    res.send({ message: "User deleted successfully", user });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// 2) POST /enable truyền lên email và username nếu thông tin đúng thì chuyển status về true
router.post('/enable', async (req, res) => {
  const { email, username } = req.body;
  try {
    let user = await userSchema.findOne({ email, username, isDeleted: false });
    if (!user) {
      return res.status(404).send({ message: "Thông tin email hoặc username không đúng" });
    }
    user.status = true;
    await user.save();
    res.send({ message: "Status enabled successfully", user });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// 3) POST /disable truyền lên email và username nếu thông tin đúng thì chuyển status về false
router.post('/disable', async (req, res) => {
  const { email, username } = req.body;
  try {
    let user = await userSchema.findOne({ email, username, isDeleted: false });
    if (!user) {
      return res.status(404).send({ message: "Thông tin email hoặc username không đúng" });
    }
    user.status = false;
    await user.save();
    res.send({ message: "Status disabled successfully", user });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
