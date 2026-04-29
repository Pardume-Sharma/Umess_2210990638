import express from "express";
import { getHostels, addHostel } from "../controllers/hostelController.js";

const hostelRouter = express.Router();

hostelRouter.get("/getHostels", getHostels); 
hostelRouter.post("/addHostel", addHostel); 

export default hostelRouter;