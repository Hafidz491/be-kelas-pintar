import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import transactionModel from "../models/transactionModel.js";
import jwt from "jsonwebtoken";

export const signUpAction = async (req, res) => {
  const midtransUrl = process.env.MIDTRANS_URL;
  const midtransAuthString = process.env.MIDTRANS_AUTH_STRING;
  const pathFinishPayment = process.env.PATH_FINISH_PAYMENT;

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
    const transaction = new transactionModel({
      user: user._id,
      price: 280000,
    });

    const midtrans = await fetch(midtransUrl, {
      method: "POST",
      body: JSON.stringify({
        transaction_details: {
          order_id: transaction._id.toString(),
          gross_amount: transaction.price,
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          email: user.email,
        },
        callbacks: {
          finish: pathFinishPayment,
        },
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${midtransAuthString}`,
      },
    });

    const resMidtrans = await midtrans.json();

    await user.save();
    await transaction.save();

    return res.json({
      message: "Sign Up Success",
      data: {
        midtrans_payment_url: resMidtrans.redirect_url,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error!" });
  }
};

export const signInAction = async (req, res) => {
  try {
    const body = req.body; //email, password

    const existingUser = await userModel
      .findOne()
      .where("email")
      .equals(body.email);

    if (!existingUser) {
      return res.status(404).json({ error: "User not found!" });
    }

    const comparePassword = bcrypt.compareSync(
      body.password,
      existingUser.password
    );

    if (!comparePassword) {
      return res.status(401).json({ error: "Email or Password incorrect!" });
    }

    const isValidUser = await transactionModel.findOne({
      user: existingUser._id,
      status: "success",
    });

    if (existingUser.role !== "student" && !isValidUser) {
      return res.status(400).json({ error: "User not verified!" });
    }

    const token = jwt.sign(
      {
        id: existingUser._id.toString(),
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1 day" }
    );

    return res.json({
      message: "Sign in success",
      data: {
        name: existingUser.name,
        email: existingUser.email,
        token,
        role: existingUser.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error!" });
  }
};
