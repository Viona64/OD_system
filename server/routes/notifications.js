import express from "express";
import Notification from "../models/Notification.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    return res.json(notifications);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
router.put("/:id/read", protect, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Verify user ownership
    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to access this notification" });
    }

    notification.isRead = true;
    await notification.save();

    return res.json(notification);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
