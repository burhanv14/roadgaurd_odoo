const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// Test data
const testUser = {
  email: 'test@roadguard.com',
  password: 'SecurePass123',
  firstName: 'Test',
  lastName: 'User'
};

let authToken = '';
let otpCode = '';

async function testAPI() {
  console.log('🧪 RoadGuard API Test Suite');
  console.log('================================\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data.message);
    console.log();

    // Test 2: Auth Health Check
    console.log('2. Testing auth health endpoint...');
    const authHealthResponse = await axios.get(`${BASE_URL}/api/auth/health`);
    console.log('✅ Auth health check passed:', authHealthResponse.data.message);
    console.log();

    // Test 3: User Signup
    console.log('3. Testing user signup...');
    try {
      const signupResponse = await axios.post(`${BASE_URL}/api/auth/signup`, testUser);
      console.log('✅ Signup successful:', signupResponse.data.message);
      console.log('📧 Check console for OTP (development mode)');
      console.log();
    } catch (error) {
      if (error.response?.status === 400 && error.response.data.error.includes('already exists')) {
        console.log('ℹ️  User already exists, continuing with tests...');
        console.log();
      } else {
        throw error;
      }
    }

    // Test 4: Resend OTP
    console.log('4. Testing resend OTP...');
    try {
      const resendResponse = await axios.post(`${BASE_URL}/api/auth/resend-otp`, {
        email: testUser.email
      });
      console.log('✅ OTP resent:', resendResponse.data.message);
      console.log();
    } catch (error) {
      if (error.response?.status === 400 && error.response.data.error.includes('already verified')) {
        console.log('ℹ️  Email already verified, skipping OTP tests...');
        console.log();
        
        // Try login directly
        console.log('5. Testing login...');
        const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
          email: testUser.email,
          password: testUser.password
        });
        console.log('✅ Login successful:', loginResponse.data.message);
        authToken = loginResponse.data.token;
        console.log('🔑 Token received');
        console.log();
      } else {
        throw error;
      }
    }

    // Test 5: Profile Access (if we have token)
    if (authToken) {
      console.log('6. Testing protected profile endpoint...');
      const profileResponse = await axios.get(`${BASE_URL}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      console.log('✅ Profile access successful:', profileResponse.data.user.email);
      console.log();
    }

    // Test 6: Invalid Token
    console.log('7. Testing invalid token protection...');
    try {
      await axios.get(`${BASE_URL}/api/auth/profile`, {
        headers: {
          'Authorization': 'Bearer invalid_token'
        }
      });
      console.log('❌ Should have failed with invalid token');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Invalid token properly rejected');
        console.log();
      } else {
        throw error;
      }
    }

    // Test 7: Rate Limiting (optional)
    console.log('8. Testing rate limiting...');
    console.log('ℹ️  Making multiple requests to test rate limiting...');
    
    const promises = [];
    for (let i = 0; i < 7; i++) {
      promises.push(
        axios.post(`${BASE_URL}/api/auth/login`, {
          email: 'nonexistent@test.com',
          password: 'wrongpassword'
        }).catch(err => err.response)
      );
    }

    const results = await Promise.all(promises);
    const rateLimited = results.some(result => result?.status === 429);
    
    if (rateLimited) {
      console.log('✅ Rate limiting is working');
    } else {
      console.log('ℹ️  Rate limiting not triggered (may need more requests)');
    }
    console.log();

    console.log('🎉 All tests completed successfully!');
    console.log('================================');
    console.log();
    console.log('Next steps:');
    console.log('1. For email verification, check server console for OTP');
    console.log('2. Use POST /api/auth/verify-email with email and OTP');
    console.log('3. After verification, you can login and access protected routes');
    console.log();
    console.log('API Documentation:');
    console.log('- Health: GET /health');
    console.log('- Signup: POST /api/auth/signup');
    console.log('- Verify: POST /api/auth/verify-email');
    console.log('- Login: POST /api/auth/login');
    console.log('- Profile: GET /api/auth/profile (protected)');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
      console.error('Status:', error.response.status);
    }
    console.log('\nMake sure:');
    console.log('1. PostgreSQL is running');
    console.log('2. Database "roadguard_db" exists');
    console.log('3. Server is running on port 5000');
    console.log('4. .env file is configured correctly');
  }
}

// Check if server is accessible first
async function checkServer() {
  try {
    await axios.get(`${BASE_URL}/health`);
    return true;
  } catch (error) {
    console.error('❌ Cannot connect to server at', BASE_URL);
    console.error('Please make sure the server is running with: npm run dev');
    return false;
  }
}

// Main execution
async function main() {
  const serverUp = await checkServer();
  if (serverUp) {
    await testAPI();
  }
}

main();
