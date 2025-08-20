const Event = require("../models/Event");

// ✅ Get all events for logged-in user
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({ user: req.user.id }).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

// ✅ Create new event
exports.createEvent = async (req, res) => {
  try {
    const { title, date, time } = req.body;

    if (!title || !date || !time) {
      return res.status(400).json({ error: "Title, date, and time are required" });
    }

    const event = await Event.create({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: "Failed to create event" });
  }
};

// ✅ Update event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!event) return res.status(404).json({ error: "Event not found" });

    res.json(event);
  } catch (err) {
    res.status(500).json({ error: "Failed to update event" });
  }
};

// ✅ Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!event) return res.status(404).json({ error: "Event not found" });

    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete event" });
  }
};