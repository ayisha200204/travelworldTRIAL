const Trip = require("../models/tripModel");

// @desc    Create a new trip
// @route   POST /api/trips
// @access  Private
const createTrip = async (req, res) => {
    try {
        const { destination, startDate, endDate, tripType, interests, budget } = req.body;

        // Check if all required fields are provided
        if (!destination || !startDate || !endDate || !tripType || !interests || !budget) {
            return res.status(400).json({ message: "Please provide all fields" });
        }

        // Create a new trip in the database
        const trip = new Trip({
            user: req.user.id, // Assuming authentication is required
            destination,
            startDate,
            endDate,
            tripType,
            interests,
            budget,
        });

        const createdTrip = await trip.save();

        res.status(201).json(createdTrip);
    } catch (error) {
        console.error("Error creating trip:", error);
        res.status(500).json({ message: "Failed to create trip" });
    }
};

// @desc    Get all trips for the logged-in user
// @route   GET /api/trips
// @access  Private
const getTrips = async (req, res) => {
    try {
        const trips = await Trip.find({ user: req.user.id });
        res.status(200).json(trips);
    } catch (error) {
        console.error("Error fetching trips:", error);
        res.status(500).json({ message: "Failed to fetch trips" });
    }
};
// ✅ Update a trip
const updateTrip = async (req, res) => {
    try {
      const trip = await Trip.findById(req.params.id);
  
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }
  
      // Check if the logged-in user owns the trip
      if (trip.user.toString() !== req.user.id) {
        return res.status(401).json({ message: "Not authorized to update this trip" });
      }
  
      const updatedTrip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
  
      res.json(updatedTrip);
    } catch (error) {
      res.status(500).json({ message: "Error updating trip", error });
    }
  };
  
  // ✅ Delete a trip
  const deleteTrip = async (req, res) => {
    try {
      const trip = await Trip.findById(req.params.id);
  
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }
  
      // Check if the logged-in user owns the trip
      if (trip.user.toString() !== req.user.id) {
        return res.status(401).json({ message: "Not authorized to delete this trip" });
      }
  
      await trip.deleteOne();
      res.json({ message: "Trip deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting trip", error });
    }
  };
  const getTripItinerary = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }
        res.json(trip.itinerary);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch itinerary" });
    }
};
  
  module.exports = { getTrips, createTrip, updateTrip, deleteTrip, getTripItinerary };
