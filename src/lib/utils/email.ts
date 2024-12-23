// src/lib/utils/email.ts
import nodemailer from 'nodemailer';

// Email configuration
const emailConfig = {
  host: process.env.EMAIL_SERVER || 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_ADDRESS || 'thakurtarun936@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'aoiy gwjk fdok ejxj',
  },
};

const transporter = nodemailer.createTransport(emailConfig);

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

// Base email template
const getBaseTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        /* Base styles */
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            background-color: #f9fafb;
        }
        .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
        }
        .email-header {
            text-align: center;
            padding: 20px 0;
            background: linear-gradient(135deg, #4F46E5, #7C3AED);
            border-radius: 8px 8px 0 0;
        }
        .email-header img {
            width: 120px;
            height: auto;
        }
        .email-content {
            padding: 30px;
            background-color: #ffffff;
            border-radius: 0 0 8px 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background: linear-gradient(135deg, #4F46E5, #7C3AED);
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
            transition: transform 0.2s;
        }
        .button:hover {
            transform: translateY(-2px);
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #6B7280;
            font-size: 0.875rem;
        }
        .social-links {
            margin: 20px 0;
            text-align: center;
        }
        .social-link {
            display: inline-block;
            margin: 0 10px;
            color: #4F46E5;
            text-decoration: none;
        }
        @media only screen and (max-width: 600px) {
            .email-wrapper {
                padding: 10px;
            }
            .email-content {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        ${content}
    </div>
</body>
</html>
`;

// Password Reset Email Template
const getPasswordResetTemplate = (resetLink: string, userName: string = 'there') => {
  const content = `
        <div class="email-header">
            <img src="${process.env.NEXT_PUBLIC_BASE_URL}/AILogo.jpeg" alt="socialSAGA Logo">
            <h1 style="color: #ffffff; margin: 10px 0;">Password Reset</h1>
        </div>
        <div class="email-content">
            <h2 style="color: #1F2937; margin-bottom: 20px;">Hi ${userName}!</h2>
            <p style="color: #4B5563; margin-bottom: 20px;">
                We received a request to reset your password for your socialSAGA account. 
                No worries, it happens to the best of us!
            </p>
            <div style="text-align: center;">
                <a href="${resetLink}" class="button">Reset Password</a>
            </div>
            <p style="color: #4B5563; margin-top: 20px;">
                If you didn't request this password reset, you can safely ignore this email.
                The link will expire in 1 hour for security reasons.
            </p>
            <div style="margin: 30px 0; padding: 20px; background-color: #F3F4F6; border-radius: 6px;">
                <p style="color: #4B5563; font-size: 0.875rem; margin: 0;">
                    If the button doesn't work, copy and paste this link into your browser:
                    <br>
                    <a href="${resetLink}" style="color: #4F46E5; word-break: break-all;">${resetLink}</a>
                </p>
            </div>
        </div>
        <div class="footer">
            <div class="social-links">
                <a href="#" class="social-link">Twitter</a>
                <a href="#" class="social-link">Facebook</a>
                <a href="#" class="social-link">Instagram</a>
            </div>
            <p>© ${new Date().getFullYear()} socialSAGA. All rights reserved.</p>
            <p style="font-size: 0.75rem;">
                This email was sent to you because you requested a password reset for your socialSAGA account.
            </p>
        </div>
    `;
  return getBaseTemplate(content);
};

// Welcome Email Template
const getWelcomeTemplate = (name: string, verificationLink?: string) => {
  const content = `
        <div class="email-header">
            <img src="${process.env.NEXT_PUBLIC_BASE_URL}/AILogo.jpeg" alt="socialSAGA Logo">
            <h1 style="color: #ffffff; margin: 10px 0;">Welcome to socialSAGA!</h1>
        </div>
        <div class="email-content">
            <h2 style="color: #1F2937; margin-bottom: 20px;">Hi ${name}!</h2>
            <p style="color: #4B5563; margin-bottom: 20px;">
                Welcome to socialSAGA! We're thrilled to have you join our community of creators and innovators.
            </p>
            <div style="background: #F3F4F6; padding: 20px; border-radius: 6px; margin: 20px 0;">
                <h3 style="color: #1F2937; margin-top: 0;">What you can do with socialSAGA:</h3>
                <ul style="color: #4B5563; padding-left: 20px;">
                    <li>Create and manage your content</li>
                    <li>Collaborate with other creators</li>
                    <li>Track your content performance</li>
                    <li>Access AI-powered tools</li>
                </ul>
            </div>
            ${verificationLink ? `
            <div style="text-align: center;">
                <a href="${verificationLink}" class="button">Verify Email Address</a>
            </div>
            ` : ''}
            <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" class="button">
                    Go to Dashboard
                </a>
            </div>
        </div>
        <div class="footer">
            <div class="social-links">
                <a href="#" class="social-link">Twitter</a>
                <a href="#" class="social-link">Facebook</a>
                <a href="#" class="social-link">Instagram</a>
            </div>
            <p>© ${new Date().getFullYear()} socialSAGA. All rights reserved.</p>
            <p style="font-size: 0.75rem;">
                You received this email because you signed up for a socialSAGA account.
            </p>
        </div>
    `;
  return getBaseTemplate(content);
};

export async function sendEmail({ to, subject, text, html }: EmailOptions) {
  try {
    const mailOptions = {
      from: `"${process.env.EMAIL_NAME || 'socialSAGA'}" <${process.env.EMAIL_ADDRESS || 'thakurtarun936@gmail.com'}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

export async function sendPasswordResetEmail(to: string, resetToken: string, userName?: string) {
  const resetLink = `${window.location.origin}/auth/reset-password?token=${resetToken}`;
  const html = getPasswordResetTemplate(resetLink, userName);
  const text = `Reset your password by clicking this link: ${resetLink}`;

  return sendEmail({
    to,
    subject: 'Reset Your socialSAGA Password',
    text,
    html,
  });
}

export async function sendWelcomeEmail(to: string, name: string, verificationLink?: string) {
  const html = getWelcomeTemplate(name, verificationLink);
  const text = `Welcome to socialSAGA, ${name}! We're excited to have you on board.`;

  return sendEmail({
    to,
    subject: 'Welcome to socialSAGA! 🎉',
    text,
    html,
  });
}

// Verify email configuration on startup
async function verifyEmailConfig() {
  try {
    await transporter.verify();
    console.log('Email configuration verified successfully');
  } catch (error) {
    console.error('Email configuration error:', error);
    throw new Error('Email configuration failed');
  }
}

// Verify email configuration when the application starts
verifyEmailConfig().catch(console.error);

const getVerificationEmailTemplate = (verificationLink: string, userName: string = 'there') => {
    const content = `
          <div class="email-header">
              <img src="${process.env.NEXT_PUBLIC_BASE_URL}/AILogo.jpeg" alt="socialSAGA Logo">
              <h1 style="color: #ffffff; margin: 10px 0;">Verify Your Email</h1>
          </div>
          <div class="email-content">
              <h2 style="color: #1F2937; margin-bottom: 20px;">Hi ${userName}!</h2>
              <p style="color: #4B5563; margin-bottom: 20px;">
                  Thanks for signing up for socialSAGA! Please verify your email address to get started.
              </p>
              <div style="text-align: center;">
                  <a href="${verificationLink}" class="button">Verify Email Address</a>
              </div>
              <p style="color: #4B5563; margin-top: 20px;">
                  This link will expire in 24 hours for security reasons.
              </p>
              <div style="margin: 30px 0; padding: 20px; background-color: #F3F4F6; border-radius: 6px;">
                  <p style="color: #4B5563; font-size: 0.875rem; margin: 0;">
                      If the button doesn't work, copy and paste this link into your browser:
                      <br>
                      <a href="${verificationLink}" style="color: #4F46E5; word-break: break-all;">${verificationLink}</a>
                  </p>
              </div>
          </div>
          <div class="footer">
              <p>© ${new Date().getFullYear()} socialSAGA. All rights reserved.</p>
          </div>
      `;
    return getBaseTemplate(content);
  };
  
  export async function sendVerificationEmail(to: string, verificationToken: string, userName?: string) {
    const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email?token=${verificationToken}`;
    const html = getVerificationEmailTemplate(verificationLink, userName);
    const text = `Verify your email by clicking this link: ${verificationLink}`;
  
    return sendEmail({
      to,
      subject: 'Verify Your socialSAGA Email',
      text,
      html,
    });
  }


export default {
  sendEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
};

