# -job-search-web-application
Job search site web application like kariyer.net
General Overview
This project is a web application developed with a microservice architecture, offering job search and notification features. Users can search for job postings, set up alerts, and receive email notifications when new relevant jobs are posted. The project consists of both frontend (user interface) and backend (API and services) layers, and is containerized with Docker.
Main Systems and Technologies Used
1. Frontend (React)
React: A modern, component-based JavaScript library for building user interfaces.
Material-UI: For stylish and functional UI components.
Axios: HTTP client for making API requests.
react-router-dom: For page routing and SPA (Single Page Application) navigation.
2. API Gateway (Express)
Node.js + Express: The main server that receives all frontend API requests and routes them to the relevant microservices.
axios: Allows the API Gateway to make requests to other microservices.
CORS and body-parser: For secure and flexible API communication.
3. Microservices
Job Posting Service: A separate service for adding and managing job postings (e.g., port 4001).
Job Search Service: A separate service for searching and filtering job postings (e.g., port 4002).
Notification Service: Manages user alerts/notifications and email delivery (e.g., port 4003).
Express: API server.
Mongoose: Data modeling with MongoDB.
Redis: For queue systems and fast data access.
Nodemailer: For sending emails.
node-cron: For scheduled tasks (e.g., checking for new jobs every minute).
AI Agent Service: A service integrated with the OpenAI API to provide smart job recommendations to users (e.g., port 4004).
Uses Express and axios to communicate with the OpenAI API.
4. Databases
MongoDB: NoSQL database for storing users, job postings, alerts, and history.
Redis: For notification queues and fast temporary data operations.
5. Docker and Docker Compose
Docker: All services (frontend, backend, microservices, databases) run in separate containers.
docker-compose: Used to start and manage the entire system with a single command.
Workflow (Summary)
The user interacts with the React-based frontend to search for jobs or set up alerts.
The frontend sends requests to the API Gateway (Express).
The API Gateway routes the request to the relevant microservice:
Job posting/search requests go to the Job Posting/Search Service.
Alerts and notifications go to the Notification Service.
Smart recommendations go to the AI Agent Service.
The Notification Service works with MongoDB and Redis, sending emails to users when new jobs are posted.
All services and databases run in isolated, easily manageable containers via Docker.
Advantages
Microservice architecture: Each service can be developed and scaled independently.
Docker: Easy setup and deployment, isolated working environments.
Modern frontend: User-friendly and fast interface.
Real-time notifications: Scheduled and fast notifications with cron and Redis.
In Short
This project is a scalable and maintainable platform developed with modern web technologies and microservice architecture, automating job search and notification processes.
However, despite all my efforts, I encountered Docker-related host problems during the project. I was able to fix most of them, but some issues remain unresolved because my computer crashed multiple times and became extremely slow while coding. Additionally, when I requested information from the AI service, it took 4–5 minutes to receive responses, which made it even more difficult to troubleshoot. The coding part of the project is fully complete; only the host issue needs to be solved. But as mentioned, my computer is not working properly at the moment.
