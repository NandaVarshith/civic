const { Schema, model } = require('mongoose');
const notificationSchema = new Schema({
    recipient :{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sender:{
        type : Schema.Types.ObjectId,
        ref : 'User',
        required: true
    },
    issue:{
        type: Schema.Types.ObjectId,
        ref: 'Issue',
        required: true
    },
    type:{
        type: String,
        enum: ['Issue created', 'Issue Assigned', 'Issue Status Updated', 'Issue Resolved','Issue Closed'],
        required: true
    },
    message:{
        type: String,
    },
    isRead:{
        type: Boolean,
        default: false
    }
},{
    timestamps: true
    }

);

module.exports = model('Notification', notificationSchema);