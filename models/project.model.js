import mongoose from 'mongoose';

// Location schema to store Google Maps location

const locationSchema = new mongoose.Schema({
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    zip: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
});


const projectSchema = new mongoose.Schema(
    {
        projectname: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        soccsvalue: {
            type : Number,
            required: true,
            min: 0,
            default : 0,
        },
        membercount : {
            type : Number,
            required: true,
            default : 0,
        },
        location : {
            type: locationSchema,
            required: true,
        },
        type : {
            type : String,
            required: true,
        },
        group_name : {
            type : String,
            required: true,
        },
        group_id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Group",  
            required: true,
        },
        image: {
            url: {
                type: String,
                required: true,
            },
            publicId: {
                type: String,
                required: true,
            },
        },
        remote : {
            type: String,
            required: true,
        },
        requestUser : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
        }],
        acceptedUser : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
        }],
        createdBy : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required: true,
        },
    },
    { timestamps: true }
);


export const Project = mongoose.model('Project', projectSchema);

