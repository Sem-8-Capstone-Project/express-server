# Web API for IoT Management System

This repository contains the Web API component of our IoT management system, which is responsible for authentication, user queueing & management, routing, and interactions with both the database and the WoT (Web of Things) API. Additionally, this component facilitates communication with the front-end interface, providing a seamless experience for users to monitor and control IoT devices.

## Features

- **Authentication**: Secure user authentication and authorization.
- **User Queueing & Management**: Efficient management of user requests and interactions.
- **Routing**: Handles all incoming requests and routes them to the appropriate service or resource.
- **Database Interaction**: Interfaces with MongoDB for data persistence and Redis for caching to ensure high performance.
- **WoT API Interaction**: Communicates with the Web of Things API to manage IoT devices and sensors.
- **Front-End Integration**: Provides endpoints and services to support the user interface, enabling real-time data updates and control features.

## Architecture Overview

- **User Interface**: Accessible via any user device (smartphones, computers) through a web browser.
- **Raspberry Pi Backend**: The central hub that integrates all components, including Web API, WoT API, and Serial Interface for direct hardware communication.
- **Arduino Uno**: Manages temperature sensors, fans, light intensity sensors, LEDs, and OLED displays.
- **Camera**: Connected to the Raspberry Pi for real-time monitoring.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Redis
- **Front-End**: HTML, CSS, JavaScript
- **Hardware**: Raspberry Pi, Arduino Uno
- **Protocols**: HTTP, WebSockets for real-time communication

## Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB and Redis instances running

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/IoT-WebAPI.git
   cd IoT-WebAPI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file and configure the necessary environment variables (e.g., database connection strings, API keys).

4. Start the server:
   ```bash
   npm start
   ```

## Usage

- Access the API at `http://localhost:3000/api`
- Refer to the API documentation for available endpoints and their usage.
