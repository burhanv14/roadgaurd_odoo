import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import { IOtp } from '../types';

// OTP creation attributes (optional id, timestamps, and optional user_id for pre-registration)
interface OtpCreationAttributes extends Optional<IOtp, 'id' | 'createdAt' | 'updatedAt' | 'is_used' | 'user_id'> {}

class Otp extends Model<IOtp, OtpCreationAttributes> implements IOtp {
  public id!: string;
  public user_id!: string | null; // Nullable for pre-registration verification
  public email!: string; // Add email field for pre-registration verification
  public otp_code!: string;
  public purpose!: 'VERIFICATION' | 'PASSWORD_RESET' | 'EMAIL_VERIFICATION';
  public expires_at!: Date;
  public is_used!: boolean;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Instance method to check if OTP is expired
  public isExpired(): boolean {
    return new Date() > this.expires_at;
  }

  // Static method to generate OTP
  public static generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Static method to calculate expiry time
  public static getExpiryTime(minutes: number = 5): Date {
    const now = new Date();
    return new Date(now.getTime() + minutes * 60000);
  }
}

Otp.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true, // Allow null for pre-registration verification
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: {
        msg: 'Must be a valid email address'
      }
    }
  },
  otp_code: {
    type: DataTypes.STRING(6),
    allowNull: false,
    validate: {
      len: {
        args: [6, 6],
        msg: 'OTP must be exactly 6 characters'
      },
      isNumeric: {
        msg: 'OTP must contain only numbers'
      }
    }
  },
  purpose: {
    type: DataTypes.ENUM('VERIFICATION', 'PASSWORD_RESET', 'EMAIL_VERIFICATION'),
    allowNull: false,
    defaultValue: 'VERIFICATION'
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true
    }
  },
  is_used: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  tableName: 'otps',
  timestamps: true,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['email']
    },
    {
      fields: ['otp_code']
    },
    {
      fields: ['expires_at']
    },
    {
      fields: ['purpose']
    }
  ]
});

export default Otp;
