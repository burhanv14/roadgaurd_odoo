import User from './User';
import Otp from './Otp';

// Define associations
User.hasMany(Otp, {
  foreignKey: 'user_id',
  as: 'otps',
  onDelete: 'CASCADE'
});

Otp.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
  onDelete: 'CASCADE'
});

// Export all models
export {
  User,
  Otp
};
