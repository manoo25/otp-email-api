const axios = require("axios");

const SERVICE_ID = "service_tc3dlzm";
const TEMPLATE_ID = "template_vuo3fyo";
const PUBLIC_KEY = "MrsDkRGIT4G7JGcan";

let lastSentOTP = null;

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const otp = generateOTP();
  lastSentOTP = otp;

  try {
    await axios.post("https://api.emailjs.com/api/v1.0/email/send", {
      service_id: SERVICE_ID,
      template_id: TEMPLATE_ID,
      user_id: PUBLIC_KEY,
      template_params: {
        to_email: email,
        handle_code: otp
      }
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
}

export { lastSentOTP };