# Kubernetes Learning Sample

This workspace contains two independent apps that are ready to run locally before you package them for Docker and Kubernetes.

- `web`: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- `api`: NestJS 11, TypeScript, TypeORM, MySQL

The sample domain is a small articles app with list, detail, create, update, and delete flows.

## Project Layout

```text
.
├── api   # NestJS REST API on http://localhost:3001/api
└── web   # Next.js app on http://localhost:3000
```

## Local Setup

Use Node.js `22.13.0` or newer.

Copy environment examples:

```bash
cp api/.env.example api/.env
cp web/.env.example web/.env.local
```

Start MySQL with Docker:

```bash
docker compose up -d mysql
docker compose ps
```

The compose file creates the database and user automatically:

```sql
CREATE DATABASE articles_db;
CREATE USER 'articles_user'@'%' IDENTIFIED BY 'articles_password';
GRANT ALL PRIVILEGES ON articles_db.* TO 'articles_user'@'%';
FLUSH PRIVILEGES;
```

For local learning, `api/.env.example` sets `DB_SYNCHRONIZE=true` so TypeORM creates the `articles` table automatically. For production-style deployments, set it to `false` and use migrations.

## Run The API

```bash
cd api
npm install
npm run start:dev
```

Useful endpoints:

- `GET http://localhost:3001/api/health`
- `GET http://localhost:3001/api/articles`
- `POST http://localhost:3001/api/articles`
- `GET/PATCH/DELETE http://localhost:3001/api/articles/:id`

## Postman

Import these two files into Postman:

- `postman/k8s-sample.postman_collection.json`
- `postman/k8s-sample.postman_environment.json`

Select the `K8s Sample Local` environment, start the API, then run the collection from top to bottom. The create request stores `articleId` for the detail, update, and delete requests.

## Run The Web App

```bash
cd web
npm install
npm run dev
```

Open `http://localhost:3000`.

## Run Everything With Docker Compose

Build and start the full stack:

```bash
docker compose up --build
```

Run it in the background:

```bash
docker compose up --build -d
docker compose ps
```

Open the web app at `http://localhost:3000`. The API is available at `http://localhost:3001/api`.

Stop the stack:

```bash
docker compose down
```

Stop the stack and delete the MySQL volume:

```bash
docker compose down -v
```

## Quality Checks

```bash
cd api
npm run lint
npm test
npm run build

cd ../web
npm run lint
npm run build
```

## Next Kubernetes Step

The app already has pieces that map cleanly to Kubernetes concepts:

- API health endpoint for readiness/liveness probes
- Environment-based configuration for ConfigMaps and Secrets
- Separate frontend, backend, and database boundaries
- MySQL dependency ready to become a StatefulSet or managed database
