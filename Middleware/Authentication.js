import jwt from "jsonwebtoken";
import User from "../module/userSchema.js";

const Authentication = (request, response, next) => {
  const { authorization } = request.headers;

  if (!authorization) {
    return response.status(401).json({ error: "Access denied. Please Login Auth" });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, process.env.SECRET_KEY, (error, payload) => {
    if (error) {
      return response.redirect("");
    }
    const { _id } = payload;

    User.findById(_id).then((user) => {
      request.user = user;
      next();
    });
  });
};
export default Authentication;
