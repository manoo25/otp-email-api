import { lastSentOTP } from "./send";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  if (!lastSentOTP) {
    return res.status(404).json({ message: "No OTP sent yet" });
  }

  res.status(200).json({ otp: lastSentOTP });
}
