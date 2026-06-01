const express = require("express");
const mongoose = require("mongoose");
const { User } = require("../models/User");
const { Issue } = require("../models/Issue");
const Notification = require("../models/Notification");
const { sendNotificationEmail } = require("../utils/mailer");
const { buildIssueAssignedContent } = require("../utils/notificationContent");

const router = express.Router();

// GET /api/admin/workers - list all active workers
router.get("/workers", async (_req, res, next) => {
  try {
    const workers = await User.find({ role: "worker", isActive: true })
      .select("_id username email role");
    res.status(200).json(workers);
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/assign/:issueId - assign an issue to a worker
router.put("/assign/:issueId", async (req, res, next) => {
  try {
    const { issueId } = req.params;
    const { workerId, instructions, priority } = req.body;

    if (!mongoose.Types.ObjectId.isValid(issueId)) {
      return res.status(400).json({ message: "Invalid issue id" });
    }
    if (!mongoose.Types.ObjectId.isValid(workerId)) {
      return res.status(400).json({ message: "Invalid worker id" });
    }

    const worker = await User.findOne({ _id: workerId, role: "worker", isActive: true });
    if (!worker) {
      return res.status(404).json({ message: "Worker not found or inactive" });
    }

    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    issue.assignedTo = workerId;
    issue.status = "Assigned";
    if (instructions) issue.instructions = instructions;
    if (priority) issue.priority = priority;

    await issue.save();

    const citizen = await User.findById(issue.reportedBy).select("email username");
    const content = buildIssueAssignedContent(issue, worker, instructions);

    const notification = new Notification({
      recipient: workerId,
      sender: req.user.userId,
      issue: issue._id,
      type: "Issue Assigned",
      message: content.workerNotification,
    });

    const citizenNotification = new Notification({
      recipient: issue.reportedBy,
      sender: req.user.userId,
      issue: issue._id,
      type: "Issue Assigned",
      message: content.citizenNotification,
    });

    await Promise.all([notification.save(), citizenNotification.save()]);
    await Promise.all([
      sendNotificationEmail({
        to: worker.email,
        subject: content.workerSubject,
        message: content.workerMessage,
        html: content.workerHtml,
      }),
      sendNotificationEmail({
        to: citizen?.email,
        subject: content.citizenSubject,
        message: content.citizenMessage,
        html: content.citizenHtml,
      }),
    ]);

    res.status(200).json({ message: "Issue assigned successfully", issue });
  } catch (error) {
    next(error);
  }
});

module.exports = { AdminRouter: router };
