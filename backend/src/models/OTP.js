const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OTP = sequelize.define('OTP', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 6]
    }
  },
  type: {
    type: DataTypes.ENUM('email_verification', 'password_reset'),
    allowNull: false
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  isUsed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'otps',
  timestamps: true,
  indexes: [
    {
      fields: ['email', 'type']
    },
    {
      fields: ['expiresAt']
    }
  ]
});

// Static methods
OTP.generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

OTP.createEmailVerificationOTP = async (email) => {
  // Delete any existing unused OTPs for this email and type
  await OTP.destroy({
    where: {
      email,
      type: 'email_verification',
      isUsed: false
    }
  });

  const otp = OTP.generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  return await OTP.create({
    email,
    otp,
    type: 'email_verification',
    expiresAt
  });
};

OTP.createPasswordResetOTP = async (email) => {
  // Delete any existing unused OTPs for this email and type
  await OTP.destroy({
    where: {
      email,
      type: 'password_reset',
      isUsed: false
    }
  });

  const otp = OTP.generateOTP();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  return await OTP.create({
    email,
    otp,
    type: 'password_reset',
    expiresAt
  });
};

module.exports = OTP;
