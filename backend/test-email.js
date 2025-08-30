require('dotenv').config();
const { testEmailConfiguration, sendOtpEmail } = require('./dist/services/emailService');

async function testEmail() {
  console.log('🧪 Testing Email Configuration...\n');
  
  try {
    // Test email configuration
    const isValid = await testEmailConfiguration();
    
    if (isValid) {
      console.log('✅ Email configuration is valid!\n');
      
      // Test sending an OTP email
      console.log('📧 Testing OTP email sending...\n');
      
      const testEmail = process.env.EMAIL_USER || 'test@example.com';
      const emailSent = await sendOtpEmail(
        testEmail,
        'Test User',
        '123456',
        5
      );
      
      if (emailSent) {
        console.log('✅ Test OTP email sent successfully!');
        console.log(`📧 Check your email: ${testEmail}`);
      } else {
        console.log('❌ Failed to send test OTP email');
      }
    } else {
      console.log('❌ Email configuration is invalid');
      console.log('Please check your .env file and email settings');
    }
  } catch (error) {
    console.error('❌ Error during email test:', error.message);
  }
}

// Run the test
testEmail();
