import { v4 } from "uuid";
import sha1 from "sha1";
import redisClient from "../utils/redis.js";
import User from "../models/userModel.js";

class AuthController {
  static async signup(req, res) {
    const { email, password, username, gender, phone, country } = req.body;
    try {
      const user = await User.signup(
        email,
        password,
        username,
        gender,
        phone,
        country
      );
      res.status(201).json({ email, user });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async login(req, res) {
    const Authorization = req.header("Authorization") || "";
    const { rememberMe } = req.body;
    const credentials = Authorization.split("Basic ")[1];

    if (!credentials) {
      return res.status(401).send({ error: "Unauthorized" });
    }

    const decodedCredentials = Buffer.from(credentials, "base64").toString(
      "utf-8"
    );

    const [email, password] = decodedCredentials.split(":");
    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }
    const sha1Password = sha1(password);
    const user = await User.findOne({ email });
    // console.log(user);
    if (user.length === 0 || user.password !== sha1Password) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = v4();
    const key = `auth_${token}`;
    const hoursForExpiration = rememberMe ? 24 * 10 : 24;
    // console.log(hoursForExpiration);
    await redisClient.set(key, user._id.toString(), hoursForExpiration * 3600);
    return res
      .status(200)
      .json({ token, id: user._id.toString(), username: user.username });
  }

  static async logout(req, res) {
    const token = request.header("X-Token");
    if (!token) {
      return response.status(401).send({ error: "Unauthorized" });
    }
    const key = `auth_${token}`;
    const user = await redisClient.get(key);
    if (!user) {
      return response.status(401).send({ error: "Unauthorized" });
    }
    await redisClient.del(key);
    return response.status(204).send();
  }

  static async updateUser(req, res) {
    const { id, email, username, gender, phone, country } = req.body;
    const token = req.header("X-Token");
    if (!token) {
      return res.status(401).send({ error: "Unauthorized" });
    }
    const key = `auth_${token}`;
    const user = await redisClient.get(key);
    if (!user) {
      return res.status(401).send({ error: "Unauthorized" });
    }
    const userObj = await User.updateUser(id, email, gender, phone, country);
    return res.status(200).json({
      id: userObj._id.toString(),
      username: userObj.username,
      email: userObj.email
    });
  }

  static async getConnectUser(req, res) {
    const token = req.header("X-Token");
    if (!token) {
      return res.status(401).send({ error: "Unauthorized" });
    }
    const key = `auth_${token}`;
    const user = await redisClient.get(key);
    if (!user) {
      return res.status(401).send({ error: "Unauthorized" });
    }
    const userObj = await User.findOne({ _id: user });
    return res
      .status(200)
      .json({
        id: userObj._id.toString(),
        username: userObj.username,
        email: userObj.email,
        gender: userObj.gender,
        phone: userObj.phone,
        country: userObj.country,
      });
  }
}

export default AuthController;
