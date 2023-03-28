const request = require('supertest');
const app = require('../server');
const User = require('../models/user');
const mongoose = require('mongoose');

async function validRequest(userItem, route, calledWith) {
  const mockFind = jest.fn().mockImplementation(() =>
    Promise.resolve(userItem)
  );
  jest.spyOn(User, 'find').mockImplementation(mockFind);
  const response = await request(app).get(route);

  expect(response.status).toBe(200);
  expect(response.body).toStrictEqual(userItem);
  expect(mockFind).toHaveBeenCalledTimes(1);
  expect(mockFind).toHaveBeenCalledWith(calledWith);
  User.find.mockRestore();
}

async function invalidRequest(route, message) {
  const response = await request(app).get(route);

  expect(response.status).toBe(404);
  expect(response.body).toHaveProperty('message', message);
}

async function errorRequest(route) {
  jest.spyOn(User, 'find').mockImplementation(() => {
    throw new Error('Fake error');
  });

  const response = await request(app).get(route);

  expect(response.status).toBe(500);
  expect(response.body).toHaveProperty('message', 'Fake error');

  User.find.mockRestore();
}

describe('read_user', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should return user for a valid user id', async () => {
    const userItem = [{
      userId: '000000',
      userName: 'userName'
    }]
    await validRequest(userItem, `/users/read_user/${userItem[0].userId}`, { userId: userItem[0].userId });
  });

  it('should return no users found for fake id', async () => {
    await invalidRequest('/users/read_user/invalid-id', 'No user found');
  });

  it('should return a 500 error if there is an error in the database', async () => {
    await errorRequest('/users/read_user/123');
  });
});


describe('create_user', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a new user with valid data', async () => {
    const userData = {
      userName: 'TestUser',
      updated: new Date().toISOString(),
    };

    const response = await request(app)
      .post('/users')
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');

    const user = await User.findOne({ _id: response.body._id });
    expect(user.userId).toBe(userData.userId);
    expect(user.title).toBe(userData.title);
    expect(user.text).toBe(userData.text);
    await User.deleteOne({ _id: response.body._id });
  });

  it('should return a 400 error if not all fields are provided', async () => {
    const user = {};

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('All fields must be filled out.');
  });

  it('should return a 500 error if there is an error in the database', async () => {
    // Make the save() function throw an error
    jest.spyOn(User.prototype, 'save').mockImplementation(() => {
      throw new Error('Fake error');
    });

    const userData = {
      userName: 'TestUser',
      updated: new Date().toISOString(),
    };

    const response = await request(app)
      .post('/users')
      .send(userData);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Fake error');

    User.prototype.save.mockRestore();
  });
});

describe('update_user', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  let userData = {
    userName: 'TestUser',
    updated: new Date().toISOString(),
  };

  it('should update a user', async () => {
    const createResponse = await request(app)
      .post('/users')
      .send(userData);
    const itemId = createResponse.body._id;

    // Whoops I meant to say I created this at the dawn of time, also known as 1970.
    userData.created = new Date(0).toISOString();

    const updateResponse = await request(app)
      .put(`/users/${itemId}`)
      .send(userData);

    expect(updateResponse.status).toBe(204);
  });

  it('should return a 404 error if there is no matching ID', async () => {
    const response = await request(app)
      .put('/users/000000000000000000000000')
      .send(userData);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Item not found');
  })

  it('should return a 500 error if there is an error in the database', async () => {
    // Make the save() function throw an error
    jest.spyOn(User, 'update_user').mockImplementation(() => {
      throw new Error('Fake error');
    });

    const response = await request(app)
      .put('/users/000000000000000000000000')
      .send(userData);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Fake error');

    User.findByIdAndUpdate.mockRestore();
  });
});

describe('delete_user', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  let userData = {
    userName: 'TestUser',
    updated: new Date().toISOString(),
  }

  it('should delete a todo item', async () => {
    const createRes = await request(app)
      .post('/users')
      .send(userData)

    const deleteRes = await request(app)
      .delete(`/users/${createRes.body._id}`)

    expect(deleteRes.status).toBe(204);

    // Verify that the item was deleted
    const getRes = await request(app)
      .get(`/users/read_user/${createRes.body._id}`)

    expect(getRes.status).toBe(404);
    expect(getRes.body).toHaveProperty('message', 'User not found');
  });

  it('invalid ID should get turned away', async () => {
    const response = await request(app)
      .delete('/users/invalid-id');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid ID.');
  });
});
