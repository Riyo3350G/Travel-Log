import dbClient from '../utils/db.js';
import redisClient from '../utils/redis.js';

class AppController {
  static async getStatus(req, res) {
    const redisStatus = redisClient.isAlive();
    const dbStatus = dbClient.isAlive();
    if (redisStatus && dbStatus) {
      res.status(200).json({ redis: true, db: true });
    } else {
      res.status(500).json({ redis: redisStatus, db: dbStatus });
    }
  }
}

export default AppController;
