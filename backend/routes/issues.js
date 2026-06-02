const express=require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { auth } = require("../middlewares/authentication");
const {Issue} = require("../models/Issue");
const { User } = require("../models/User");
const Notification = require("../models/Notification");
const { sendNotificationEmail } = require("../utils/mailer");
const { buildIssueCreatedContent } = require("../utils/notificationContent");

const geocodeAddress = async (address) => {
    const query = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "UrbanPulse/1.0 (Civic issue geocoding)"
            },
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (!response.ok) {
            throw new Error("Geocoding request failed");
        }

        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
            return null;
        }

        const lat = Number(data[0].lat);
        const lon = Number(data[0].lon);

        if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
            return null;
        }

        return { latitude: lat, longitude: lon };
    } catch (error) {
        clearTimeout(timeout);
        if (error.name === 'AbortError') {
            throw new Error("Geocoding request timed out");
        }
        throw error;
    }
};

router.post("/", async (req,res)=>{

    const userId = req.user.userId;
    const {title, category, priority, description, address, latitude, longitude, remarks ,images} = req.body;

    let parsedLatitude = latitude === "" || latitude === undefined ? undefined : Number(latitude);
    let parsedLongitude = longitude === "" || longitude === undefined ? undefined : Number(longitude);

    if (Number.isNaN(parsedLatitude) || Number.isNaN(parsedLongitude)) {
        return res.status(400).json({ message: "Latitude/Longitude must be valid numbers" });
    }

    if (parsedLatitude === undefined || parsedLongitude === undefined) {
        try {
            const geocoded = await geocodeAddress(address);
            if (!geocoded) {
                return res.status(400).json({
                    message: "Location Error",
                    reason: "Unable to determine coordinates from the provided address. Please provide a clearer address (e.g., street address with city) or manually enter latitude/longitude."
                });
            }
            parsedLatitude = geocoded.latitude;
            parsedLongitude = geocoded.longitude;
        } catch (error) {
            console.error("Geocoding error:", error.message);
            if (error.message.includes("timed out")) {
                return res.status(504).json({
                    message: "Location service unavailable",
                    reason: "Address lookup service is temporarily slow. Please provide coordinates manually or try again."
                });
            }
            return res.status(500).json({
                message: "Location lookup failed",
                reason: "Could not process your address. Please manually enter latitude/longitude or try a different address format."
            });
        }
    }

    const normalizedRemarks = typeof remarks === "string" && remarks.trim()
        ? [{ text: remarks.trim(), addedBy: userId }]
        : [];

    const normalizedImages = Array.isArray(images)
        ? images.filter((image) => typeof image === "string" && image.trim())
        : [];

    const issue = new Issue({
        title,
        category,
        priority,
        description,
        location: {
            address,
            latitude: parsedLatitude,
            longitude: parsedLongitude,
        },
        remarks: normalizedRemarks,
        images: normalizedImages,
        reportedBy:userId
    });

    try {
        const savedIssue = await issue.save();
        const [reporter, admins] = await Promise.all([
            User.findById(userId).select("email username"),
            User.find({ role: "admin", isActive: true }).select("_id email username"),
        ]);
        const content = buildIssueCreatedContent(savedIssue);
        const notifications = [
            new Notification({
                recipient: userId,
                sender: userId,
                issue: savedIssue._id,
                type: "Issue created",
                message: content.notification
            })
        ];

        notifications.push(...admins.map((admin) => new Notification({
                recipient: admin._id,
                sender: userId,
                issue: savedIssue._id,
                type: "Issue created",
                message: content.adminNotification
            })));

        await Promise.all(notifications.map((notification) => notification.save()));

        res.status(201).json({ message: "Issue created successfully", issue: savedIssue });

        // Send emails asynchronously (non-blocking)
        Promise.all([
            sendNotificationEmail({
                to: reporter?.email,
                subject: content.subject,
                message: content.message,
                html: content.html,
            }),
            ...admins.map((admin) => sendNotificationEmail({
                to: admin.email,
                subject: `New civic issue reported: ${savedIssue.title}`,
                message: content.adminNotification,
                html: content.html,
            })),
        ]).catch((err) => console.error("Error sending emails:", err));
    } catch (err) {
        console.error("Error creating issue:", err);

        if (err.message.includes("timed out")) {
            return res.status(504).json({
                message: "Request timeout",
                reason: "The request took too long. Please try again or provide coordinates manually."
            });
        }

        res.status(400).json({
            message: "Failed to create issue",
            reason: err.message
        });
    }
    });


router.get("/", async (req,res)=>{
    const userId = req.user.userId;
    const role = req.user.role;

    try {
        if (role === "user") {
            const issues = await Issue.find({reportedBy:userId}).sort({ createdAt: -1 });
            res.status(200).json( issues );
        }
        else if (role === "worker") {
            const issues = await Issue.find({assignedTo:userId}).sort({ createdAt: -1 });
            res.status(200).json( issues );
        }
        else if (role === "admin") {
            const issues = await Issue.find({}).sort({ createdAt: -1 });
            res.status(200).json( issues );
        }
        else {
            return res.status(403).json({ message: "Forbidden" });
        }
        
    }catch(error){
        res.status(500).json({ message: "Failed to fetch issues", reason: error.message });
    }
    });

router.get('/statistics', async (req, res) => {
    const userId = req.user.userId;
    const role = req.user.role;
    try{
        const userObjectId = new mongoose.Types.ObjectId(userId);
        if(role==="user"){
            const totalIssues = await Issue.countDocuments({ reportedBy: userObjectId });
            const statusDistribution = await Issue.aggregate([
                { $match: { reportedBy:  userObjectId } },
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ]);
            const categoryDistribution = await Issue.aggregate([
                { $match: { reportedBy: userObjectId } },
                { $group: { _id: "$category", count: { $sum: 1 } } }
            ]);
            res.status(200).json({ totalIssues, statusDistribution, categoryDistribution });
        }
        else if(role==="worker"){
            const totalIssues = await Issue.countDocuments({ assignedTo: userObjectId });
            const statusDistribution = await Issue.aggregate([
                { $match: { assignedTo:  userObjectId } },
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ]);
            const categoryDistribution = await Issue.aggregate([
                { $match: { assignedTo: userObjectId } },
                { $group: { _id: "$category", count: { $sum: 1 } } }
            ]);
            res.status(200).json({ totalIssues, statusDistribution, categoryDistribution });
        }
        else if(role==="admin"){
                const totalIssues = await Issue.countDocuments();
            const statusDistribution = await Issue.aggregate([
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ]);
            const categoryDistribution = await Issue.aggregate([
                { $group: { _id: "$category", count: { $sum: 1 } } }
            ]);
            res.status(200).json({ totalIssues, statusDistribution, categoryDistribution });
        }
        else{
            res.status(403).json({ message: "Forbidden" });
        }
    }
    catch(error){
        res.status(500).json({ message: "Failed to fetch statistics", reason: error.message });
    }
    });

router.get('/:issueId', async (req, res) => {
    const { issueId } = req.params;
    const userId = req.user.userId;
    const role = req.user.role;

    if (!mongoose.Types.ObjectId.isValid(issueId)) {
        return res.status(400).json({ message: "Invalid issue id" });
    }

    try{
        const issue = await Issue.findById(issueId);
        if(!issue){
            return res.status(404).json({ message: "Issue not found" });
        }

        if(role === "user" && issue.reportedBy.toString() !== userId){
            return res.status(403).json({ message: "Forbidden" });
        }
        if(role === "worker" && issue.assignedTo?.toString() !== userId){
            return res.status(403).json({ message: "Forbidden" });
        }

        res.status(200).json(issue);
    }catch(error){
        res.status(500).json({ message: "Failed to fetch issue", reason: error.message });
    }
});

module.exports = {IssueRouter: router};
