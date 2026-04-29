// wastageModel.js

import mongoose from 'mongoose';

// Define the Wastage Schema
const wastageSchema = new mongoose.Schema(
    {
        wastageData: {
            type: [Number],   // Array of numbers
            validate: [arrayLimit, 'Wastage data can only contain up to 31 entries'],  // Custom validator
            default: []  // Initialize as an empty array
        }
    },
    {
        timestamps: true
    }
);

function arrayLimit(val) {
    return val.length <= 31;
}


const Wastage = mongoose.model('Wastage', wastageSchema);

export default Wastage;
