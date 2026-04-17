import mongoose from 'mongoose';

let portfolioConnection;
let vaultConnection;

export const connectPortfolioDB = async () => {
  try {
    portfolioConnection = mongoose.createConnection(process.env.MONGO_URI_PORTFOLIO, {
      serverSelectionTimeoutMS: 30000, // Increased from 5s to 30s for Atlas
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      family: 4, // Use IPv4 only
    });
    
    portfolioConnection.on('connected', () => console.log('✅ Portfolio DB connected'));
    portfolioConnection.on('error', (err) => console.error('❌ Portfolio DB error:', err.message));
    
    // Wait for connection to be ready
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Portfolio DB connection timeout')), 35000);
      portfolioConnection.once('connected', () => {
        clearTimeout(timeout);
        resolve();
      });
      portfolioConnection.once('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });
  } catch (error) {
    console.error('❌ Failed to connect to Portfolio DB:', error.message);
    process.exit(1);
  }
};

export const connectVaultDB = async () => {
  try {
    vaultConnection = mongoose.createConnection(process.env.MONGO_URI_VAULT, {
      serverSelectionTimeoutMS: 30000, // Increased from 5s to 30s for Atlas
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
      family: 4, // Use IPv4 only
    });
    
    vaultConnection.on('connected', () => console.log('✅ Vault DB connected'));
    vaultConnection.on('error', (err) => console.error('❌ Vault DB error:', err.message));
    
    // Wait for connection to be ready
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Vault DB connection timeout')), 35000);
      vaultConnection.once('connected', () => {
        clearTimeout(timeout);
        resolve();
      });
      vaultConnection.once('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });
  } catch (error) { 
    console.error('❌ Failed to connect to Vault DB:', error.message);
    process.exit(1);
  }
};

export const getPortfolioDB = () => {
  if (!portfolioConnection) throw new Error('Portfolio DB not initialized');
  return portfolioConnection;
};

export const getVaultDB = () => {
  if (!vaultConnection) throw new Error('Vault DB not initialized');
  return vaultConnection;
};
