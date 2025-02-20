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

## Installing Dependencies

Run one of the following commands to install the project dependencies:

```bash
npm install
# OR
yarn install
# OR
pnpm install
```

## Running in Development Mode

Run one of the following commands to build the project:

```bash
npm run dev
# OR
yarn dev
# OR
pnpm dev
```

## Running Tests

Navigate to the `backend` directory within the project. 

```bash
cd ..
cd frontend/
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
