import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmationEmail({
  to,
  productName,
  downloadUrl,
}: {
  to: string;
  productName: string;
  downloadUrl: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY not set — skipping confirmation email.');
    return;
  }

  const fromAddress = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  try {
    await resend.emails.send({
      from: fromAddress,
      to,
      subject: `Your download: ${productName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h1 style="font-size: 20px;">Thanks for your purchase!</h1>
          <p>Your copy of <strong>${productName}</strong> is ready to download.</p>
          <p style="margin: 24px 0;">
            <a href="${downloadUrl}" style="background:#b4763a;color:#fff;padding:12px 20px;border-radius:4px;text-decoration:none;font-weight:bold;">
              Download your PDF
            </a>
          </p>
          <p style="color:#666; font-size:13px;">
            If the button doesn't work, copy and paste this link:<br/>${downloadUrl}
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error('[email] Failed to send confirmation email:', err);
  }
}
