const { Schema, model } = require('mongoose');

const issueSchema = new Schema({
    title:{
        type: String,
        required: true,
        trim: true,
    },
    description:{
        type: String,
        required: true,
        trim: true,
    },
    status:{
        type: String,
        enum: ['Open', 'In Progress', 'Closed'],
        default: 'Open',
        index: true, // for faster queries
    },
    reportedBy:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true, // for faster queries
    },
    category:{
        type: String,
        enum: ['Plumbing', 'Electrical', 'Carpentry', 'Cleaning', 'Other'],
        required: true,
    },
    priority:{
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Low',
    },
    location: {
      address: { type: String, required: true },
      latitude: { type: Number },
      longitude: { type: Number },
    },
    images:{
        type: [String], // Array of image URLs
        default: [],

    },
    assignedTo:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true, // for faster queries
    },

     remarks: [
      {
        text: String,
        addedBy: { type: Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
      },
    ]
    
},{
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

const Issue = model('Issue', issueSchema);
module.exports = { Issue };