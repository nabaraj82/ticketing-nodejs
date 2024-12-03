const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'name is required']
        },
        username: {
            type: String,
            required: [true, 'username is required']
        },
        mobileNo: {
            type: String,
            required: [true, 'mobile number is required']
        },
        category: {
            type: String,
            required: [true, 'category is required']
        },
        topic: {
            type: String,
            required: [true, 'topic is required']
        },
        description: {
            type: String,
            required: [true, 'description is required']
        },
        imageURL: {
            type: String
        },
        status: {
            type: String,
            enum: ['pending', 'opened', 'resolved'],
            default: 'pending',
        }

    },
    {
        timestamps: true,
    }
);

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;