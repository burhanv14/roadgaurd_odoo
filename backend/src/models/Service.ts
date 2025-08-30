import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import { IService } from '../types';

// Service creation attributes (optional id, timestamps)
interface ServiceCreationAttributes extends Optional<IService, 'id' | 'createdAt' | 'updatedAt'> {}

class Service extends Model<IService, ServiceCreationAttributes> implements IService {
  public id!: string;
  public workshop_id!: string;
  public name!: string;
  public description!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Service.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  workshop_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'workshops',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Service name is required'
      },
      len: {
        args: [2, 255],
        msg: 'Service name must be between 2 and 255 characters'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Service description is required'
      },
      len: {
        args: [10, 1000],
        msg: 'Service description must be between 10 and 1000 characters'
      }
    }
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
  tableName: 'services',
  timestamps: true,
  indexes: [
    {
      fields: ['workshop_id']
    },
    {
      fields: ['name']
    }
  ]
});

export default Service;
