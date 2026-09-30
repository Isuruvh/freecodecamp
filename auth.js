import express from "express";
import bcrypt from "bcryptjs";

import { findByUsername } from "../utils/db.js";
import { signToken } from "../utils/jwt.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.sendStatus(400);
  }

  const user = findByUsername(username);

  if (!user) {
    return res.sendStatus(401);
  }

  const valid = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!valid) {
    return res.sendStatus(401);
  }

  const token = signToken({
    id: user.id,
    username: user.username,
    role: user.role,
  });

  res.status(200).json({
    token,
  });
});

export default router;