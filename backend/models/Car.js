import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  brand: String,
  model: String,
  pricePerDay: { type: Number, required: true },
  location: String,
  image: String,
  available: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Car", carSchema);
