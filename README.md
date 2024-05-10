
<div align="center">

  <h1>Perishable_Inventory_Server</h1>
  
  <p>
    A simple Nodejs Server for managing perishable inventory
  </p>
  
</div>

<br />

<!-- Table of Contents -->
# Table of Contents

- [About the Project](#about-the-project)
  * [Tech Stack](#tech-stack)
  * [Features](#features)
  * [API Documentation](#api-documentation)
  * [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
  * [DB Setup](#db-setup)
  * [Linting](#linting)
  * [Running Tests](#running-tests)
  * [Run Locally](#run-locally)
- [Contact](#contact)
  

<!-- About the Project -->
## About the Project
A simple Nodejs Server for managing perishable inventory

<!-- TechStack -->
### Tech Stack

- ***Express.js***
- ***Typescript***
- ***npm***


<!-- Features -->
### Features

- ***Package managament*** with npm
- ***ORM*** `Prisma`
- ***Cron Job*** with `node-cron`
- ***Validation*** with `joi`
- ***API Documentation*** with `Swagger`
- ***Testing*** with `Jest` and `Supertest`
- ***Cross-Origin Resource-Sharing*** enabled using `cors`
- ***Rate Limit*** enabled using `express-rate-limit`
- ***Secured HTTP Headers*** using `helmet`
- ***Logging*** with `winston`
- ***Environment variables*** using `dotenv`
- ***Compression*** with gzip
- ***Linting*** using Eslint

<!-- API Documentation -->
### API Documentation

```bash
  http://localhost:4040/docs
```

| Method | Endpoint          | Description                        |
|--------|-------------------|------------------------------------|
| GET    | /:item/quantity   | get non-expired quantity of the item from the system            |
| POST   | /:item/add        | Add a lot of :item to the system   |
| POST   | /:item/sell       | sell a quantity of an item and reduce its inventory from the database.  |


<!-- Env Variables -->
### Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE`

`PAPERTRAIL_HOST=***.papertrailapp.com`
`PAPERTRAIL_PORT=****`

`NODE_ENV=development|production`

See .env.example

<!-- Getting Started -->
## Getting Started

<!-- Prerequisites -->
### Prerequisites

This project uses `npm` as package manager

<!-- Installation -->
### Installation

```bash
  git clone https://...../perishable_inventory.git
```

Go to the project directory

```bash
  cd perishable_inventory
```

```bash
  npm install
```

<!-- DB setup -->
### Db Setup

```bash

  npm run postinstall

```

### Linting

```bash
  # run ESLint
  npm run lint
  
  # fix ESLint errors
  npm run lint:fix

```
   
<!-- Running Tests -->
### Running Tests

To run tests, run the following command

```bash
  npm run test
```

<!-- Run Locally -->
### Run Locally

Start the server in development mode

```bash
  npm run dev
```

Start the server in production mode

```bash
  npm start
```

<!-- Contact -->
## Contact

Assignment Version Number: BE-2023-08

Name: Eshemiedomi Samuel Oghenevwede

Email: vwedesamdev@gmail.com

