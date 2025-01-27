import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import TransacttionModel from "../models/transactionModel.js";

export const signUpAction = async (req, res) => {
  const midtransUrl = process.env.MIDTRANS_URL;
  const midtransAuthString = process.env.MIDTRANS_AUTH_STRING;
  //   const pathFinishPayment = process.env.PATH_FINISH_PAYMENT;

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
    const transaction = new TransacttionModel({
      user: user._id,
      price: 280000,
    });

    const midtrans = await fetch(midtransUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${midtransAuthString}`,
      },
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
          finish: "http://localhost:5173/success-checkout",
        },
      }),
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
