export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  // Send using EmailJS
  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_USER_ID,
      template_params: {
        to_email: email,
        otp: otp
      }
    })
  });

  if (!response.ok) {
    return res.status(500).json({ error: 'Failed to send email' });
  }

  // رجعه مع الكود
  return res.status(200).json({ success: true, code: otp });
}
