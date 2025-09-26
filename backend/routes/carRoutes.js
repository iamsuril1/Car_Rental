import express from "express";
import protect from "../middleware/authMiddleware.js";
import { addCar, getCars, getCarById, getMyCars, updateCar, deleteCar } from "../controllers/carController.js";

const router = express.Router();

router.post("/", protect, addCar); // Owner adds car
router.get("/", getCars); // Public - list all cars
router.get("/mycars", protect, getMyCars); // Owner's cars
router.get("/:id", getCarById); // Single car
router.put("/:id", protect, updateCar); 
router.delete("/:id", protect, deleteCar); // Delete car

export default router;
