import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env['DB_NAME']!,
  process.env['DB_USER']!,
  process.env['DB_PASSWORD']!,
  {
    host: process.env['DB_HOST']!,
    port: parseInt(process.env['DB_PORT']!, 10),
    dialect: 'postgres',
    logging: process.env['NODE_ENV'] === 'development' ? false : false, // Disable logging to reduce overhead
    pool: {
      max: 20, // Increase max connections
      min: 5,  // Maintain minimum connections
      acquire: 60000, // Increase acquire timeout
      idle: 10000,
      evict: 1000 // Add connection eviction
    },
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: true
    },
    // Add query optimization
    benchmark: process.env['NODE_ENV'] === 'development',
    // Enable connection retry
    retry: {
      match: [/SequelizeConnectionError/],
      max: 3
    }
  }
);

// Test the connection
const testConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', (error as Error).message);
    process.exit(1);
  }
};

export { sequelize, testConnection };
