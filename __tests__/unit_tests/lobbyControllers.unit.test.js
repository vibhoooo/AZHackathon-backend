const request = require('supertest');
const express = require('express');
const lobbyControllers = require('../../controllers/lobbyControllers');
const Lobby = require('../../models/lobbyModels');
const NodeCache = require('node-cache');
const cache = new NodeCache();
const { getIo } = require('../../utils/socket');
jest.mock('../../models/lobbyModels');
jest.mock('../../utils/socket');
const app = express();
app.use(express.json());
app.use((req, res, next) => {
	req.cache = cache;
	next();
});
const io = {
	to: jest.fn().mockReturnThis(),
	emit: jest.fn()
};
getIo.mockReturnValue(io);
app.post('/lobbies/createLobby', lobbyControllers.createLobby);
app.post('/lobbies/requestJoinLobby', lobbyControllers.requestJoinLobby);
app.post('/lobbies/addParticipant', lobbyControllers.addParticipant);
app.get('/lobbies/listLobby', lobbyControllers.listLobby);
describe('Lobby Controllers', () => {
	afterEach(() => {
		jest.clearAllMocks();
		cache.flushAll();
	});
	describe('Create Lobby', () => {
		afterEach(() => {
			jest.clearAllMocks();
			cache.flushAll();
		});
		it('should return 201 and create a new lobby', async () => {
			Lobby.create.mockResolvedValue({
				lid: '1',
				lname: 'Test Lobby',
				lowneremail: 'owner@test.com',
				lparticipants: ['owner@test.com']
			});
			const res = await request(app)
				.post('/lobbies/createLobby')
				.send({
					lid: '1',
					lname: 'Test Lobby',
					lowneremail: 'owner@test.com'
				});
			expect(res.statusCode).toEqual(201);
		});
		it('should return 400 if required fields are missing', async () => {
			const res = await request(app)
				.post('/lobbies/createLobby')
				.send({
					lid: '1'
				});
			expect(res.statusCode).toEqual(400);
		});
		it('should return 400 if lobby already exists', async () => {
			Lobby.findOne.mockResolvedValue({ lid: '1' });
			const res = await request(app)
				.post('/lobbies/createLobby')
				.send({
					lid: '1',
					lname: 'Test Lobby',
					lowneremail: 'owner@test.com'
				});
			expect(res.statusCode).toEqual(400);
		});
	});
	describe('Request Join Lobby', () => {
		afterEach(() => {
			jest.clearAllMocks();
			cache.flushAll();
		});
		it('should return 200 and send join request', async () => {
			Lobby.findOne.mockResolvedValue({
				lid: '1',
				lname: 'Test Lobby',
				lowneremail: 'owner@test.com',
				lstatus: 'waiting'
			});
			const res = await request(app)
				.post('/lobbies/requestJoinLobby')
				.send({
					lid: '1',
					participant: 'participant@test.com'
				});
			expect(res.statusCode).toEqual(200);
			expect(io.to).toHaveBeenCalledWith('owner@test.com');
			expect(io.emit).toHaveBeenCalledWith('joinRequest', { lobbyId: '1', participant: 'participant@test.com' });
		});
		it('should return 404 if lobby is not found', async () => {
			Lobby.findOne.mockResolvedValue(null);
			const res = await request(app)
				.post('/lobbies/requestJoinLobby')
				.send({
					lid: '1',
					participant: 'participant@test.com'
				});
			expect(res.statusCode).toEqual(404);
		});
		it('should return 403 if lobby is busy', async () => {
			Lobby.findOne.mockResolvedValue({
				lid: '1',
				lname: 'Test Lobby',
				lowneremail: 'owner@test.com',
				lstatus: 'busy'
			});
			const res = await request(app)
				.post('/lobbies/requestJoinLobby')
				.send({
					lid: '1',
					participant: 'participant@test.com'
				});
			expect(res.statusCode).toEqual(403);
		});
	});
	describe('Add Participant', () => {
		afterEach(() => {
			jest.clearAllMocks();
			cache.flushAll();
		});
		it('should return 200 and add participant to lobby', async () => {
			Lobby.findOne.mockResolvedValue({
				lid: '1',
				lname: 'Test Lobby',
				lowneremail: 'owner@test.com',
				lstatus: 'waiting',
				lparticipants: ['owner@test.com'],
				save: jest.fn().mockResolvedValue({
					lid: '1',
					lname: 'Test Lobby',
					lowneremail: 'owner@test.com',
					lstatus: 'active',
					lparticipants: ['owner@test.com', 'participant@test.com']
				})
			});
			const res = await request(app)
				.post('/lobbies/addParticipant')
				.send({
					lid: '1',
					participant: 'participant@test.com',
					accept: true
				});
			expect(res.statusCode).toEqual(200);
			expect(io.to).toHaveBeenCalledWith('participant@test.com');
			expect(io.emit).toHaveBeenCalledWith('joinRoom', { lobbyRoom: 'lobby-1' });
			expect(io.emit).toHaveBeenCalledWith('joinResponse', { lobbyId: '1', accepted: true });
		});
		it('should return 400 if required fields are missing', async () => {
			const res = await request(app)
				.post('/lobbies/addParticipant')
				.send({
					lid: '1'
				});
			expect(res.statusCode).toEqual(400);
		});
		it('should return 404 if lobby is not found', async () => {
			Lobby.findOne.mockResolvedValue(null);
			const res = await request(app)
				.post('/lobbies/addParticipant')
				.send({
					lid: '1',
					participant: 'participant@test.com',
					accept: true
				});
			expect(res.statusCode).toEqual(404);
		});
		it('should return 400 if lobby is busy', async () => {
			Lobby.findOne.mockResolvedValue({
				lid: '1',
				lname: 'Test Lobby',
				lowneremail: 'owner@test.com',
				lstatus: 'busy'
			});
			const res = await request(app)
				.post('/lobbies/addParticipant')
				.send({
					lid: '1',
					participant: 'participant@test.com',
					accept: true
				});
			expect(res.statusCode).toEqual(400);
			expect(res.body.message).toBe('Lobby is busy, join request declined');
		});
		it('should return 200 and decline join request', async () => {
			Lobby.findOne.mockResolvedValue({
				lid: '1',
				lname: 'Test Lobby',
				lowneremail: 'owner@test.com',
				lstatus: 'waiting',
				lparticipants: ['owner@test.com']
			});
			const res = await request(app)
				.post('/lobbies/addParticipant')
				.send({
					lid: '1',
					participant: 'participant@test.com',
					accept: false
				});
			expect(res.statusCode).toEqual(200);
			expect(io.to).toHaveBeenCalledWith('participant@test.com');
			expect(io.emit).toHaveBeenCalledWith('joinResponse', { lobbyId: '1', accepted: false });
		});
	});
	describe('List Lobby', () => {
		it('should return 200 and list all lobbies', async () => {
			Lobby.find.mockResolvedValue([{
				lid: '1',
				lname: 'Test Lobby',
				lowneremail: 'owner@test.com'
			}]);
			const res = await request(app)
				.get('/lobbies/listLobby');
			expect(res.statusCode).toEqual(200);
		});
	});
});
