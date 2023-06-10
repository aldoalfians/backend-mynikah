import User from "../models/user.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";

export const Register = async (req, res) => {
  const { name, email, nik, password, confirmPassword, role } = req.body;
  if (password !== confirmPassword)
    return res
      .status(400)
      .json({ msg: "Password dan confirm passowrd tidak sama" });

  const hashPassword = await argon2.hash(password);
  try {
    await User.create({
      name,
      email,
      nik,
      password: hashPassword,
      role,
    });
    res.status(201).json({ msg: "Register Berhasil" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const Login = async (req, res) => {
  const user = await User.findOne({
    where: {
      [Op.or]: [
        {
          email: {
            [Op.like]: req.body.email,
          },
        },
        {
          nik: {
            [Op.like]: req.body.nik,
          },
        },
      ],
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  const match = await argon2.verify(user.password, req.body.password);
  if (!match) return res.status(400).json({ msg: "Wrong Password" });

  const token = jwt.sign({ id: user.uuid }, "passwordKey");
  const uuid = user.uuid;
  const name = user.name;
  const email = user.email;
  const nik = user.nik;
  const role = user.role;
  res.status(200).json({ uuid, name, nik, email, role, token });
};

export const userMe = async (req, res) => {
  const token = req.header("x-auth-token");
  console.log(token);
  if (!token) return res.json(false);

  let verified = jwt.verify(token, "passwordKey");
  console.log(verified);
  if (!verified) return res.json(false);

  const user = await User.findOne({
    attributes: ["uuid", "name", "email", "role"],
    where: {
      uuid: verified.id,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  res.status(200).json(user);
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ msg: "Tidak dapat logout" });
    res.status(200).json({ msg: "Anda telah logout" });
  });
};
