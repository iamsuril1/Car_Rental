import express from "express";
import protect from "../middleware/authMiddleware.js";
import { requestRental, acceptRental, rejectRental, payRental, getMyRentals, getOwnerRentals } from "../controllers/rentalController.js";

const router = express.Router();

router.post("/request", protect, requestRental); // Tenant request rental
router.put("/:id/accept", protect, acceptRental); // Owner accepts
router.put("/:id/reject", protect, rejectRental); // Owner rejects
router.put("/:id/pay", protect, payRental); // Tenant pays
router.get("/myrentals", protect, getMyRentals); // Tenant's rentals
router.get("/owner", protect, getOwnerRentals); // Owner's rental requests

export default router;
