# Xeno CRM & Campaign Management App

## Overview
A simplified Customer Relationship Management (CRM) system built as part of the Xeno SDE Internship assignment. This web application allows users to ingest customer and order data, create audience segments, and manage marketing campaigns.

## Features
- Customer and Order Data Ingestion
- Audience Segmentation with Complex Filtering
- Campaign Management
- Google Authentication
- Message Delivery Tracking
- Asynchronous Message Queue for Campaign Message Processing

## Tech Stack
- **Frontend**: React Typescript
- **Backend**: Node.js
- **Database**: MySQL
- **Authentication**: Google OAuth

## API Endpoints
### Customer Data Ingestion
This API allows you to manage customer data with the following endpoints:
- **GET** `/api/customers`: Retrieve a list of all customers.
  ![image](https://github.com/user-attachments/assets/a4095d3e-519a-4512-be9d-df129ad6645f)
- **POST** `/api/customers`: Create a new customer.
  ![image](https://github.com/user-attachments/assets/2d97e076-3816-4f35-bd44-48dd3c0343e9)
- **PUT** `/api/customers/:id`: Update an existing customer.
- **DELETE** `/api/customers/:id`: Delete a customer.

## Campaign Message Queue
The system uses an in-memory message queue to handle campaign message sending efficiently. Messages are queued and processed asynchronously, ensuring that the campaign execution does not block API responses. This enhances scalability and reliability.
### How it Works
- When a campaign is initiated, messages are added to an in-memory queue.
- The queue processes messages one by one, simulating message delivery.
- Campaign stats are updated dynamically based on successful and failed messages.
- Once all messages are processed, the campaign is marked as completed.

## Setup and Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run the front-end: `npm run dev`
4. Run the server: `npm run server`

## Authentication
- Google OAuth used for secure access
- Requires Google Developer Console configuration

## Deployment
[Link](https://xenominicrm.netlify.app)

## Author
- [@kamil26300](https://github.com/kamil26300)
- [@Rishavzone10](https://github.com/Rishavzone10)

## Acknowledgements
Project created for Xeno SDE Internship Assignment - November 2024
