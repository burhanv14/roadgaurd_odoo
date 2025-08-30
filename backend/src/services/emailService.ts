import nodemailer from 'nodemailer';

// Email transporter configuration
const createTransporter = () => {
  const host = process.env.EMAIL_HOST;
  const port = parseInt(process.env.EMAIL_PORT || '587', 10);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const secure = process.env.EMAIL_SECURE === 'true';

  if (!host || !user || !pass) {
    throw new Error('Email configuration is incomplete. Please check EMAIL_HOST, EMAIL_USER, and EMAIL_PASS environment variables.');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
};

// Email templates
const getOtpEmailTemplate = (userName: string, otpCode: string, expiryMinutes: number) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>RoadGuard - OTP Verification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background-color: #ffffff;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 24px;
                font-weight: bold;
                color: #2563eb;
                margin-bottom: 10px;
            }
            .otp-code {
                background-color: #f8fafc;
                border: 2px solid #e2e8f0;
                border-radius: 8px;
                padding: 20px;
                text-align: center;
                margin: 20px 0;
                font-size: 32px;
                font-weight: bold;
                color: #1e293b;
                letter-spacing: 4px;
            }
            .warning {
                background-color: #fef3c7;
                border: 1px solid #f59e0b;
                border-radius: 5px;
                padding: 15px;
                margin: 20px 0;
                color: #92400e;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e2e8f0;
                color: #64748b;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🚗 RoadGuard</div>
                <h2>Account Verification</h2>
            </div>
            
            <p>Hello <strong>${userName}</strong>,</p>
            
            <p>Thank you for registering with RoadGuard! To complete your account verification, please use the following OTP code:</p>
            
            <div class="otp-code">${otpCode}</div>
            
            <div class="warning">
                <strong>⚠️ Important:</strong>
                <ul>
                    <li>This OTP is valid for ${expiryMinutes} minutes only</li>
                    <li>Do not share this code with anyone</li>
                    <li>If you didn't request this code, please ignore this email</li>
                </ul>
            </div>
            
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
            
            <p>Best regards,<br>The RoadGuard Team</p>
            
            <div class="footer">
                <p>This is an automated message. Please do not reply to this email.</p>
                <p>&copy; ${new Date().getFullYear()} RoadGuard. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Send OTP email
export const sendOtpEmail = async (
  to: string,
  userName: string,
  otpCode: string,
  expiryMinutes: number = 5
): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER;
    
    if (!fromEmail) {
      throw new Error('EMAIL_FROM environment variable is not set');
    }

    const mailOptions = {
      from: `"RoadGuard" <${fromEmail}>`,
      to,
      subject: 'RoadGuard - Your OTP Verification Code',
      html: getOtpEmailTemplate(userName, otpCode, expiryMinutes),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return false;
  }
};

// Test email configuration
export const testEmailConfiguration = async (): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email configuration is valid');
    return true;
  } catch (error) {
    console.error('❌ Email configuration error:', error);
    return false;
  }
};
