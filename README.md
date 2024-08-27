# Scalable Containerized Deployment Pipeline

## Overview
This project is a scalable and automated containerized deployment pipeline built using AWS cloud services. It allows for the dynamic spinning up of containers for each build process, uploads the output to Amazon S3, and serves the content using a reverse proxy. The system is designed for efficient resource utilization, seamless deployment, and robust performance monitoring.

## Table of Contents
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup](#setup)
- [Usage](#usage)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)

## Architecture
![Architecture Diagram](path/to/architecture-diagram.png)

The architecture includes the following components:
1. **API Server**: Handles incoming API requests and triggers the container creation process.
2. **Docker Containers**: Each build process runs inside an isolated Docker container.
3. **AWS ECS**: Manages the orchestration of Docker containers.
4. **Amazon S3**: Stores the output of each build process.
5. **Reverse Proxy**: Streams content directly from S3 to the user.
6. **PostgreSQL**: Stores user and project details, as well as logs.
7. **Redis Server**: Central server for logging, enabling efficient log management.
8. **Socket Server**: Subscribes to logs and streams them in real-time.

## Features
- **Dynamic Container Deployment**: Containers are spun up dynamically for each build process.
- **Centralized Storage**: Build outputs are stored in Amazon S3 for easy access and retrieval.
- **Reverse Proxy**: Serves content directly from S3 to the user.
- **Centralized Logging**: Logs are collected and managed using Redis.
- **Scalability**: The architecture is designed to scale efficiently with increasing load.

## Tech Stack
- **Programming Language**: Node.js
- **Containerization**: Docker
- **Orchestration**: AWS ECS
- **Storage**: Amazon S3
- **Database**: PostgreSQL
- **Logging**: Redis
- **Reverse Proxy**: Node.js and HTTP-Proxy
- **Other Tools**: AWS SDK, Socket.io, Nginx


## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.


This is a scalable and automated containerized Deployment Pipleline, leveraging some AWS services...

STEP 1: On the UI, Users will get a Input field wherein they can paste the link for the project's source code they need to deploy and press the deploy button.
![image](https://github.com/user-attachments/assets/1b405dba-c53b-4713-a407-1477bbb3312c)


STEP 2: Now a new task will automatically start running on AWS ECS, which will generate build folder and upload files to AWS S3.
ECS TASK:
![image](https://github.com/user-attachments/assets/a7aef971-ac1f-4a50-8c22-921836ca855c)

Generated Logs :
![image](https://github.com/user-attachments/assets/41b8c797-788c-4c3a-866c-4fbf10adde6c)

Files uploaded to S3:
![image](https://github.com/user-attachments/assets/1d0f48fb-3b76-4197-a166-2b3b05e8e42a)


Step 3: Push the generated logs to Redis Server and using socketIO subscribe to the logs.
![image](https://github.com/user-attachments/assets/2d4cf475-fb60-4b97-ad45-26a79cd78977)


Step 4: Live Deployment
Preview URL for the deployed site :
![image](https://github.com/user-attachments/assets/5a21ce98-aa67-4d87-800f-885fdb211963)

![image](https://github.com/user-attachments/assets/e21605da-bf37-4847-8462-cea7ae5e5362)
