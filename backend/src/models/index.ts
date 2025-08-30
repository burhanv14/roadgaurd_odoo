import User from './User';
import Otp from './Otp';
import Workshop from './Workshop';
import Service from './Service';
import Review from './Review';

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

// Workshop associations
User.hasMany(Workshop, {
  foreignKey: 'ownerId',
  as: 'workshops',
  onDelete: 'CASCADE'
});

Workshop.belongsTo(User, {
  foreignKey: 'ownerId',
  as: 'owner',
  onDelete: 'CASCADE'
});

// Service associations
Workshop.hasMany(Service, {
  foreignKey: 'workshop_id',
  as: 'services',
  onDelete: 'CASCADE'
});

Service.belongsTo(Workshop, {
  foreignKey: 'workshop_id',
  as: 'workshop',
  onDelete: 'CASCADE'
});

// Review associations
Workshop.hasMany(Review, {
  foreignKey: 'workshop_id',
  as: 'reviews',
  onDelete: 'CASCADE'
});

Review.belongsTo(Workshop, {
  foreignKey: 'workshop_id',
  as: 'workshop',
  onDelete: 'CASCADE'
});

User.hasMany(Review, {
  foreignKey: 'user_id',
  as: 'reviews',
  onDelete: 'CASCADE'
});

Review.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
  onDelete: 'CASCADE'
});

// Export all models
export {
  User,
  Otp,
  Workshop,
  Service,
  Review
};
