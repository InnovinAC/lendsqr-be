import request from 'supertest';
import express from 'express';
import HealthRoute from '@/routes/health.route';

describe('HealthRoute', () => {
  let app: express.Express;
  let healthRoute: HealthRoute;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    healthRoute = new HealthRoute(app);
  });

  describe('initRoutes', () => {
    it('should initialize health routes', () => {
      healthRoute.initRoutes();

      expect(healthRoute).toBeDefined();
    });

    it('should respond to health check endpoint', async () => {
      healthRoute.initRoutes();

      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.text).toBe('OK');
    });
  });
}); 