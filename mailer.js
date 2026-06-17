const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: process.env.SMTP_USER ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  } : undefined
});

async function sendVerificationEmail(toEmail, code) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: toEmail,
    subject: 'Akademik Ödül Sistemi - E-posta Doğrulama Kodu',
    text: `Doğrulama kodunuz: ${code}\n\nBu kod 15 dakika içinde geçerliliğini kaybedecektir.`,
    html: `<p>Akademik Ödül Sistemi kaydınızı tamamlamak için doğrulama kodunuz:</p>
           <p style="font-size:24px;font-weight:bold;letter-spacing:4px;">${code}</p>
           <p>Bu kod 15 dakika içinde geçerliliğini kaybedecektir.</p>`
  });
}

module.exports = { sendVerificationEmail };
