import jwt from "jsonwebtoken";
import { UserModel } from "../models/users";

export const isLoggedIn = async (req, res, next) => {
  const accessToken = req.headers.authorization;
  let payload = null;

  if (!accessToken) {
    return res.status(401).send({ error: "User unauthorised" }).end();
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    payload = await jwt.verify(accessToken.replace("Bearer ",""), jwtSecret);
    const user = await UserModel.findOne({email: payload.email});
    if (!user) {
      return res.status(500).send({ error: "User authorised, but not found in database" }).end();
    }
    res.locals.userId = user._id;
  } catch (err) {
    console.error(err);
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).send({ error: "User unauthorised" }).end();
    }

    return res.status(400).end();
  }

  return next();
};