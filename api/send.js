export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      service_id: "service_tc3dlzm",
      template_id: "template_vuo3fyo",
      user_id: "MrsDkRGIT4G7JGcan",
      template_params: {
        to_email: email,
        otp: otp
      }
    })
  });

  if (!response.ok) {
    return res.status(500).json({ error: 'Failed to send email' });
  }

  return res.status(200).json({ success: true, code: otp });
}
