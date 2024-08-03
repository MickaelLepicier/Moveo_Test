const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  const { title, description, status, projectId } = req.body;

  try {
    const newTask = new Task({ title, description, status, projectId });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTasks = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const tasks = await Task.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Task.countDocuments();

    res.json({
      tasks,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  const { title, description, status, projectId } = req.body;

  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, projectId },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
