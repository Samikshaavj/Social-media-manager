require('dotenv').config({ path: '../../.env' }); // Load .env from root if needed, or local
const app = require('./app');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // TODO: Connect to MongoDB here
    console.log('Database connection placeholder');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
