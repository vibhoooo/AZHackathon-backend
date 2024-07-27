## Introduction
Socket.IO-based lobby system for a real-time multiplayer MCQ battle engine for AlgoZenith Quarterly Hackathon.

## Tech Stack
• NodeJS <br />
• ExpressJS  <br />
• Socket.IO  <br />
• MomentJS <br />
• Morgan <br />
• Jest <br />
• Supertest <br />
• Mongoose  <br />
• MongoDB  <br />
• Redis

## IDE 
• VSCode

## API Testing 
• Postman <br />
• Thunder Client

## Database Testing
• MongoDB Compass

## Salient Features
• Implemented clustering with round-robin server allocation to achieve 12.5% reduction in server load. <br />
• Implemented in-memory caching, leading to 98.25% reduction in average response time. <br />
• Implemented IP rate limiting using fixed window algorithm with Redis, restricting users to 10 requests per minute. <br />
• Wrote unit tests using Jest and Supertest for backend endpoints, achieving test coverage of 93.4%. <br />
• Implemented Open API/Swagger specs for backend APIs, achieving comprehensive API documentation with 100% endpoint coverage and precise parameter definitions at 95% accuracy.

## Some Results 
Clustering <br />
<img width="751" alt="image" src="https://github.com/vibhoooo/AZHackathon-backend/assets/96656912/375e47e8-ae87-4429-b42a-cc93131395b5"> <br />

Caching <br />
![WhatsApp Image 2024-07-06 at 3 34 14 PM](https://github.com/vibhoooo/AZHackathon-backend/assets/96656912/2753e3d6-5dc5-46db-b43c-6eb1dc8c0554) <br />

Testing <br />
<img width="604" alt="image" src="https://github.com/vibhoooo/AZHackathon-backend/assets/96656912/b2ae0dca-feae-4d87-bd54-e5ce00def7ff"> <br />

OpenAPI/Swagger specs <br />
<img width="1438" alt="image" src="https://github.com/vibhoooo/AZHackathon-backend/assets/96656912/f5759e6b-a9ff-46ab-be95-0b7931e092c6">

## Setup
    Fork
  
    Clone
    git clone https://github.com/<username>/AZHackathon-backend.git

    Navigate
    cd AZHackathon-backend
    
    Install dependencies
    npm install

    Individual installation
    npm i <dependency>
    
    Running the server
    npm run dev

    Running Redis server
    brew services start redis

    Stopping Redis server
    brew services stop redis

    Restarting Redis server
    brew services restart redis
    
    Running unit tests
    npm run test:unit
    
    Generating OpenAPI/Swagger specs
    npm run swagger
    
### package.json
    {
      "name": "azhackathon",
      "version": "1.0.0",
      "description": "",
      "main": "server.js",
      "scripts": {
        "dev": "nodemon server.js",
        "test:unit": "jest __tests__/unit_tests",
        "test:integration": "jest __tests__/integration_tests",
        "swagger": "node swagger.js"
      },
      "keywords": [],
      "author": "",
      "license": "ISC",
      "dependencies": {
        "bcrypt": "^5.1.1",
        "cluster": "^0.7.7",
        "cors": "^2.8.5",
        "dotenv": "^16.4.5",
        "express": "^4.19.2",
        "express-async-handler": "^1.2.0",
        "express-rate-limit": "^7.3.1",
        "ioredis": "^5.4.1",
        "jsonwebtoken": "^9.0.2",
        "moment": "^2.30.1",
        "mongoose": "^8.4.3",
        "morgan": "^1.10.0",
        "node-cache": "^5.1.2",
        "nodemon": "^3.1.3",
        "socket.io": "^4.7.5",
        "swagger-ui-express": "^5.0.1"
      },
      "devDependencies": {
        "jest": "^29.7.0",
        "supertest": "^7.0.0",
        "swagger-autogen": "^2.23.7"
      },
      "jest": {
        "testEnvironment": "node",
        "testTimeout": 90000
      }
    }

### .env
    PORT = <port>
    CONNECTION_STRING = mongodb+srv://user:<password>@atlascluster.c8f3bao.mongodb.net/
    ACCESS_TOKEN_SECRET_USER = <secret>

## Future Add Ons
• Implementation of timer for each question. <br />
• Implementation of admin logic. <br />
• Implementation of leadeboard logic. <br />
• Writing integration tests for endpoints. <br />
• Scaling Websocket server. <br />
• Integration of GraphQL. <br />
• Sharding the database. <br />
• Partitioning the database. <br />
• Replicating the database.

## Links
[Frontend Repository](https://github.com/vibhoooo/AZHackathon-frontend)
