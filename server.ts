import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

// Increase body limit to handle CV file uploads (max 10MB)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// API Route for Career/CV Submission
app.post('/api/careers/submit', async (req, res) => {
  try {
    const { name, mobile, email, position, experience, cvName, cvType, cvData } = req.body;

    if (!name || !mobile || !position || !experience || !cvName || !cvData) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields including CV file are required. / تمام تفصیلات مع سی وی فائل لازمی ہیں۔' 
      });
    }

    // Validate email format if provided
    if (email && !email.includes('@')) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email address. / ای میل ایڈریس غلط ہے۔' 
      });
    }

    // Configure Nodemailer transporter from environment variables
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT || '587';
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || 'AsaanBusSafar Careers <careers@asaanbussafar.com>';

    let emailSent = false;
    let emailError = null;

    if (smtpHost && smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: parseInt(smtpPort, 10),
          secure: smtpPort === '465', // true for 465, false for other ports
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        // Convert base64 file data into standard Buffer to send as email attachment
        // cvData often starts with "data:application/pdf;base64,..."
        const base64Content = cvData.includes('base64,') 
          ? cvData.split('base64,')[1] 
          : cvData;

        const fileBuffer = Buffer.from(base64Content, 'base64');

        const mailOptions = {
          from: smtpFrom,
          to: 'mujahidali.webdev@gmail.com',
          subject: `💼 New Job Application: ${position} - ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc;">
              <h2 style="color: #059669; border-bottom: 2px solid #059669; padding-bottom: 10px; margin-top: 0;">New Job Application Received</h2>
              <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #475569; width: 150px;">Applicant Name:</td>
                  <td style="padding: 8px 0; color: #0f172a;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #475569;">Mobile Number:</td>
                  <td style="padding: 8px 0; color: #0f172a;">
                    <a href="tel:${mobile}" style="color: #2563eb; text-decoration: none;">${mobile}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #475569;">Email Address:</td>
                  <td style="padding: 8px 0; color: #0f172a;">
                    ${email ? `<a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>` : 'Not provided'}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #475569;">Position Applied:</td>
                  <td style="padding: 8px 0; color: #0f172a;"><span style="background-color: #d1fae5; color: #065f46; padding: 4px 8px; border-radius: 6px; font-weight: bold; font-size: 0.85em;">${position}</span></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #475569; vertical-align: top;">Experience:</td>
                  <td style="padding: 8px 0; color: #0f172a; white-space: pre-wrap; line-height: 1.5;">${experience}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #475569;">CV Filename:</td>
                  <td style="padding: 8px 0; color: #475569; font-family: monospace;">${cvName}</td>
                </tr>
              </table>
              <div style="margin-top: 30px; padding: 15px; background-color: #f1f5f9; border-radius: 8px; font-size: 0.85em; color: #64748b; text-align: center;">
                This applicant's information has been securely stored in the AsaanBusSafar Careers Database. You can also review it inside your Admin Dashboard.
              </div>
            </div>
          `,
          attachments: [
            {
              filename: cvName,
              content: fileBuffer,
              contentType: cvType
            }
          ]
        };

        await transporter.sendMail(mailOptions);
        emailSent = true;
        console.log(`Email successfully sent to mujahidali.webdev@gmail.com for candidate: ${name}`);
      } catch (err: any) {
        console.error('Nodemailer Error: ', err);
        emailError = err.message || String(err);
      }
    } else {
      console.warn('SMTP Settings are missing from Environment Variables. CV saved to database but email could not be sent directly.');
    }

    return res.status(200).json({ 
      success: true, 
      emailSent,
      emailError,
      message: 'Your CV has been submitted successfully! / آپ کی سی وی کامیابی کے ساتھ جمع ہو گئی ہے۔'
    });
  } catch (error: any) {
    console.error('Server Career API Error: ', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error occurred / سرور کی سائیڈ پر غلطی پیش آئی ہے۔' 
    });
  }
});

// Vite middleware integrated for full-stack build
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Listen strictly on port 3000
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AsaanBusSafar Fullstack Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start fullstack server: ', err);
});
