import expressAsyncHandler from "express-async-handler";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// @desc Login
// @route POST /auth
// @access Public
export const login = expressAsyncHandler(async (req, res) => {
  if (!req?.body?.username || !req?.body?.password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const foundUser = await User.findOne({ username: req.body.username }).exec();

  if (!foundUser)
    return res.status(401).json({ message: "User does not exist" });

  const match = await bcrypt.compare(req.body.password, foundUser.password);

  if (!match) return res.status(401).json({ message: "Unauthorized" });

  const roles = Object.values(foundUser.roles).filter(Boolean);

  // create JWTs
  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: req.body.username,
        roles: roles,
        id: foundUser._id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    {
      username: req.body.username,
    },

    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  // Saving refreshToken with current user
  foundUser.refreshToken = refreshToken;
  const result = await foundUser.save();

  // Creates Secure Cookie with refresh token
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000, // Seven Day refresh
  });

  // Send authorization roles and access token to user
  res.json({ accessToken });
});

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
export const refresh = expressAsyncHandler(async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt)
    return res.status(401).message({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  // evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      const foundUser = await User.findOne({
        username: decoded.username,
      }).exec();

      if (!foundUser) return res.status(401).json({ message: "Unauthorized" }); //Forbidden

      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            roles: foundUser.roles,
            id: foundUser._id,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      res.json({ accessToken });
    }
  );
});

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
export const logout = expressAsyncHandler(async (req, res) => {
  // On client, also delete the accessToken
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "cookie cleared" });
});
