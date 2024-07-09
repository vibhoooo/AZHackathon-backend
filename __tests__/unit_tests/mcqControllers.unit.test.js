const request = require('supertest');
const express = require('express');
const mcqControllers = require('../../controllers/mcqControllers');
const MCQ = require('../../models/mcqModels');
const NodeCache = require('node-cache');
const cache = new NodeCache();
const { constants } = require('../../constants');
jest.mock('../../models/mcqModels');
const app = express();
app.use(express.json());
app.use((req, res, next) => {
	req.cache = cache;
	next();
});
app.post('/mcqs/createMcq', mcqControllers.createMcq);
app.post('/mcqs/readMcq', mcqControllers.readMcq);
app.patch('/mcqs/updateMcq', mcqControllers.updateMcq);
app.delete('/mcqs/deleteMcq', mcqControllers.deleteMcq);
describe('MCQ Controllers', () => {
	afterEach(() => {
		jest.clearAllMocks();
		cache.flushAll();
	});
	describe('Create MCQ', () => {
		afterEach(() => {
			jest.clearAllMocks();
			cache.flushAll();
		});
		it('should return 201 and create a new MCQ', async () => {
			MCQ.create.mockResolvedValue({
				qid: '1',
				qname: 'Sample Question',
				qdiff: 'easy',
				qtopic: 'sample topic',
				qans: 'answer',
				qscore: 10,
				lid: '1',
				qoptions: ['opt1', 'opt2', 'opt3', 'opt4']
			});
			const res = await request(app)
				.post('/mcqs/createMcq')
				.send({
					qid: '1',
					qname: 'Sample Question',
					qdiff: 'easy',
					qtopic: 'sample topic',
					qans: 'answer',
					qscore: 10,
					lid: '1',
					qoptions: ['opt1', 'opt2', 'opt3', 'opt4']
				});
			expect(res.statusCode).toEqual(201);
		});
		it('should return 400 if required fields are missing', async () => {
			const res = await request(app)
				.post('/mcqs/createMcq')
				.send({
					qid: '1',
					qname: 'Sample Question'
				});
			expect(res.statusCode).toEqual(constants.VALIDATION_ERROR);
		});
		it('should return 400 if MCQ already exists', async () => {
			MCQ.findOne.mockResolvedValue({ qid: '1', lid: '1' });
			const res = await request(app)
				.post('/mcqs/createMcq')
				.send({
					qid: '1',
					qname: 'Sample Question',
					qdiff: 'easy',
					qtopic: 'sample topic',
					qans: 'answer',
					qscore: 10,
					lid: '1',
					qoptions: ['opt1', 'opt2', 'opt3', 'opt4']
				});
			expect(res.statusCode).toEqual(constants.VALIDATION_ERROR);
		});
	});
	describe('Read MCQ', () => {
		afterEach(() => {
			jest.clearAllMocks();
			cache.flushAll();
		});
		it('should return 200 and the MCQ from the database', async () => {
			MCQ.findOne.mockResolvedValue({
				qid: '1',
				lid: '1'
			});
			const res = await request(app)
				.post('/mcqs/readMcq')
				.send({ qid: '1', lid: '1' });
			expect(res.statusCode).toEqual(200);
		});
		it('should return 200 and the MCQ from the cache', async () => {
			const mcqData = {
				qid: '1',
				qname: 'Sample Question',
				qdiff: 'easy',
				qtopic: 'sample topic',
				qans: 'answer',
				qscore: 10,
				lid: '1',
				qoptions: ['opt1', 'opt2', 'opt3', 'opt4']
			};
			cache.set('mcq_1_1', mcqData);
			const res = await request(app)
				.post('/mcqs/readMcq')
				.send({ qid: '1', lid: '1' });
			expect(res.statusCode).toEqual(200);
		});
		it('should return 404 if MCQ is not found', async () => {
			MCQ.findOne.mockResolvedValue(null);
			const res = await request(app)
				.post('/mcqs/readMcq')
				.send({ qid: '1', lid: '1' });
			expect(res.statusCode).toEqual(404);
		});
	});
	describe('Update MCQ', () => {
		afterEach(() => {
			jest.clearAllMocks();
			cache.flushAll();
		});
		it('should return 200 and update the MCQ', async () => {
			MCQ.findOne.mockResolvedValue({
				qid: '1',
				qname: 'Sample Question',
				qdiff: 'easy',
				qtopic: 'sample topic',
				qans: 'answer',
				qscore: 10,
				lid: '1',
				qoptions: ['opt1', 'opt2', 'opt3', 'opt4'],
				save: jest.fn().mockResolvedValue({
					qid: '1',
					qname: 'Updated Question',
					qdiff: 'medium',
					qtopic: 'updated topic',
					qans: 'new answer',
					qscore: 20,
					lid: '1',
					qoptions: ['new opt1', 'new opt2', 'new opt3', 'new opt4']
				})
			});
			const res = await request(app)
				.patch('/mcqs/updateMcq')
				.send({
					qid: '1',
					qname: 'Updated Question',
					qdiff: 'medium',
					qtopic: 'updated topic',
					qans: 'new answer',
					qscore: 20,
					lid: '1',
					qoptions: ['new opt1', 'new opt2', 'new opt3', 'new opt4']
				});
			expect(res.statusCode).toEqual(200);
		});
		it('should return 400 if required fields are missing', async () => {
			const res = await request(app)
				.patch('/mcqs/updateMcq')
				.send({
					qid: '1',
					qname: 'Updated Question'
				});
			expect(res.statusCode).toEqual(constants.VALIDATION_ERROR);
		});
		it('should return 404 if MCQ is not found', async () => {
			MCQ.findOne.mockResolvedValue(null);
			const res = await request(app)
				.patch('/mcqs/updateMcq')
				.send({
					qid: '1',
					qname: 'Updated Question',
					qdiff: 'medium',
					qtopic: 'updated topic',
					qans: 'new answer',
					qscore: 20,
					lid: '1',
					qoptions: ['new opt1', 'new opt2', 'new opt3', 'new opt4']
				});
			expect(res.statusCode).toEqual(404);
		});
	});
	describe('Delete MCQ', () => {
		afterEach(() => {
			jest.clearAllMocks();
			cache.flushAll();
		});
		it('should return 200 and delete the MCQ', async () => {
			MCQ.findOne.mockResolvedValue({
				qid: '1',
				qname: 'Sample Question',
				qdiff: 'easy',
				qtopic: 'sample topic',
				qans: 'answer',
				qscore: 10,
				lid: '1',
				qoptions: ['opt1', 'opt2', 'opt3', 'opt4'],
				deleteOne: jest.fn().mockResolvedValue({})
			});
			const res = await request(app)
				.delete('/mcqs/deleteMcq')
				.send({ qid: '1', lid: '1' });
			expect(res.statusCode).toEqual(200);
		});
		it('should return 400 if required fields are missing', async () => {
			const res = await request(app)
				.delete('/mcqs/deleteMcq')
				.send({ qid: '1' });
			expect(res.statusCode).toEqual(constants.VALIDATION_ERROR);
		});
		it('should return 404 if MCQ is not found', async () => {
			MCQ.findOne.mockResolvedValue(null);
			const res = await request(app)
				.delete('/mcqs/deleteMcq')
				.send({ qid: '1', lid: '1' });
			expect(res.statusCode).toEqual(404);
		});
	});
});
