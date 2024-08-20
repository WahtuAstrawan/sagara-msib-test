import { API_KEY } from "../config/env.js";

export const apiKeyCheck = (req, res, next) => {
  const apiKey = req.header("x-api-key");

  if (!apiKey) {
    return res
      .status(401)
      .json({ code: 401, message: "No API key, authorization denied." });
  }

  if (apiKey !== API_KEY) {
    return res.status(403).json({ code: 403, message: "Invalid API key." });
  }

  next();
};
