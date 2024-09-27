const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const Stripe = require("stripe")(process.env.STRIPE_KEY);

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Success!" });
});

app.post("/payment/create", async (req, res) => {
  const total = parseInt(req.query.total);

  if (isNaN(total)) {
    return res.status(400).json({ message: "Invalid total value" });
  }

  if (total > 0) {
    try {
      const paymentIntent = await Stripe.paymentIntents.create({
        amount: total,
        currency: "usd",
      });
      console.log(paymentIntent);
      res.status(201).json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(403).json({
      message: "Total must be greater than 0",
    });
  }
});

app.listen(5500, (err) => {
  if (err) throw err;
  console.log("Server running on http://localhost:5500/");
});
