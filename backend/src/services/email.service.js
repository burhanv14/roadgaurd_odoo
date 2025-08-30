// Email service placeholder
// For development, we'll just log the OTP to console
// In production, you would integrate with a real email service

class EmailService {
  static async sendOTPEmail(email, otp, type = 'email_verification') {
    try {
      const subject = type === 'email_verification' 
        ? 'RoadGuard - Email Verification'
        : 'RoadGuard - Password Reset';
      
      const message = type === 'email_verification'
        ? `Your email verification OTP is: ${otp}. This OTP will expire in 10 minutes.`
        : `Your password reset OTP is: ${otp}. This OTP will expire in 15 minutes.`;

      // For development - log to console
      console.log('\n=== EMAIL SERVICE ===');
      console.log(`To: ${email}`);
      console.log(`Subject: ${subject}`);
      console.log(`Message: ${message}`);
      console.log('====================\n');

      // TODO: Replace with actual email service (Gmail, SendGrid, etc.)
      // For now, we'll simulate successful email sending
      return { success: true, messageId: `dev-${Date.now()}` };
      
    } catch (error) {
      console.error('Email service error:', error);
      throw new Error('Failed to send email');
    }
  }

  static async sendWelcomeEmail(email, firstName) {
    try {
      const subject = 'Welcome to RoadGuard!';
      const message = `Welcome ${firstName}! Your account has been successfully verified.`;

      // For development - log to console
      console.log('\n=== EMAIL SERVICE ===');
      console.log(`To: ${email}`);
      console.log(`Subject: ${subject}`);
      console.log(`Message: ${message}`);
      console.log('====================\n');

      // TODO: Replace with actual email service
      return { success: true, messageId: `dev-${Date.now()}` };
      
    } catch (error) {
      console.error('Email service error:', error);
      throw new Error('Failed to send welcome email');
    }
  }
}

module.exports = EmailService;
