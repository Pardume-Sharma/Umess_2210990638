import mongoose from 'mongoose';
import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from './models/userModel.js';
import { connectDB } from "./config/db.js";

// const MONGO_URL = 'mongodb+srv://pardume638be22:TQ5P62itS4uMYX4f@cluster0.ocqdk.mongodb.net/';
// const DB_NAME = ' ';

// mongoose.connect(MONGO_URL + DB_NAME, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const exportToExcel = async () => {
    try {
        const users = await User.find().lean();

        if (!users.length) {
            console.log('No users found.');
            return;
        }

        const data = users.map(user => ({
            Name: user.name,
            Email: user.email,
            AvatarImage: user.avatarImage,
            IdCardImage: user.idCardImage,
            Hostel: user.hostel,
            RollNumber: user.rollNumber,
            Active: user.active,
            Breakfast: user.breakfast,
            Lunch: user.lunch,
            Snacks: user.snacks,
            Dinner: user.dinner
        }));

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

        const folderPath = path.join(__dirname, 'Reports');
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }

        const date = new Date();
        const formattedDate = date.toISOString().split('T')[0];
        const fileName = `users_${formattedDate}.xlsx`;
        const filePath = path.join(folderPath, fileName);

        XLSX.writeFile(workbook, filePath);
        console.log(`Excel file saved as ${fileName} in "Reports" folder.`);
    } catch (error) {
        console.error('Error exporting data to Excel:', error);
    }
};
// exportToExcel();
const monitorDatabaseChanges = async () => {
    try {
        const changeStream = User.watch(); 

        changeStream.on('change', async (change) => {
            console.log('Change detected in the database:', change);
            await exportToExcel(); 
        });

        console.log('Listening for database changes...');
    } catch (error) {
        console.error('Error setting up change stream:', error);
    }
};

monitorDatabaseChanges();

export {monitorDatabaseChanges,exportToExcel}
