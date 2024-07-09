const request = require('supertest');
const express = require('express');
const userControllers = require('../../controllers/userControllers');
const User = require('../../models/userModels');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { constants } = require('../../constants');
const app = express();
app.use(express.json());
app.post('/users/signup', userControllers.signupUser);
app.post('/users/login', userControllers.loginUser);
app.post('/users/logout', userControllers.logoutUser);
jest.mock('../../models/userModels');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
describe('User Controllers', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});
	describe('Sign Up', () => {
		afterEach(() => {
			jest.clearAllMocks();
		});
		it('should return 201 and create a new user', async () => {
			User.create.mockResolvedValue({ id: '1', email: 'test@example.com' });
			bcrypt.hash.mockResolvedValue('hashedPassword');
			const res = await request(app)
				.post('/users/signup')
				.send({
					username: 'testuser',
					email: 'test@example.com',
					password: 'password123'
				});
			expect(res.statusCode).toEqual(201);
		});
		it('should return 400 if required fields are missing', async () => {
			const res = await request(app)
				.post('/users/signup')
				.send({
					username: 'testuser',
					email: 'test@example.com'
				});
			expect(res.statusCode).toEqual(constants.VALIDATION_ERROR);
		});
		it('should return 400 if user already exists', async () => {
			User.findOne.mockResolvedValue({ email: 'test@example.com' });
			const res = await request(app)
				.post('/users/signup')
				.send({
					username: 'testuser',
					email: 'test@example.com',
					password: 'password123'
				});
			expect(res.statusCode).toEqual(constants.VALIDATION_ERROR);
		});
	});
	describe('Login', () => {
		afterEach(() => {
			jest.clearAllMocks();
		});
		it('should return 200 and a token for valid credentials', async () => {
			User.findOne.mockResolvedValue({ id: '1', username: 'testuser', email: 'test@example.com', password: 'hashedPassword' });
			bcrypt.compare.mockResolvedValue(true);
			jwt.sign.mockReturnValue('mockToken');
			const res = await request(app)
				.post('/users/login')
				.send({
					email: 'test@example.com',
					password: 'password123'
				});
			expect(res.statusCode).toEqual(200);
		});
		it('should return 400 if required fields are missing', async () => {
			const res = await request(app)
				.post('/users/login')
				.send({
					email: 'test@example.com'
				});
			expect(res.statusCode).toEqual(constants.VALIDATION_ERROR);
		});
		it('should return 401 for invalid credentials', async () => {
			User.findOne.mockResolvedValue(null);
			const res = await request(app)
				.post('/users/login')
				.send({
					email: 'test@example.com',
					password: 'wrongpassword'
				});
			expect(res.statusCode).toEqual(constants.UNAUTHORIZED);
		});
	});
	describe('Logout', () => {
		afterEach(() => {
			jest.clearAllMocks();
		});
		it('should return 200 and a logout message', async () => {
			const res = await request(app).post('/users/logout');
			expect(res.statusCode).toEqual(200);
		});
	});
});
