const express = require('express');
const Meeting = require('../models/Meeting');
const auth = require('../middleware/auth');

const router = new express.Router();

// Get all meetings for the logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const meetings = await Meeting.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(meetings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new meeting
router.post('/', auth, async (req, res) => {
    try {
        const { title, meetingLink, date, time } = req.body;
        
        if (!title || !meetingLink || !date || !time) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const meeting = new Meeting({
            userId: req.user._id,
            title,
            meetingLink,
            date,
            time
        });

        await meeting.save();

        // Check if meeting should start immediately
        const now = new Date();
        const currentDate = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
        const currentTime = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

        if (date < currentDate || (date === currentDate && time <= currentTime)) {
            meeting.status = 'Joining';
            await meeting.save();
            const axios = require('axios');
            axios.post('http://127.0.0.1:8000/bot/dispatch', {
                meeting_id: meeting._id.toString(),
                meeting_link: meeting.meetingLink
            }).catch(e => console.error('[Meetings API] Immediate dispatch failed:', e.message));
        }

        res.status(201).json(meeting);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get a specific meeting
router.get('/:id', auth, async (req, res) => {
    try {
        const meeting = await Meeting.findOne({ _id: req.params.id, userId: req.user._id });
        if (!meeting) {
            return res.status(404).json({ error: 'Meeting not found' });
        }
        res.json(meeting);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a meeting
router.delete('/:id', auth, async (req, res) => {
    try {
        const meeting = await Meeting.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!meeting) {
            return res.status(404).json({ error: 'Meeting not found' });
        }
        res.json({ message: 'Meeting deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update meeting status (Typically called by the Python AI Service, but secured here or handled internally)
// We will secure it later, for now we can update it if needed.
router.patch('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const meeting = await Meeting.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { status },
            { new: true }
        );
        if (!meeting) return res.status(404).json({ error: 'Meeting not found' });
        res.json(meeting);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
