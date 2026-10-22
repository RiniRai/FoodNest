import { Resend } from "resend";

const sendEmail = async ({ email, subject, resetUrl }) => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is missing in environment variables");
  }

  if (!email || !subject || !resetUrl) {
    throw new Error("Email, subject, and resetUrl are required");
  }

  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from: "FoodNest <onboarding@resend.dev>",
    to: [email],
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Reset Your FoodNest Password</h2>
        <p>Click the button below to reset your password:</p>
        <p>
          <a href="${resetUrl}"
             style="display:inline-block;padding:12px 20px;
                    background:#ea580c;color:#fff;
                    text-decoration:none;border-radius:6px;">
            Reset Password
          </a>
        </p>
        <p>If the button doesn't work, copy this link into your browser:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>If you didn't request a password reset, you can ignore this email.</p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend email error:", error);
    throw new Error(`Failed to send reset email: ${error.message}`);
  }

  console.log("Password reset email accepted by Resend:", data?.id);

  return data;
};

export default sendEmail;