import express from 'express';
import { createNotice, getAllNotices } from '../controllers/noticeController.js';
import cloudinary from '../config/cloudinary.js';
import NoticeModel from '../models/noticeModel.js';

const noticeRouter = express.Router();

noticeRouter.post('/createNotice', createNotice);
noticeRouter.get('/getAllNotices', getAllNotices);

noticeRouter.delete('/deleteNotice/:id', async (req, res) => {
    const { id } = req.params;
    console.log("id: ", id)
    try {
      const result = await NoticeModel.findByIdAndDelete(id);
      if(!result)
      {
        return res.status(404).json({error:"Notice not found"});
      }
      res.json({ message: "Notice deleted successfully" });
    } catch (error) {
      console.log("Error deleting Notice: ",error);
      res.status(500).json({ error: "Error deleting notice" });
    }
  });
  
export default noticeRouter;
