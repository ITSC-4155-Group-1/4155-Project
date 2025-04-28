# Build Instructions

This document provides the necessary steps to build and run the project.

---

## Prerequisites / Required Software

- **Node.js** (>= 16.x)
- `npm (>= 7.x)` or `yarn (>= 2.x)` or `pnpm (>= 7.x)`

---

## Clone Repository
You may do this however you feel comfortable doing it
```bash
git clone <repository-url>
cd <project-folder>
```

## Project Directory

Ensure you are in the `frontend` directory within the project directory.  
Your directory path should look similar to: `<path_to_project>/frontend`

If you are not in the `frontend` directory, navigate there using:

```bash
cd frontend/
```

## Installing Front-end Dependencies

Run one of the following commands to install the front-end project dependencies:

```bash
npm install
# OR
yarn install
# OR
pnpm install
```

## Running the Front-end in Development Mode

Run one of the following commands to build the project:

```bash
npm run dev
# OR
yarn dev
# OR
pnpm dev
```

## Installing Back-end Dependencies

Run one of the following commands to install the back-end project dependencies:

```bash
npm install
# OR
yarn install
# OR
pnpm install
```

## Running the Back-end in Development Mode

Run this command:

```bash
nodemon app
```

**<ins>Make sure you are running the front-end and the back-end at the same time by opening two terminals</ins>**

## Running Tests

Navigate to the `backend` directory within the project if you're not already there. 

```bash
cd backend/
```

Your path will look like this `<path_to_project>/backend`. Install the dependencies here as well:

```bash
npm install
# OR
yarn install
# OR
pnpm install
```

Run one of the following commands to run the tests:

```bash
npm run test
# OR
yarn test
# OR
pnpm run test
```
---

The application is also running on an Amazon EC2 Instance. To access the application, use the following link:
http://ec2-3-144-96-188.us-east-2.compute.amazonaws.com:3000/
