import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";

export const signUpAction = async (req, res) => {
  try {
    const body = req.body; //name, email, password

    const hashPassword = bcrypt.hashSync(body.password, 12);

    const user = new userModel({
      name: body.name,
      email: body.email,
      photo: "default.png",
      password: hashPassword,
      role: "manager",
    });

    // action payment gateway midtrans

    await user.save();

    return res.json({
      message: "Sign Up Success",
      data: {
        midtrans_gateway_url: "https://google.com",
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error!" });
  }
};
