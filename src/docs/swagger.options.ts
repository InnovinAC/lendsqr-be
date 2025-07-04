const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Lendsqr API',
      version: '1.0.0',
      description: 'API documentation for Lendsqr',
    },
    servers: [
      {
        url: '/api/v1',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            email: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            phoneNumber: { type: 'string' },
            isBlacklisted: { type: 'boolean' },
            blacklistReason: { type: 'string' },
            blacklistedAt: { type: 'string', format: 'date-time', nullable: true },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Wallet: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            user_id: { type: 'integer' },
            balance: { type: 'number' },
            currency: { type: 'string' },
            is_active: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Transaction: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            wallet_id: { type: 'integer' },
            type: {
              type: 'string',
              enum: ['fund', 'transfer_in', 'transfer_out', 'transfer', 'withdrawal'],
            },
            amount: { type: 'number' },
            balance_before: { type: 'number' },
            balance_after: { type: 'number' },
            currency: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'failed', 'completed', 'cancelled'] },
            reference: { type: 'string' },
            recipient_wallet_id: { type: 'integer' },
            description: { type: 'string' },
            metadata: {},
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Scan for JSDoc OpenAPI annotations
  apis: ['./src/routes/**/*.ts', './src/controllers/**/*.ts'],
};

export default swaggerOptions;
