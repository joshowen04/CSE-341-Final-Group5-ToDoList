const request = require('supertest');
const app = require('../server');
const Inventory = require('../models/inventory');
const mongoose = require('mongoose');

async function validRequest(inventoryItem, route, calledWith) {
  const mockFind = jest
    .fn()
    .mockImplementation(() => Promise.resolve(inventoryItem));
  jest.spyOn(Inventory, 'find').mockImplementation(mockFind);
  const response = await request(app).get(route);

  expect(response.status).toBe(200);
  expect(response.body).toStrictEqual(inventoryItem);
  expect(mockFind).toHaveBeenCalledTimes(1);
  expect(mockFind).toHaveBeenCalledWith(calledWith);
  Inventory.find.mockRestore();
}

async function invalidRequest(route, message) {
  const response = await request(app).get(route);

  expect(response.status).toBe(404);
  expect(response.body).toHaveProperty('message', message);
}

async function errorRequest(route) {
  jest.spyOn(Inventory, 'find').mockImplementation(() => {
    throw new Error('Test error');
  });

  const response = await request(app).get(route);

  expect(response.status).toBe(500);
  expect(response.body).toHaveProperty('message', 'Test error');

  Inventory.find.mockRestore();
}

describe('get inventory item by id', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should return inventory item with a valid inventory id', async () => {
    const inventoryItem = [
      {
        invId: '000000',
        name: 'name',
        description: 'description',
        quantity: '0',
        minimumQuantity: '0',
        updated: '2023-03-15T00:00:00.000+00:00'
      }
    ];
    await validRequest(
      inventoryItem,
      `/inventory/getInvById/${inventoryItem[0].invId}`,
      {
        invId: inventoryItem[0].invId
      }
    );
  });

  it('should return no users found for fake id', async () => {
    await invalidRequest(
      '/inventory/getInvById/bad-id',
      'No inventory item found'
    );
  });

  it('a 500 error should be returned', async () => {
    await errorRequest('/inventory/read_user/123');
  });
});

describe('create new inventory item', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a new inventory item with valid data', async () => {
    const inventoryItem = [
      {
        invId: '000000',
        name: 'name',
        description: 'description',
        quantity: '0',
        minimumQuantity: '0',
        updated: '2023-03-15T00:00:00.000+00:00'
      }
    ];

    const response = await request(app).post('/inventory').send(inventoryItem);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');

    const inv = await Inventory.findOne({ _id: response.body._id });
    expect(inv.invId).toBe(inventoryItem.userId);
    await inv.deleteOne({ _id: response.body._id });
  });

  it('should return a 400 error if not all fields are provided', async () => {
    const inventoryItem = {};

    const response = await request(app).post('/inventory').send(inventoryItem);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('All fields must be filled out.');
  });

  it('should return a 500 error if there is an error in the database', async () => {
    // Make the save() function throw an error
    jest.spyOn(Inventory.prototype, 'save').mockImplementation(() => {
      throw new Error('Test error');
    });

    const inventoryItem = [
      {
        invId: '000000',
        name: 'name',
        description: 'description',
        quantity: '0',
        minimumQuantity: '0',
        updated: '2023-03-15T00:00:00.000+00:00'
      }
    ];

    const response = await request(app).post('/inventory').send(inventoryItem);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Fake error');

    Inventory.prototype.save.mockRestore();
  });
});

describe('update inventory item', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  const inventoryItem = [
    {
      invId: '000000',
      name: 'name',
      description: 'description',
      quantity: '0',
      minimumQuantity: '0',
      updated: '2023-03-15T00:00:00.000+00:00'
    }
  ];
  it('should update an inventory item', async () => {
    const createResponse = await request(app)
      .post('/inventory')
      .send(inventoryItem);
    const itemId = createResponse.body._id;

    inventoryItem.created = new Date(0).toISOString();

    const updateResponse = await request(app)
      .put(`/inventory/${itemId}`)
      .send(inventoryItem);

    expect(updateResponse.status).toBe(204);
  });

  it('should return a 404 error if there is no matching ID', async () => {
    const response = await request(app).put('/users/0000').send(inventoryItem);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('All fields must be filled out.');
  });

  it('should return a 500 error if there is an error in the database', async () => {
    // Make the save() function throw an error
    jest.spyOn(Inventory, 'update_user').mockImplementation(() => {
      throw new Error('Test error');
    });

    const response = await request(app).put('/users/000000').send(Inventory);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'test error');

    Inventory.findByIdAndUpdate.mockRestore();
  });
});

describe('delete inventory item', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  const inventoryItem = [
    {
      invId: '000000',
      name: 'name',
      description: 'description',
      quantity: '0',
      minimumQuantity: '0',
      updated: '2023-03-15T00:00:00.000+00:00'
    }
  ];

  it('should delete a todo item', async () => {
    const createRes = await request(app).post('/inventory').send(inventoryItem);

    const deleteRes = await request(app).delete(
      `/inventory/${createRes.body._id}`
    );

    expect(deleteRes.status).toBe(204);

    // Verify that the item was deleted
    const getRes = await request(app).get(
      `/inventory/getInvById/${createRes.body._id}`
    );

    expect(getRes.status).toBe(404);
    expect(getRes.body).toHaveProperty('message', 'User not found');
  });

  it('invalid ID should get turned away', async () => {
    const response = await request(app).delete('/inventory/invalid-id');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid ID.');
  });
});
