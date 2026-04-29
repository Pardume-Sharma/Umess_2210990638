import express from "express";
import { getMealStats, updateMealStatus,getMealStatus} from "../controllers/mealController.js";

const mealRouter = express.Router();

mealRouter.get("/stats", getMealStats);
mealRouter.get('/status', getMealStatus);
mealRouter.post("/update", updateMealStatus);

export default mealRouter;
