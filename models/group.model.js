import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            index: true,
            unique: true,
            lowercase: true,
            required: true,
        },
        logo: {
            url: {
                type: String,
                required: true,
            },
            publicId: {
                type: String,
                required: true,
            },
        },
        createdBy : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending",
        },
    },
    { timestamps: true }
);


export const Group = mongoose.model('Group', groupSchema);

