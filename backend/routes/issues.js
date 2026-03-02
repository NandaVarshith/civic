const express=require("express");
const router = express.Router();
const { auth } = require("../middlewares/authentication");
const {Issue} = require("../models/Issue");
const Notification = require("../models/Notification");
const mongoose = require("mongoose");

router.post("/", async (req,res)=>{

    const userId = req.user.userId;
    const {title, category, priority, description, address, latitude, longitude, remarks ,images} = req.body;

    const parsedLatitude = latitude === "" || latitude === undefined ? undefined : Number(latitude);
    const parsedLongitude = longitude === "" || longitude === undefined ? undefined : Number(longitude);

    if (Number.isNaN(parsedLatitude) || Number.isNaN(parsedLongitude)) {
        return res.status(400).json({ message: "Latitude/Longitude must be valid numbers" });
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

    const notification = new Notification({
        recipient: process.env.ADMIN_ID, sender: userId, issue, type: "Issue created", message: `New issue reported: ${title}`
    });


    try {
        const savedIssue = await issue.save();
        await notification.save();
        res.status(201).json({ message: "Issue created successfully", issue: savedIssue });
    } catch (err) {
        console.error("Error creating issue:", err);
        res.status(400).json({ message: "Failed to create issue", reason: err.message });
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

module.exports = {IssueRouter: router};