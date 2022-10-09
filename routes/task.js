const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const user = require('../models/User');
const router = express.Router();

const passport = require('passport');

require('../middleware/passports')(passport);

router.get('/fetchtask',passport.authenticate('jwt',{session:false}),async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
})

router.post('/addtask', passport.authenticate('jwt',{session:false}), [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
], async (req, res) => {
    try {
        const { title, desc, assignedTo, deadline,assignedAt,assignedBy } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const task = new Task({
            title, desc, assignedTo, deadline,assignedAt,assignedBy: req.user.id
        })
        const saveTask = await task.save();
        res.json(saveTask)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
})

router.put('/updatetask/:id', passport.authenticate('jwt',{session:false}), async (req, res) => {
    const { title, desc, assignedTo, deadline } = req.body;
    try {
        const newTask = {};
        if (title) newTask.title = title;
        if (desc) newTask.desc = desc;
        if (assignedTo) newTask.assignedTo = assignedTo;
        if (deadline) newTask.deadline = deadline;

        let task = await Task.findById(req.params.id);
        console.log(task);
        if (!task)
            return res.status(404).send("Not Found!");

        task = await Task.findByIdAndUpdate(req.params.id, { $set: newTask }, { new: true });
        res.json({ task });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})
router.delete('/deletetask/:id', passport.authenticate('jwt',{session:false}), async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);
        if (!task)
            return res.status(404).send("Not Found!");

        task = await Task.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note has been deleted", task: task });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
})

module.exports = router;