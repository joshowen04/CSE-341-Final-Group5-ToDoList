const mongoose = require('mongoose');
const {getShoppingList, getShoppingListItemById, createShoppingListItem} = require('../controllers/shoppingListController');
const ShoppingListItem = require('../models/shoppingList');
const request = require('supertest');
const app = require('../server');
require('dotenv').config();

describe('Shopping List Controller', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true});
  });

  afterAll(async () => {
    // Disconnect from test database
    await mongoose.disconnect();
  });

  afterEach(async () => {
    // Clear test database
    await ShoppingListItem.deleteMany();
  });

  describe('getShoppingList', () => {
    it('should return an empty array if there are no items in the shopping list', async () => {
      const status = jest.fn();
      const json = jest.fn();
      const req = {};
      const res = {
        setHeader: jest.fn(),
        status: status,
        json: json
      };

      await getShoppingList(req, res);

      expect(status).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledWith([]);
    });

    it('should return an array of items if there are items in the shopping list', async () => {
      const items = [
        {name: 'Milk', quantity: 1},
        {name: 'Eggs', quantity: 12},
      ];

      await ShoppingListItem.create(items);

      const req = {};
      const res = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getShoppingList(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining(items));
    });

    it('should return a 500 error if there is an error while retrieving the shopping list', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Simulate an error by causing an invalid MongoDB connection URL
      process.env.MONGODB_URL = 'invalid url';

      await getShoppingList(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe('getShoppingListItemById', () => {
    it('should return a 404 error if the id is invalid', async () => {
      const req = {
        params: {id: 'invalid id'},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getShoppingListItemById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({message: 'Invalid id'});
    });

    it('should return a 404 error if the item is not found', async () => {
      const req = {
        params: {id: mongoose.Types.ObjectId()},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getShoppingListItemById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({message: 'Item not found'});
    });

    it('should return the item if it exists', async () => {
      const item = {name: 'Milk', quantity: 1};
      const createdItem = await ShoppingListItem.create(item);

      const req = {
        params: {id: createdItem._id},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await getShoppingListItemById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(item);
    });
  });

  describe('createShoppingListItem', () => {
    it('should return a 400 error if the request body is missing the name field', async () => {
      const req = {
        body: {quantity: 1},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await createShoppingListItem(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({message: 'Missing name field'});
    });

    it('should create a new item and return it', async () => {
      const item = {name: 'Milk', quantity: 1};
      const req = {
        body: item,
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await createShoppingListItem(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(item));
    });
  });

  describe('updateShoppingListItem', () => {
    beforeEach(() => {
      // Clear all mocks before each test
      jest.clearAllMocks();
    });

    it('returns 404 for invalid id', async () => {
      const res = await request(app)
        .put('/shoppingList/invalidId')
        .send({name: 'newName', quantity: 2});

      expect(res.status).toBe(404);
      expect(res.body).toEqual({message: 'Invalid id'});
    });

    it('returns 404 if item is not found', async () => {
      const id = mongoose.Types.ObjectId().toString();

      // Mock the findByIdAndUpdate method to return null
      ShoppingListItem.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      const res = await request(app)
        .put(`/shoppingList/${id}`)
        .send({name: 'newName', quantity: 2});

      expect(res.status).toBe(404);
      expect(res.body).toEqual({message: 'Item not found'});
    });

    it('returns 200 and the updated item if it exists', async () => {
      const item = {name: 'Milk', quantity: 1};
      const createdItem = await ShoppingListItem.create(item);

      const res = await request(app)
        .put(`/shoppingList/${createdItem._id}`)
        .send({name: 'newName', quantity: 2});

      expect(res.status).toBe(200);
      expect(res.body).toEqual(expect.objectContaining({name: 'newName', quantity: 2}));
    });
  });

  describe('deleteShoppingListItem', () => {
    beforeEach(() => {
      // Clear all mocks before each test
      jest.clearAllMocks();
    });

    it('returns 404 for invalid id', async () => {
      const res = await request(app).delete('/shoppingList/invalidId');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Invalid id' })
    });

    it('returns 404 if item is not found', async () => {
      const id = mongoose.Types.ObjectId().toString();

      // Mock the findByIdAndRemove method to return null
      ShoppingListItem.findByIdAndRemove = jest.fn().mockResolvedValue(null);

      const res = await request(app).delete(`/shoppingList/${id}`);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({message: 'Item not found'});
      expect(ShoppingListItem.findByIdAndRemove).toHaveBeenCalledWith(id);
      expect(mongoose.connect).toHaveBeenCalled();
    });

    it('deletes item successfully', async () => {
      const id = mongoose.Types.ObjectId().toString();
      const item = {
        _id: id,
        name: 'itemName',
        quantity: 1,
        updated: new Date(),
      };

      // Mock the findByIdAndRemove method to return the deleted item
      ShoppingListItem.findByIdAndRemove = jest.fn().mockResolvedValue(item);

      const res = await request(app).delete(`/shoppingList/${id}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({message: 'Item deleted successfully'});
      expect(ShoppingListItem.findByIdAndRemove).toHaveBeenCalledWith(id);
      expect(mongoose.connect).toHaveBeenCalled();
    });

    it('returns 500 for server error', async () => {
      const id = mongoose.Types.ObjectId().toString();

      // Mock the findByIdAndRemove method to throw an error
      ShoppingListItem.findByIdAndRemove = jest.fn().mockRejectedValue({});

      const res = await request(app).delete(`/shoppingList/${id}`);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({});
      expect(ShoppingListItem.findByIdAndRemove).toHaveBeenCalledWith(id);
      expect(mongoose.connect).toHaveBeenCalled();
    });
  });
});
