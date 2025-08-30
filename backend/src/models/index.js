const User = require('./User');
const OTP = require('./OTP');

// Define associations
User.hasMany(OTP, {
  foreignKey: 'email',
  sourceKey: 'email',
  as: 'otps'
});

OTP.belongsTo(User, {
  foreignKey: 'email',
  targetKey: 'email',
  as: 'user'
});

module.exports = {
  User,
  OTP
};
