export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Referly API Specification',
    version: '1.0.0',
    description:
      'Production-quality RESTful API documentation for Referly — Job Referral & Career Networking SaaS Platform.',
    contact: {
      name: 'Referly Engineering Team',
      email: 'engineering@referly.io',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000/api/v1',
      description: 'Local Development Server',
    },
  ],
  paths: {
    '/auth/register': {
      post: {
        summary: 'Register a new Job Seeker or Referrer account',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'Arjun Mehta' },
                  email: { type: 'string', example: 'arjun.mehta@example.com' },
                  password: { type: 'string', example: 'Secret123!' },
                  role: { type: 'string', enum: ['seeker', 'referrer'], default: 'seeker' },
                  company: { type: 'string', example: 'Stripe' },
                  position: { type: 'string', example: 'Staff Software Engineer' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Account registered successfully.' },
          400: { description: 'Validation error.' },
          409: { description: 'Email already exists.' },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Authenticate with email and password',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'arjun.mehta@example.com' },
                  password: { type: 'string', example: 'password123' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Authentication successful. Returns JWT access and refresh tokens.' },
          401: { description: 'Invalid credentials.' },
        },
      },
    },
    '/jobs': {
      get: {
        summary: 'Search, filter, and paginate verified job referral listings',
        tags: ['Jobs'],
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'workMode', in: 'query', schema: { type: 'string', enum: ['Remote', 'Hybrid', 'On-site'] } },
          { name: 'jobType', in: 'query', schema: { type: 'string' } },
          { name: 'experienceLevel', in: 'query', schema: { type: 'string' } },
          { name: 'sortBy', in: 'query', schema: { type: 'string', enum: ['latest', 'salary'] } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: {
          200: { description: 'List of jobs retrieved.' },
        },
      },
      post: {
        summary: 'Publish a new referral job opportunity (Referrers & Admins)',
        tags: ['Jobs'],
        security: [{ bearerAuth: [] }],
        responses: {
          201: { description: 'Job created.' },
          403: { description: 'Forbidden.' },
        },
      },
    },
    '/referrals': {
      post: {
        summary: 'Candidate creates a referral request for an open role',
        tags: ['Referrals'],
        security: [{ bearerAuth: [] }],
        responses: {
          201: { description: 'Referral request dispatched.' },
          400: { description: 'Duplicate active request exists.' },
          403: { description: 'Plan referral quota exceeded.' },
        },
      },
    },
    '/admin/analytics': {
      get: {
        summary: 'Get database-driven platform analytics & charts (Admin)',
        tags: ['Administration'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Analytics computed from MongoDB collections.' },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};
