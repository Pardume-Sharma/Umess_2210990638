import Wastage from "../models/wastageModel.js";

export const getWastageData = async (req, res) => {
    
    try {
        const wastage = await Wastage.findOne({});
        if (!wastage) {
            return res.status(404).json({ error: 'No wastage data found for this month/year' });
        }
        res.json(wastage.wastageData);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching wastage data' });
    }
};

export const addWastageData = async (req, res) => {
    const { value } = req.body;
    
    if (value === undefined || value === null) {
        return res.status(400).json({ error: 'Value is required' });
    }
    
    try {
        // Find wastage data without month and year
        let wastage = await Wastage.findOne({}); // Adjust the query as per your needs
        
        if (!wastage) {
            // Create a new wastage object without month and year
            wastage = new Wastage({ wastageData: [parseFloat(value)] });
        } else {
            if (wastage.wastageData.length >= 31) {
                return res.status(400).json({ error: 'Cannot add more than 31 entries' });
            }
            wastage.wastageData.push(parseFloat(value));
        }
        
        await wastage.save();
        res.status(201).json(wastage.wastageData);
    } catch (error) {
        res.status(500).json({ error: 'Error adding wastage data' });
    }
};

export const clearWastageData = async (req, res) => {
    
    try {
        const wastage = await Wastage.findOne({});
        
        wastage.wastageData = [];
        await wastage.save();
        
        res.status(200).json({ message: 'Wastage data cleared successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error clearing wastage data' });
    }
};
