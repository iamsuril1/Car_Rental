import Rental from "../models/Rental.js";
import Car from "../models/Car.js";

export const requestRental = async (req, res) => {
  try {
    const { carId, rentalDays, paymentMethod } = req.body;

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: "Car not found" });

    const totalAmount = car.pricePerDay * rentalDays;

    const rental = await Rental.create({
      carId,
      tenantId: req.user._id,
      ownerId: car.ownerId,
      rentalDays,
      totalAmount,
      paymentMethod,
    });

    res.status(201).json(rental);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const acceptRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: "Rental not found" });

    if (rental.ownerId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    rental.status = "accepted";
    await rental.save();

    res.json(rental);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: "Rental not found" });

    if (rental.ownerId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    rental.status = "rejected";
    await rental.save();

    res.json(rental);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const payRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: "Rental not found" });

    if (rental.tenantId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    rental.status = "paid";
    await rental.save();

    res.json(rental);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyRentals = async (req, res) => {
  try {
    const rentals = await Rental.find({ tenantId: req.user._id }).populate("carId");
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOwnerRentals = async (req, res) => {
  try {
    const rentals = await Rental.find({ ownerId: req.user._id }).populate("carId tenantId");
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
