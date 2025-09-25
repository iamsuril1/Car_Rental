import mongoose from "mongoose";

const rentalSchema = new mongoose.Schema({
  carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { 
    type: String, 
    enum: ["pending", "accepted", "rejected", "paid"], 
    default: "pending" 
  },
  rentalDays: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ["cash", "online"], default: "cash" }
}, { timestamps: true });

export default mongoose.model("Rental", rentalSchema);
