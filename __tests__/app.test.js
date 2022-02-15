const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService.js');

const agent = request.agent(app);
jest.mock('../lib/utils/user');

const mockUser = {
  email: 'email@email.com',
  password: '2',
};

describe('backend-gitty routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should redirect to the github oauth page upon login', async () => {
    const req = await request(app).get('/api/v1/users/login');

    expect(req.header.location).toMatch(
      /https:\/\/github.com\/login\/oauth\/authorize\?client_id=[\w\d]+&redirect_uri=http:\/\/localhost:7890\/api\/v1\/users\/login\/callback&scope=user/i
    );
  });

  it('should login and redirect users to /api/v1/users/dashboard', async () => {
    const res = await request
      .agent(app)
      .get('/api/v1/users/login/callback?code=42')
      .redirects(1);

    expect(res.status).toEqual(200);
  });

  it('logs a user out', async () => {
    const res = await agent.delete('/api/v1/users/sessions').send(mockUser);

    expect(res.body).toEqual({
      success: true,
      message: 'Signed out successfully!',
    });
  });

  it('creates a post only when a user is logged in', async () => {
    await agent.get('/api/v1/users/login/callback?code=42').redirects(1);
    const newPost = await agent
      .post('/api/v1/posts')
      .send({ post: 'This is a post' });

    expect(newPost.body).toEqual({
      id: expect.any(String),
      userId: expect.any(String),
      post: 'This is a post',
    });
  });

  it('Lists all users posts', async () => {
    await agent.get('/api/v1/users/login/callback?code=42').redirects(1);
    await agent.post('/api/v1/posts').send({ post: 'This is a post' });
    const res = await agent.get('/api/v1/posts');

    expect(res.body).toEqual([
      {
        id: expect.any(String),
        userId: expect.any(String),
        post: 'This is a post',
      },
    ]);
  });
});
