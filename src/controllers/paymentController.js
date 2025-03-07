import transactionModel from "../models/transactionModel.js";

export const paymentController = async (req, res) => {
  try {
    const body = req.body;
    const orderId = body.order_id;
    console.log(orderId);

    switch (body.transaction_status) {
      case "capture":
      case "settlement":
        await transactionModel.findByIdAndUpdate(orderId, {
          status: "success",
        });
        break;
      case "deny":
      case "cancel":
      case "expire":
      case "pending":
      case "failure":
        await transactionModel.findByIdAndUpdate(orderId, {
          status: "failed",
        });
        break;
    }

    return res.json({
      message: "Payment Success!",
      data: {},
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: "Internal Server Error!" });
  }
};
