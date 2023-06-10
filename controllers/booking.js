import Booking from "../models/booking.js";
import User from "../models/user.js";
import { Op } from "sequelize";

export const getBooking = async (req, res) => {
  try {
    let response;
    if (req.role === "admin") {
      response = await Booking.findAll({
        attributes: ["uuid", "hours", "date", "price", "role", "status"],
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    } else {
      response = await Booking.findAll({
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!booking) return res.status(404).json({ msg: "Data tidak ditemukan" });
    let response;
    if (req.role === "admin") {
      response = await Booking.findOne({
        attributes: ["uuid", "hours", "date", "price", "role", "status"],
        where: {
          id: booking.id,
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    } else {
      response = await Booking.findOne({
        attributes: ["uuid", "hours", "date", "price", "role", "status"],
        where: {
          [Op.and]: [{ id: booking.id }, { userId: req.userId }],
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createBooking = async (req, res) => {
  const { hours, date, price, role } = req.body;
  try {
    await Booking.create({
      hours: hours,
      date: date,
      price: price,
      role: role,
      userId: req.userId,
    });
    res.status(201).json({ msg: "Booking Berhasil" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!booking) return res.status(404).json({ msg: "Data tidak ditemukan" });
    const { hours, date, price, role, status } = req.body;
    if (req.role === "admin") {
      await Booking.update(
        { hours, date, price, role, status },
        {
          where: {
            id: booking.id,
          },
        }
      );
    } else {
      if (req.userId !== booking.userId)
        return res.status(403).json({ msg: "Akses terlarang" });
      await Booking.update(
        { hours, date, price, role, status },
        {
          where: {
            [Op.and]: [{ id: booking.id }, { userId: req.userId }],
          },
        }
      );
    }
    res.status(200).json({ msg: "booking updated successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!booking) return res.status(404).json({ msg: "Data tidak ditemukan" });
    if (req.role === "admin") {
      await booking.destroy({
        where: {
          id: booking.id,
        },
      });
    } else {
      if (req.userId !== booking.userId)
        return res.status(403).json({ msg: "Akses terlarang" });
      await booking.destroy({
        where: {
          [Op.and]: [{ id: booking.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "booking deleted successfuly" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
