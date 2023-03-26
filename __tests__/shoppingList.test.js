const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const ShoppingListItem = require('../models/shoppingList');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('Shopping List Controller', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    process.env.MONGODB_URL = mongoUri;
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('GET /shoppingList', () => {
    test('should return an empty array if there are no shopping list items', async () => {
      const response = await request(app).get('/shoppingList');
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([]);
    });

    test('should return an array of shopping list items if there are any', async () => {
      const shoppingListItem = new ShoppingListItem({ name: 'Apples', quantity: 3 });
      await shoppingListItem.save();

      const response = await request(app).get('/shoppingList');
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0]).toMatchObject({
        name: 'Apples',
        quantity: 3
      });
    });
  });

  describe('GET /shoppingList/:id', () => {
    test('should return 404 if the id is invalid', async () => {
      const response = await request(app).get('/shoppingList/invalid-id');
      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({ message: 'Invalid id' });
    });

    test('should return 404 if the shopping list item is not found', async () => {
      const validId = mongoose.Types.ObjectId().toHexString();
      const response = await request(app).get(`/shoppingList/${validId}`);
      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({ message: 'Item not found' });
    });

    test('should return the shopping list item if it exists', async () => {
      const shoppingListItem = new ShoppingListItem({ name: 'Apples', quantity: 3 });
      await shoppingListItem.save();

      const response = await request(app).get(`/shoppingList/${shoppingListItem._id}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        name: 'Apples',
        quantity: 3
      });
    });
  });

  describe('POST /shoppingList', () => {
    test('should create a new shopping list item', async () => {
      const requestBody = { name: 'Bananas', quantity: 5 };

      const response = await request(app)
        .post('/shoppingList')
        .send(requestBody);

      expect(response.statusCode).toBe(201);
      expect(response.body).toMatchObject({
        name: 'Bananas',
        quantity: 5
      });
    });

    test('should return 409 if the shopping list item already exists', async () => {
      const shoppingListItem = new ShoppingListItem({ name: 'Oranges', quantity: 4 });
      await shoppingListItem.save();

      const requestBody = { name: 'Oranges', quantity: 4 };

      const response = await request(app)
        .post('/shoppingList')
        .send(requestBody);

      expect(response.statusCode).toBe(409);
    });
  });

  describe('PUT /shopping-list-items/:id', () => {
    it('should return 404 if item is not found', async () => {
      const res = await request(app)
        .put('/shopping-list-items/123')
        .send({ name: 'New Item', quantity: 10 });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Item not found');
    });

    it('should return 404 if id is invalid', async () => {
      const res = await request(app)
        .put('/shopping-list-items/invalid')
        .send({ name: 'New Item', quantity: 10 });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Invalid id');
    });

    it('should update the item and return it', async () => {
      const shoppingListItem = new ShoppingListItem({
        name: 'Item',
        quantity: 5
      });
      await shoppingListItem.save();

      const res = await request(app)
        .put(`/shopping-list-items/${shoppingListItem._id}`)
        .send({ name: 'New Item', quantity: 10 });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'New Item');
      expect(res.body).toHaveProperty('quantity', 10);
      expect(res.body).toHaveProperty('_id', shoppingListItem._id.toHexString());
    });
  });

  describe('DELETE /shopping-list-items/:id', () => {
    it('should return 404 if item is not found', async () => {
      const res = await request(app)
        .delete('/shopping-list-items/123');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Item not found');
    });

    it('should return 404 if id is invalid', async () => {
      const res = await request(app)
        .delete('/shopping-list-items/invalid');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Invalid id');
    });

    it('should delete the item and return success message', async () => {
      const shoppingListItem = new ShoppingListItem({
        name: 'Item',
        quantity: 5
      });
      await shoppingListItem.save();

      const res = await request(app)
        .delete(`/shopping-list-items/${shoppingListItem._id}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Item deleted successfully');

      const deletedItem = await ShoppingListItem.findById(shoppingListItem._id);
      expect(deletedItem).toBeNull();
    });
  });
});
