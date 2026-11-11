# Student Management

A simple application to manage students, courses, and course enrollments.

## Technology

- Java 17 and Spring Boot 3.3
- Spring MVC, Spring Data JPA, and Hibernate
- Angular 22, RxJS, reactive forms, and Bootstrap 5
- H2 file database
- JUnit 5, Mockito, and MockMvc

## Features

- Create, view, update, and delete students
- Create, view, update, and delete courses
- Assign courses to a student
- Form validation and API error handling
- Confirmation before deleting a record
- Backend unit and integration tests

## Run the application

### Prerequisites

- JDK 17 or later
- Node.js 22.22.3 or later
- npm 10 or later

The Maven Wrapper is included, so Maven does not need to be installed separately. Make sure `java -version` and `npm -version` work before continuing.

Start the backend from the project root.

macOS or Linux:

```bash
./mvnw -pl backend spring-boot:run
```

Windows PowerShell or Command Prompt:

```powershell
.\mvnw.cmd -pl backend spring-boot:run
```

The backend runs at `http://localhost:8081`.

Start the frontend in another terminal:

```bash
cd frontend
npm install
npm start
```

Open `http://localhost:4200`.

### Frontend and backend connection

Angular runs on port `4200` and forwards `/api` requests to the Spring Boot backend on port `8081` using `frontend/proxy.conf.json`. Spring Boot uses `8081` by default and can be overridden with the `SERVER_PORT` environment variable. If the backend port changes, update the proxy target to use the same port.

### Generated local files

The repository does not include generated files or downloaded dependencies:

- `frontend/node_modules` is created by `npm install`.
- `frontend/dist` is created by `npm run build`.
- `frontend/.angular` is created by the Angular CLI.
- `backend/target` is created by Maven.
- `backend/data` contains the local H2 database and is created when the backend starts.

These directories are excluded from Git and should not be committed.

## Database

The application uses a file-based H2 database, so no separate database installation is needed. Hibernate creates the tables when the backend starts. Existing data is retained between restarts.

The database file is created here:

```text
backend/data/student-management.mv.db
```

### H2 console

Keep the backend running and open `http://localhost:8081/h2-console`.

| Field | Value |
| --- | --- |
| Driver Class | `org.h2.Driver` |
| JDBC URL | `jdbc:h2:file:./data/student-management` |
| User Name | `sa` |
| Password | Leave blank |

The main tables are:

| Table | Description |
| --- | --- |
| `STUDENTS` | Student details |
| `COURSES` | Course details |
| `STUDENT_COURSES` | Student and course relationship |

### Sample data

Sample data is not inserted automatically. To add it:

1. Start the backend.
2. Connect to the H2 console.
3. Open `backend/src/main/resources/db/sample-data.sql`.
4. Copy the SQL into the console and run it.

The script can be run more than once without creating duplicate records.

### Reset the database

1. Stop the backend.
2. Delete `backend/data/student-management.mv.db` if the existing data is not needed.
3. Start the backend again to create an empty database.

Do not delete the database file while the backend is running.

## API endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/students` | Get all students |
| GET | `/api/students/{id}` | Get a student |
| POST | `/api/students` | Create a student |
| PUT | `/api/students/{id}` | Update a student |
| DELETE | `/api/students/{id}` | Delete a student |
| GET | `/api/courses` | Get all courses |
| GET | `/api/courses/{id}` | Get a course |
| POST | `/api/courses` | Create a course |
| PUT | `/api/courses/{id}` | Update a course |
| DELETE | `/api/courses/{id}` | Delete a course |

Student email and course code must be unique. A course cannot be deleted while students are enrolled in it.

## Tests

Run the backend tests from the project root.

macOS or Linux:

```bash
./mvnw test
```

Windows PowerShell or Command Prompt:

```powershell
.\mvnw.cmd test
```

Build the frontend:

```bash
cd frontend
npm run build
```

## Project structure

```text
backend/src/main/java/com/studentmanagement
├── config
├── controller
├── domain
├── dto
├── exception
├── repository
└── service

frontend/src/app
├── core
├── courses
├── shared
└── students
```
