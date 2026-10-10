# CampusRate

CampusRate is a REST API for browsing and rating places on a college campus. Students can consult study spaces, libraries, food services, and other campus locations, and leave reviews with a rating and a comment. Each place's average rating and review count are calculated automatically from its reviews.

This project was built as part of the 420-514 course (Collecte et interprétation de données) to design, implement, and document a complete HTTP contract following REST conventions, with strict validation, uniform error handling, and MongoDB persistence.

## Features

- Full CRUD for **places** (study spaces, libraries, food services, etc.)
- Publishing, listing, and managing **reviews** tied to a place
- Filtering places by category, combined with pagination
- Automatic recalculation of a place's average rating and review count whenever a review is created, updated, or deleted
- Conflict protection: a place cannot be deleted while it still has reviews
- Strict input validation with detailed, uniform error responses (RFC 7807 Problem Details)
- Fully documented OpenAPI/Swagger contract
- Persistent storage backed by MongoDB

## Architecture

![CampusRate Architecture](./docs/campusRateArchitecture.png)

The application follows a layered architecture: controllers handle HTTP routing and Swagger documentation, services contain business logic, and Mongoose models handle data operations interacting with MongoDB.

## Technologies

- [NestJS](https://nestjs.com/) — TypeScript-first Node.js framework
- [TypeScript](https://www.typescriptlang.org/)
- [class-validator](https://github.com/typestack/class-validator) / [class-transformer](https://github.com/typestack/class-transformer) — DTO validation and serialization
- [Joi](https://joi.dev/) — startup configuration validation
- [@nestjs/swagger](https://docs.nestjs.com/openapi/introduction) — OpenAPI documentation
- `MongoDB/Mongoose` — NoSQL database for daata persistence
- `express-rate-limit` - API rate limiting (H1)
- `selfsigned` - Local HTTPS/TLS configuration (T2/T3)

## Installation

```bash
git clone https://github.com/WilliamGirouard/CampusRate.git
cd campus-rate
npm ci
```

## Configuration

Copy the example environment file and adjust as needed:

```bash
cp .env.example .env
```

| Variable       | Required | Default                  | Description                            |
| -------------- | -------- | ------------------------ | -------------------------------------- |
| `PORT`         | No       | `3000`                   | Port the application listens on        |
| `MONGO_URI`    | **Yes**  | —                        | MongoDB connection string              |
| `CORS_ORIGINS` | No       | `https://localhost:3000` | Allowed origins for CORS configuration |

Configuration is validated at startup with a Joi schema. If `MONGO_URI` is missing or `PORT` is invalid, the application refuses to start and prints a clear error message.

## Running the Application

```bash
# Development (with hot reload)
npm run start:dev

# Production
npm run start
```

## Linting and Build

```bash
npm run lint
npm run build
```

Both must complete without errors before submission.

## API Documentation (Swagger)

Once the application is running, the interactive API documentation is available at:

```
https://localhost:3000/docs
```

The raw OpenAPI JSON document is available at:

```
https://localhost:3000/docs/openapi.json
```

A static copy of the generated OpenAPI specification is also included in this repository at [`docs/openapi.json`](./docs/openapi.json).

## Manual Testing

A Postman collection covering the required test scenarios (creation, consultation, modification, deletion, validation errors, not-found, conflict, filtering, pagination, and persistence across a restart) is available at [`postman/CampusRatePostman.json`](./postman/CampusRatePostman.json).

A second one is also available to test some optional functionnality that have been implemented at [`postman/CampusRatePostman2.json`](./postman/CampusRatePostman2.json).

## API Contract Overview

All routes are prefixed with `/api/v1`.

| Capability                      | Method   | URI                              | Success | Notes                                                     |
| ------------------------------- | -------- | -------------------------------- | ------- | --------------------------------------------------------- |
| Create a place                  | `POST`   | `/places`                        | `201`   | Returns `Location` header                                 |
| List places (filter + paginate) | `GET`    | `/places?category=&page=&limit=` | `200`   | Returns `{ data, pagination }`                            |
| Get a place                     | `GET`    | `/places/{id}`                   | `200`   |                                                           |
| Update a place                  | `PATCH`  | `/places/{id}`                   | `200`   | Partial update                                            |
| Delete a place                  | `DELETE` | `/places/{id}`                   | `204`   | `409` if the place has reviews                            |
| Create a review for a place     | `POST`   | `/places/{placeId}/reviews`      | `201`   | Returns `Location` header; recalculates the place's stats |
| List reviews for a place        | `GET`    | `/places/{placeId}/reviews`      | `200`   |                                                           |
| Get a review                    | `GET`    | `/reviews/{id}`                  | `200`   |                                                           |
| Update a review                 | `PATCH`  | `/reviews/{id}`                  | `200`   | Recalculates the place's stats                            |
| Delete a review                 | `DELETE` | `/reviews/{id}`                  | `204`   | Recalculates the place's stats                            |

### Design Decisions

| Decision        | Choice                                                                                | Justification                                                                                                                                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Resource naming | `places`, `reviews`                                                                   | English, plural, lowercase, no action verbs, per REST conventions                                                                                                                                                                          |
| Versioning      | URI-based (`/api/v1/...`)                                                             | Explicit and visible in every request; simplifies routing and cache behavior compared to header-based versioning                                                                                                                           |
| Nesting         | Mixed: nested for creation/listing, independent for single-resource operations        | `POST/GET /places/{placeId}/reviews` expresses the real ownership relationship (a review always belongs to a place); `GET/PATCH/DELETE /reviews/{id}` stays independent once the review's own id is known, keeping URIs shorter and stable |
| Path parameters | `id` for the current resource, `placeId` when referencing a place from a nested route | Avoids ambiguity between "this resource" and "the parent resource"                                                                                                                                                                         |
| Success codes   | `200` (read/update), `201` (create, with `Location`), `204` (delete, no body)         | Matches HTTP semantics exactly                                                                                                                                                                                                             |
| Error codes     | `400` invalid input, `404` missing resource, `409` conflict, `500` unexpected error   | One code per distinct failure category, as required                                                                                                                                                                                        |

## Business Rules

- A review always references an existing place; creating a review for a non-existent place returns `404`.
- `id`, `placeId`, timestamps, and calculated fields (`averageRating`, `reviewCount`) can never be set by the client — they are server-generated and rejected if present in a request body.
- A place with no reviews exposes `averageRating: null` and `reviewCount: 0`.
- Creating, updating, or deleting a review recalculates the related place's `averageRating` and `reviewCount`.
- Deleting a place that still has reviews is refused with `409 Conflict`.
- `category` and `status` are restricted to fixed, documented enum values.

## Filtering and Pagination

`GET /places` accepts:

| Parameter  | Type        | Default | Max  | Description        |
| ---------- | ----------- | ------- | ---- | ------------------ |
| `category` | enum string | —       | —    | Exact match filter |
| `page`     | integer     | `1`     | —    | Page requested     |
| `limit`    | integer     | `10`    | `25` | Items per page     |

Filtering and pagination can be combined. An empty result set returns `200` with `data: []`, never an error.

## Error Format

All errors follow [RFC 7807 Problem Details](https://datatracker.ietf.org/doc/html/rfc7807) and are returned with the `application/problem+json` content type:

```json
{
  "type": "https://campus-rate.example/problems/not-found",
  "title": "Not Found",
  "status": 404,
  "detail": "Couldn't find place with id 6ac9454abb6cc8366ddd350c",
  "instance": "/api/v1/places/6ac9454abb6cc8366ddd350c"
}
```

Validation errors additionally include an `errors` array listing every failed constraint. Unexpected internal errors always return a generic, safe message, no stack trace or raw internal details are ever exposed to the client.

## Persistence & Database Strategy

Data is stored in **MongoDB** using **Mongoose** schemas and models.

Key database features implemented:

- **Duplicate Handling**: Unique index violations (e.g., duplicate names) trigger a controlled MongoDB error (`11000`), caught and translated into a standard `409 Conflict` response (See `PlacesService`).

- **`PlaceRepository`** and **`ReviewRepository`** expose resource-specific operations (`findAll`, `findById`, `create`, `update`, `delete`) to their respective services.
- Services (`PlacesService`, `ReviewsService`) contain all business rules (validation of relationships, conflict checks, statistics recalculation)

## Security & Hardening

CampusRate implements the following security and transport optimizations:

- **Rate Limiting (H1 - 4 pts)**: Protection against abuse and Denial of Service using strict request rate limits.
- **Payload Size Limits (H2 - 2 pts)**: Enforced maximum body size limits (e.g., 5kb) to prevent payload-based attacks.
- **Method Restriction (H5 - 1 pt)**: Explicit allowance limited strictly to `GET`, `POST`, `PATCH`, and `DELETE`, returning `405 Method Not Allowed` for any unauthorized methods.
- **HTTPS & Self-Signed Certificate (T2 - 5 pts & T3 - 2 pts)**: Secure local transport enabled via dynamically generated self-signed certificates (`selfsigned`).
- **MongoDB Optimization & Indexes (M1 - 6 pts)**: Optimized indexes on frequently queried fields, unique constraint enforcement, and clean duplicate handling (translating MongoDB 11000 errors into standard `409 Conflict` responses).

## Known Limitations

- **No authentication or authorization**: all endpoints are publicly accessible. Access control was out of scope for this assignment.

## License

This project was built for academic purposes as part of the 420-514 course.
