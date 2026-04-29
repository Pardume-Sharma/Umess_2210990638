// Reports.js
import { useEffect, useState } from 'react';
import './Reports.css'; 
import axios from 'axios';

const Reports = () => {
    const [reports, setReports] = useState([]);
    const url = import.meta.env.VITE_DB_URL; //backendURL

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await axios.get(`${url}/api/reports/getAllReports`);
                if (response.data.success) {
                    setReports(response.data.reports);
                } else {
                    console.error('Failed to fetch reports:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching reports:', error);
            }
        };

        fetchReports();
    }, []);

    const handleDownload = async (report) => {
        try {
            const response = await axios.get(`${url}/api/reports/download/${encodeURIComponent(report.name)}`, { responseType: 'blob' });
            if (response.status !== 200) {
                throw new Error('Network response was not ok');
            }
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = report.name; 
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading report:', error);
        }
    };

    return (
         <div className="reports-container">
            <h2>Available Reports</h2>
            {reports.length === 0 ? (
                <p>No reports available.</p>
            ) : (
                <ul className="reports-list">
                    {reports.map((report, index) => (
                        <li key={index}>
                            <button className='report' onClick={() => handleDownload(report)}>
                                Download {report.name}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Reports;
