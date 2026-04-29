import mongoose from "mongoose"

const MONGO_URL = 'mongodb+srv://pardume638be22:TQ5P62itS4uMYX4f@cluster0.ocqdk.mongodb.net/'
const DB_NAME = 'UMess'

export const connectDB = async()=>{
    await mongoose.connect(MONGO_URL+DB_NAME, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    })
    .then(()=>{
        console.log('DB connected');
    })
    .catch((err)=>{
        console.error('DB connection failed:', err.message);
    })
}
// TQ5P62itS4uMYX4f