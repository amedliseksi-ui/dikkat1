export async function sendMail(to: string, subject: string, text: string): Promise<boolean> {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS;
  const from = (process.env.SMTP_FROM || user || "").trim();
  if (!host || !user || !pass || !from || !to) return false;
  try {
    const nodemailer = await import("nodemailer");
    const port = Number(process.env.SMTP_PORT || 587);
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 8000,
    });
    await transporter.sendMail({
      from: `Mersin Dikkat Eğitim <${from}>`,
      to,
      subject,
      text,
    });
    return true;
  } catch (err) {
    console.error("mail", err instanceof Error ? err.message : err);
    return false;
  }
}
