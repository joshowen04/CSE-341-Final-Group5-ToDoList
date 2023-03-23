const request = require('supertest');
const app = require('../server');
const Todo = require('../models/todo');
const mongoose = require('mongoose');

async function validRequest(todoItem, route, calledWith) {
  const mockFind = jest.fn().mockImplementation(() =>
    Promise.resolve(todoItem)
  );
  jest.spyOn(Todo, 'find').mockImplementation(mockFind);
  const response = await request(app).get(route);

  expect(response.status).toBe(200);
  expect(response.body).toStrictEqual(todoItem);
  expect(mockFind).toHaveBeenCalledTimes(1);
  expect(mockFind).toHaveBeenCalledWith(calledWith);
  Todo.find.mockRestore();
}

async function invalidRequest(route, message) {
  const response = await request(app).get(route);

  expect(response.status).toBe(404);
  expect(response.body).toHaveProperty('message', message);
}

async function errorRequest(route) {
  jest.spyOn(Todo, 'find').mockImplementation(() => {
    throw new Error('Fake error');
  });

  const response = await request(app).get(route);

  expect(response.status).toBe(500);
  expect(response.body).toHaveProperty('message', 'Fake error');

  Todo.find.mockRestore();
}

describe('findByUserId', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should return todos for a valid user id', async () => {
    const todoItem = [{
      userId: '000000',
      title: 'Test todo',
      completed: false
    }]
    await validRequest(todoItem, `/todo/findByUserId/${todoItem[0].userId}`, { userId: todoItem[0].userId });
  });

  it('should return no todos found for fake id', async () => {
    await invalidRequest('/todo/findByUserId/invalid-id', 'No todos found');
  });

  it('should return a 500 error if there is an error in the database', async () => {
    await errorRequest('/todo/findByUserId/123');
  });
});

describe('findById', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should return a valid todo for a valid id', async () => {
    const todoItem = [{
      _id: '8219823bb185302d39d9ef50',
      userId: '000000',
      title: 'Test todo',
      completed: false
    }]
    await validRequest(todoItem, `/todo/findById/${todoItem[0]._id}`, { _id: todoItem[0]._id });
  });

  it('should return todo not found for fake id', async () => {
    await invalidRequest('/todo/findById/8219823bb185302d39d9ef50', 'Todo not found');
  });

  it('should return a 500 error if there is an error in the database', async () => {
    await errorRequest('/todo/findById/test');
  });
});

describe('findByStatus', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should return todos for a status', async () => {
    const todoItem = [{
      userId: '000000',
      title: 'Test todo',
      status: 'complete',
    }]
    await validRequest(todoItem, `/todo/findByStatus/${todoItem[0].status}`, { status: todoItem[0].status });
  });

  it('should return no todos found for fake status', async () => {
    await invalidRequest('/todo/findByStatus/not-status-1', 'No todos found');
  });

  it('should return a 500 error if there is an error in the database', async () => {
    await errorRequest('/todo/findByStatus/123');
  });
});

describe('findByType', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should return todos for a status', async () => {
    const todoItem = [{
      userId: '000000',
      title: 'Test todo',
      status: 'complete',
      type: 'general'
    }]
    await validRequest(todoItem, `/todo/findByType/${todoItem[0].type}`, { type: todoItem[0].type });
  });

  it('should return no todos found for fake type', async () => {
    await invalidRequest('/todo/findByType/not-type-13274912347913', 'No todos found');
  });

  it('should return a 500 error if there is an error in the database', async () => {
    await errorRequest('/todo/findByType/123');
  });
});

describe('addTodoItem', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a new todo item with valid data', async () => {
    const todoData = {
      userId: '1234567890',
      created: new Date().toISOString(),
      proposedStartDate: new Date().toISOString(),
      neededBy: new Date().toISOString(),
      actualStartDate: new Date().toISOString(),
      actualEndDate: new Date().toISOString(),
      title: 'Test todo',
      text: 'Test todo description',
      type: 'Personal',
      subTasks: ['task 1', 'task 2'],
      priority: 2,
      status: 'Pending',
      lastUpdated: new Date().toISOString(),
    };

    const response = await request(app)
      .post('/todo')
      .send(todoData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');

    const todo = await Todo.findOne({ _id: response.body._id });
    expect(todo.userId).toBe(todoData.userId);
    expect(todo.title).toBe(todoData.title);
    expect(todo.text).toBe(todoData.text);
    await Todo.deleteOne({ _id: response.body._id });
  });

  it('should return a 400 error if not all fields are provided', async () => {
    const todo = {
      userId: '1234567890',
      created: new Date().toISOString(),
      title: 'Test todo',
      text: 'Test todo description',
      type: 'Personal',
      subTasks: [],
      priority: 2,
      status: 'Pending',
      lastUpdated: new Date().toISOString(),
    };

    const response = await request(app)
      .post('/todo')
      .send(todo);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('All fields must be filled out.');
  });

  it('should return a 500 error if there is an error in the database', async () => {
    // Make the save() function throw an error
    jest.spyOn(Todo.prototype, 'save').mockImplementation(() => {
      throw new Error('Fake error');
    });

    const todoData = {
      userId: '1234567890',
      created: new Date().toISOString(),
      proposedStartDate: new Date().toISOString(),
      neededBy: new Date().toISOString(),
      actualStartDate: new Date().toISOString(),
      actualEndDate: new Date().toISOString(),
      title: 'Test todo',
      text: 'Test todo description',
      type: 'Personal',
      subTasks: ['task 1', 'task 2'],
      priority: 2,
      status: 'Pending',
      lastUpdated: new Date().toISOString(),
    };

    const response = await request(app)
      .post('/todo')
      .send(todoData);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Fake error');

    Todo.prototype.save.mockRestore();
  });
});

describe('updateTodoItem', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  let todoData = {
    userId: '1234567890',
    created: new Date().toISOString(),
    proposedStartDate: new Date().toISOString(),
    neededBy: new Date().toISOString(),
    actualStartDate: new Date().toISOString(),
    actualEndDate: new Date().toISOString(),
    title: 'Test todo',
    text: 'Test todo description',
    type: 'Personal',
    subTasks: ['task 1', 'task 2'],
    priority: 2,
    status: 'Pending',
    lastUpdated: new Date().toISOString(),
  }

  it('should update a todo item', async () => {
    const createResponse = await request(app)
      .post('/todo')
      .send(todoData);
    const itemId = createResponse.body._id;

    // Whoops I meant to say I created this at the dawn of time, also known as 1970.
    todoData.created = new Date(0).toISOString();

    const updateResponse = await request(app)
      .put(`/todo/${itemId}`)
      .send(todoData);

    expect(updateResponse.status).toBe(204);
  });

  it('should return a 404 error if there is no matching ID', async () => {
    const response = await request(app)
      .put('/todo/000000000000000000000000')
      .send(todoData);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Item not found');
  })

  it('should return a 500 error if there is an error in the database', async () => {
    // Make the save() function throw an error
    jest.spyOn(Todo, 'findByIdAndUpdate').mockImplementation(() => {
      throw new Error('Fake error');
    });

    const response = await request(app)
      .put('/todo/000000000000000000000000')
      .send(todoData);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Fake error');

    Todo.findByIdAndUpdate.mockRestore();
  });
});

describe('deleteTodoItem', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  let todoData = {
    userId: '1234567890',
    created: new Date().toISOString(),
    proposedStartDate: new Date().toISOString(),
    neededBy: new Date().toISOString(),
    actualStartDate: new Date().toISOString(),
    actualEndDate: new Date().toISOString(),
    title: 'Test todo',
    text: 'Test todo description',
    type: 'Personal',
    subTasks: ['task 1', 'task 2'],
    priority: 2,
    status: 'Pending',
    lastUpdated: new Date().toISOString(),
  }

  it('should delete a todo item', async () => {
    const createRes = await request(app)
      .post('/todo')
      .send(todoData)

    const deleteRes = await request(app)
      .delete(`/todo/${createRes.body._id}`)

    expect(deleteRes.status).toBe(204);

    // Verify that the item was deleted
    const getRes = await request(app)
      .get(`/todo/findById/${createRes.body._id}`)

    expect(getRes.status).toBe(404);
    expect(getRes.body).toHaveProperty('message', 'Todo not found');
  });

  it('invalid ID should get turned away', async () => {
    const response = await request(app)
      .delete('/todo/invalid-id');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid ID.');
  });
});
