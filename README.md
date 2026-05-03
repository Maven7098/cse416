# CSE 416 — District Ensembles

Interactive redistricting analysis tool for Georgia and Iowa, built with React + Vite (frontend) and Spring Boot + MongoDB (backend).

## Prerequisites

- **Java 17+**
- **Node.js 18+** and **npm**
- **MongoDB** running locally on port `27017`

## Backend (Spring Boot)

```bash
cd cse416_backend_java
./mvnw.cmd spring-boot:run        # Windows
# ./mvnw spring-boot:run          # Mac/Linux
```

The server starts on **http://localhost:8080**.

On first startup, `DataSeedService` automatically seeds all MongoDB collections (`box_data`, `compare_data`, `ensemble_data`, `home_geojson`, `state_info`, `precincts_gingles`, `polarization_data`) from the asset files in `src/main/resources/assets/`.

> If you change seeding logic or asset files, drop the affected collection(s) in MongoDB and restart the backend to re-seed.

## Frontend (React + Vite)

```bash
cd cse416_frontend
npm install
npm run dev
```

The app starts on **http://localhost:5173** (or the next available port).

## Running Both Together

Start MongoDB first, then the backend, then the frontend. The frontend proxies API calls to `http://localhost:8080`.

