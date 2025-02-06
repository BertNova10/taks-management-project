const Task = require("../models/Task");

//create a new task
const createTask = async (req,res) => {
    const {title, description} = req.body;
    try {
        const task = await Task.create({ title, description, user: req.user.id });
        res.status(201).json({ message: 'Task created successfully', task });
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
};

// Get all tasks for the logged-in user
const getTasks = async (req, res) => {
    try {
      const tasks = await Task.find({ user: req.user.id });
      res.status(200).json(tasks);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  module.exports = { createTask, getTasks };
