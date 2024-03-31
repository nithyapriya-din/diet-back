import express from "express";
import { AppUserModel } from "../db-utils/module.js";
import { v4 } from "uuid";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { mailOptions, transporter } from "./mail.js";
const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  try {
    const payload = req.body;
    const appUser = await AppUserModel.findOne(
      { email: payload.email },
      { id: 1, Firstname: 1, Lastname: 1, email: 1, _id: 0 }
    );
    console.log(payload.email);
    if (appUser) {
      res.status(409).send({ msg: "user already exits" });
      return;
    }
    bcrypt.hash(payload.password, 10, async function (err, hash) {
      if (err) {
        res.status(500).send({ msg: "Error in registring" });
        return;
      }
      const authuser = new AppUserModel({
        ...payload,
        password: hash,
        id: v4(),
        isVerified: false,
      });
      await authuser.save();
    });
    res.send({ msg: "user register successfully " });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "Error in creating" });
  }
});

authRouter.post("/test", async (req, res) => {
  try {
    const payload = req.body;
    const authuser = new AppUserModel({ ...payload });
    await authuser.save();
    res.send({ msg: "user register successfully " });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "Error in creating" });
  }
});

authRouter.post("/regmail", async function (req, res) {
  try {
    const resetKey = crypto.randomBytes(32).toString("hex");
    const payload = req.body;
    const appUser = await AppUserModel.findOne(
      { email: payload.email },
      { name: 1, email: 1, _id: 0 }
    );
    const cloudUser = await AppUserModel.updateOne(
      { email: payload.email },
      { $set: { ResetKey: resetKey } }
    );
    if (appUser) {
      const responceObj = appUser.toObject();
      const link = `${process.env.FRONTEND_twostep}/?reset=${resetKey}`;
      console.log(link);
      await transporter.sendMail({
        ...mailOptions,
        to: payload.email,
        text: `Click this link to activate the account ${link} `,
      });
      res.send({ responceObj, msg: "user updated " });
    } else {
      res.status(404).send({ msg: "user not found" });
    }
  } catch (err) {
    console.log(err);
  }
});

authRouter.post("/login", async function (req, res) {
  try {
    const payload = req.body;
    const appUser = await AppUserModel.findOne(
      { email: payload.email },
      { id: 1, name: 1, email: 1, password: 1, isVerified: 1, _id: 0 }
    );

    console.log(appUser.isVerified);
    const verify = appUser.isVerified;
    const hash = appUser.password;
    const userpassword = payload.password;
    if (verify === "true" && appUser !== "null") {
      const app = bcrypt.compare(userpassword, hash, (err, result) => {
        console.log(result);
        if (result) {
          const responceObj = appUser.toObject();
          delete responceObj.password;
          res.send(responceObj);
        } else {
          res.status(401).send({ msg: "invalid credentials" });
        }
      });
    } else {
      res.status(405).send({ msg: "Not activated" });
    }
  } catch (err) {
    console.log(err);
    res.status(404).send({ msg: "user not found" });
  }
});

authRouter.post("/password", async function (req, res) {
  try {
    const resetKey = crypto.randomBytes(32).toString("hex");
    const payload = req.body;
    const appUser = await AppUserModel.findOne(
      { email: payload.email },
      { name: 1, email: 1, _id: 0 }
    );
    const cloudUser = await AppUserModel.updateOne(
      { email: payload.email },
      { $set: { ResetKey: resetKey } }
    );
    if (appUser) {
      const responceObj = appUser.toObject();
      const link = `${process.env.FRONTEND_URL}/?reset=${resetKey}`;
      console.log(link);
      await transporter.sendMail({
        ...mailOptions,
        to: payload.email,
        text: `Click this link to verify the EmailId  ${link} `,
      });
      res.send({ responceObj, msg: "user updated " });
    } else {
      res.status(404).send({ msg: "user not found" });
    }
  } catch (err) {
    console.log(err);
  }
});

authRouter.put("/validate", async function (req, res) {
  const payload = req.body;
  try {
    const cloudUser = await AppUserModel.updateOne(
      { ResetKey: payload.resetKey },
      { isVerified: payload.isVerified }
    );
    const appUser = await AppUserModel.findOne(
      { ResetKey: payload.resetKey },
      { isVerified: 1, ResetKey: 1, _id: 0 }
    );

    if (!appUser) {
      res.status(404).send({ msg: "key not found" });
      console.log("payload");
    } else {
      if (payload.resetKey === appUser.ResetKey && payload.code === "1") {
        console.log("true");
        res.send("true");
      } else if (payload.resetKey === appUser.ResetKey) {
        console.log("true");
        res.send("true");
      } else {
        console.log("false");
        res.send("false");
      }
    }
  } catch {
    res.status(404).send({ msg: "user not found 123" });
  }
});

authRouter.put("/reset", async function (req, res) {
  const payload = req.body;
  try {
    // hashing the password for storing in db
    bcrypt.hash(payload.password, 10, async function (err, hash) {
      if (err) {
        res.status(400).send({ msg: "Error in reseting" });
        return;
      }
      await AppUserModel.updateOne(
        { email: payload.email },
        { $set: { password: hash } }
      );
      res.send({ msg: "user updated " });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "Error in updating" });
  }
});

authRouter.post("/profile", async function (req, res) {
  try {
    const payload = req.body;

    // console.log(payload)
    const appUser = await AppUserModel.findOne(
      { email: payload.email },
      {
        Firstname: 1,
        Lastname: 1,
        email: 1,
        Height: 1,
        Weight: 1,
        Age: 1,
        Gender:1,
        _id: 0,
      }
    );
    console.log(appUser);
    if (appUser) {
      res.send(appUser);
    } else {
      res.send("error data");
      // console.log("2")
    }
  } catch (err) {
    // console.log(err);
    res.status(500).send({ msg: "Error occuerred while fetching users" });
    // console.log("3")
  }
});
authRouter.put("/editprofile", async function (req, res) {
  try {
    const payload = req.body;

    console.log(payload);

    const appUser = await AppUserModel.updateOne(
      { email: payload.email },
      {
        $set: {
          Firstname: payload.firstName,
          Lastname: payload.lastName,
          Height: payload.height,
          Weight: payload.weight,
          Age: payload.age,
        },
      }
    );

    console.log(appUser);
    if (appUser.nModified > 0) {
      // nModified indicates the number of documents modified during the update
      res.send("Profile updated successfully");
    } else {
      res.send("No matching user found or data already up-to-date");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: "Error occurred while updating the profile" });
  }
});

export default authRouter;
