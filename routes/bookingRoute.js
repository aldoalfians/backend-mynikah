import express from "express";
import {
  getBooking,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
} from "../controllers/booking.js";
import { verifyUser } from "../middleware/authUser.js";

const router = express.Router();

router.get("/booking", verifyUser, getBooking);
router.get("/booking/:id", verifyUser, getBookingById);
router.post("/booking", verifyUser, createBooking);
router.patch("/booking/:id", verifyUser, updateBooking);
router.delete("/booking/:id", verifyUser, deleteBooking);

export default router;
