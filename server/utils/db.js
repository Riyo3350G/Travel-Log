import mongoose from 'mongoose';

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || '27017';
const database = process.env.DB_DATABASE || 'travel_log';
const url = `mongodb://${host}:${port}/${database}`;

class dbClient {
  constructor() {
    this.isConnected = false;
    mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(() => {
      console.log('Database connected');
      this.isConnected = true;
    }).catch(err => {
      console.error('Database connection error', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Database disconnected');
      this.isConnected = false;
    });
  }

  isAlive() {
    return this.isConnected;
  }
}

export default new dbClient();