const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// EmailJS credentials
const SERVICE_ID = "service_tc3dlzm";
const TEMPLATE_ID = "template_vuo3fyo";
const PUBLIC_KEY = "MrsDkRGIT4G7JGcan";

let lastSentOTP = null;

// Generate random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /send => send OTP to email
app.post("/send", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const otp = generateOTP();
  lastSentOTP = otp;

  try {
    const response = await axios.post("https://api.emailjs.com/api/v1.0/email/send", {
      service_id: SERVICE_ID,
      template_id: TEMPLATE_ID,
      user_id: PUBLIC_KEY,
      template_params: {
        to_email: email,       // ← لازم يكون معرف في قالبك
        handle_code: otp       // ← لازم يكون معرف في قالبك
      }
    });

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
});

// GET /verify => get last OTP
app.get("/verify", (req, res) => {
  if (!lastSentOTP) {
    return res.status(404).json({ message: "No OTP sent yet" });
  }
  res.json({ otp: lastSentOTP });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
