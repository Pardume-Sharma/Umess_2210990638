import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'UMESS API Documentation',
      version: '1.0.0',
      description: 'Complete API documentation for University Mess Management System',
      contact: {
        name: 'UMESS Support',
        email: 'support@umess.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
      {
        url: 'https://your-production-url.com',
        description: 'Production server',
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
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            rollNumber: { type: 'string' },
            hostel: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin'] },
          },
        },
        Meal: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            type: { type: 'string', enum: ['breakfast', 'lunch', 'dinner'] },
            date: { type: 'string', format: 'date' },
            items: { type: 'array', items: { type: 'string' } },
          },
        },
        Booking: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            mealId: { type: 'string' },
            date: { type: 'string', format: 'date' },
            status: { type: 'string', enum: ['pending', 'confirmed', 'cancelled'] },
          },
        },
        Review: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            rating: { type: 'number', minimum: 1, maximum: 5 },
            comment: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
          },
        },
        Notice: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            content: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
            priority: { type: 'string', enum: ['low', 'medium', 'high'] },
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
  apis: ['./routes/*.js', './controllers/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
