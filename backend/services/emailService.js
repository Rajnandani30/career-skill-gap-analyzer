const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendCareerAIEmail = async ({
  to,
  subject,
  title,
  message,
}) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is missing from backend/.env");
  }

  if (!to) {
    throw new Error("Recipient email is required");
  }

  const result = await resend.emails.send({
    from:
      process.env.RESEND_FROM_EMAIL ||
      "CareerAI <onboarding@resend.dev>",
    to: [to],
    subject,
    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        padding: 24px;
        background: #f5f3ff;
        color: #1f1f2e;
        border-radius: 12px;
      ">
        <h1 style="color: #6d28d9; margin-bottom: 16px;">
          ${title}
        </h1>

        <p style="
          font-size: 16px;
          line-height: 1.7;
          white-space: pre-line;
        ">
          ${message}
        </p>

        <hr style="border: 0; border-top: 1px solid #ddd6fe;" />

        <p style="font-size: 13px; color: #6b7280;">
          This email was sent by CareerAI.
        </p>
      </div>
    `,
  });

  if (result.error) {
    throw new Error(result.error.message || "Email could not be sent");
  }

  return result.data;
};

module.exports = {
  sendCareerAIEmail,
};