// import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';
import path from 'path';
import { promises as fsPromises } from 'fs';
import fsSync from 'fs';
import fs from 'fs';
import { exportToExcel } from '../exportToExcel.js';
const REPORTS_DIR = path.join(process.cwd(), '../Reports');

if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR);
}

export const generateReport = async (req, res) => {
    try {
        const data = await exportToExcel();

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
        const fileName = `report_${Date.now()}.xlsx`;
        const filePath = path.join(REPORTS_DIR, fileName);

        XLSX.writeFile(workbook, filePath);

        const reportUrl = `${req.protocol}://${req.get('host')}/reports/${fileName}`;
        res.json({ reportUrl });
    } catch (error) {
        console.error("Error generating report: ", error);
        res.status(500).send("Error generating report.");
    }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const reportsDirectory = path.join(__dirname, '../Reports');

if (!fsSync.existsSync(reportsDirectory)) {
    fsSync.mkdirSync(reportsDirectory, { recursive: true });
}

export const getAllReports = async (req, res) => {
    try {
        const files = await fsPromises.readdir(reportsDirectory);

        const reportFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ext === '.pdf' || ext === '.docx' || ext === '.xlsx'; 
        });

        const reportDetails = await Promise.all(reportFiles.map(async (file) => {
            const filePath = path.join(reportsDirectory, file);
            const stats = await fsPromises.stat(filePath);
            return {
                name: file,
                size: stats.size, 
                createdAt: stats.birthtime, 
                url: `/api/reports/download/${encodeURIComponent(file)}` // Endpoint to download the file
            };
        }));

        res.status(200).json({
            success: true,
            reports: reportDetails
        });
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch reports.",
            error: error.message
        });
    }
};

export const downloadReport = async (req, res) => {
    const { fileName } = req.params;

    try {
        if (fileName.includes('..')) {
            return res.status(400).json({ success: false, message: "Invalid file path." });
        }

        const filePath = path.join(reportsDirectory, fileName);

        // Check if the file exists
        await fsPromises.access(filePath);

        // Send the file for download
        res.download(filePath, (err) => {
            if (err) {
                console.error("Error sending file:", err);
                // Handle the error if the file cannot be sent
                return res.status(500).json({ success: false, message: "Failed to download the file." });
            }
        });
    } catch (error) {
        console.error("Error downloading report:", error);
        res.status(404).json({
            success: false,
            message: "Report not found.",
            error: error.message
        });
    }
};
    
