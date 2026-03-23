import mongoose from 'mongoose';

let portfolioConnection;
let vaultConnection;

export const connectPortfolioDB = async () => {
  try {
    portfolioConnection = mongoose.createConnection(process.env.MONGO_URI_PORTFOLIO);
    portfolioConnection.on('connected', () => console.log('✅ Portfolio DB connected'));
    portfolioConnection.on('error', (err) => console.error('❌ Portfolio DB error:', err));
    await portfolioConnection.asPromise();
  } catch (error) {
    console.error('Failed to connect to Portfolio DB:', error.message);
    process.exit(1);
  }
};

export const connectVaultDB = async () => {
  try {
    vaultConnection = mongoose.createConnection(process.env.MONGO_URI_VAULT);
    vaultConnection.on('connected', () => console.log('✅ Vault DB connected'));
    vaultConnection.on('error', (err) => console.error('❌ Vault DB error:', err));
    await vaultConnection.asPromise();
  } catch (error) {
    console.error('Failed to connect to Vault DB:', error.message);
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
