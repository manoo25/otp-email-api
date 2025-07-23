const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

let lastOtp = null;

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

app.post("/send", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  const otp = generateOTP();
  lastOtp = otp;

  try {
    await axios.post("https://api.emailjs.com/api/v1.0/email/send", {
      service_id: process.env.SERVICE_ID,
      template_id: process.env.TEMPLATE_ID,
      user_id: process.env.PUBLIC_KEY,
      template_params: {
        email: email,
        code: otp,
      },
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
});

app.get("/verify", (req, res) => {
  if (!lastOtp) {
    return res.status(404).json({ message: "No OTP has been sent yet" });
  }
  res.status(200).json({ otp: lastOtp });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
