const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const { Issue } = require('../models/Issue');
const { User } = require('../models/User');
const Notification = require('../models/Notification');
const { sendNotificationEmail } = require('../utils/mailer');
const { buildStatusUpdatedContent } = require('../utils/notificationContent');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image uploads are allowed'));
    }
    cb(null, true);
  },
});

router.put('/update/:issueId', upload.single('image'), async (req, res, next) => {
  try {
    const { issueId } = req.params;
    const { status, notes } = req.body;
    const workerId = req.user.userId;

    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }
    if (!issue.assignedTo || issue.assignedTo.toString() !== workerId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const current = issue.status;
    const allowedTransitions = {
      Assigned: ['In Progress'],
      'In Progress': ['Resolved'],
      Resolved: [],
      Closed: [],
      Pending: ['Assigned', 'In Progress'],
    };

    let statusChanged = false;

    if (status && status !== current) {
      const allowedNext = allowedTransitions[current] || [];
      if (!allowedNext.includes(status)) {
        return res.status(400).json({ message: 'Invalid status transition' });
      }
      issue.status = status;
      statusChanged = true;
    }

    if (notes) {
      issue.remarks.push({ text: notes, addedBy: workerId });
    }

    if (req.file) {
      issue.proofImage = `/uploads/${req.file.filename}`;
    }

    await issue.save();

    const content = buildStatusUpdatedContent(issue, current, notes);
    const notificationType = content.type;
    const notifications = [];

    if (mongoose.Types.ObjectId.isValid(process.env.ADMIN_ID)) {
      notifications.push(
        new Notification({
          recipient: process.env.ADMIN_ID,
          sender: workerId,
          issue: issue._id,
          type: notificationType,
          message: content.adminNotification,
        })
      );
    }

    if (statusChanged && issue.reportedBy) {
      notifications.push(
        new Notification({
          recipient: issue.reportedBy,
          sender: workerId,
          issue: issue._id,
          type: notificationType,
          message: content.citizenNotification,
        })
      );
    }

    await Promise.all(notifications.map((notification) => notification.save()));

    if (statusChanged && issue.reportedBy) {
      const citizen = await User.findById(issue.reportedBy).select('email username');
      await sendNotificationEmail({
        to: citizen?.email,
        subject: content.subject,
        message: content.message,
        html: content.html,
      });
    }

    res.status(200).json({ message: 'Issue updated successfully', issue });
  } catch (error) {
    next(error);
  }
});

module.exports = { WorkerRouter: router };
