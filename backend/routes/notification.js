const express = require('express');
const  {auth} = require('../middlewares/authentication');
const Notification = require('../models/Notification');

const router  = express.Router();

router.post('/',auth , async(req,res)=>{
    const senderId = req.user.userId;
    const {recipient, issue, type, message} = req.body;
    try{
        const notification = new Notification({ recipient, sender: senderId, issue, type, message});
        await notification.save();
        res.status(201).json({message: "Notification created successfully", notification});
    }
    catch(error){   
        res.status(500).json({message: "Failed to create notification", error: error});
    }
});

router.get('/',auth, async(req,res)=>{
    const userId = req.user.userId;
    try{
        const notifications = await Notification.find({recipient: userId})
        .populate('sender', 'username email')
        .populate('issue', 'title');
        res.status(200).json(notifications);
    }
    catch(error){
        res.status(500).json({message: "Failed to retrieve notifications", error: error});
    }

});
