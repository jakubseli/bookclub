# Bookclub

A university project: a REST API where users join book clubs and review the books they read together, with a React frontend.

## Requirements

- REST API using the correct HTTP methods (POST create, PUT update, DELETE delete)
- Relational database with at least 4 tables, including a many-to-many relationship
- JWT login for protected endpoints
- Correct HTTP status codes (200, 404, 405, 401/403) and validation of invalid input
- At least one endpoint with pagination
- Swagger UI documentation
- N-layer architecture following SOLID principles
- Optional: advanced filtering (`eq`, `ne`, `gt`, `ge`, `lt`, `le`, `in`, `ct`, `sw`, `cv` with `AND`/`OR` and parentheses)

## Running it

You need Java 21, Node.js 22 and Docker.

### 1. Database

Start MariaDB in Docker. The app creates the `bookclub` database and its tables on first run.

```bash
docker run --name bookclub-db -e MARIADB_ROOT_PASSWORD=password -p 3306:3306 -d mariadb:latest
```

### 2. Backend

The backend reads two environment variables:

| Variable | What it is |
|---|---|
| `DB_PASSWORD` | The MariaDB root password (`password` with the command above) |
| `JWT_SECRET` | Any random text of at least 32 characters, used to sign login tokens |

Generate a secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

Set both variables in your IDE's run configuration, or in the terminal, then start the app:

```bash
./mvnw spring-boot:run
```

On Windows use `mvnw.cmd spring-boot:run`. The API runs on http://localhost:8080 and the Swagger UI on http://localhost:8080/swagger-ui.html.

### 3. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 and create an account.

### Tests

```bash
./mvnw test
```

`BookclubApplicationTests` starts the whole app, so it needs the database running and both variables set.
