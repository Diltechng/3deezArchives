# 3Deez Archives

A web application for storing, organizing, and viewing company event records and photos in one centralized platform.

## Prerequisites
- Node.js (v22 recommended)
- npm
- Git
- Docker & Docker Compose (For containerized local runs)

## Getting Started

1. Clone the repository

    ```bash
    git clone https://github.com/Diltechng/3deezArchives.git
    ```

2. Navigate to the project folder

    ```bash
    cd 3deezArchives
    ```

3. Run the application using docker (recommended)
    - Build and start a container

      ```bash
      docker compose up --build
      ```
    - See the [Docker compose file](compose.yaml) and the [Docker file](Dockerfile)
    - Run database migration:
      ```bash
      docker compose run app npm run db:migrate
      ```
    - Run database seed:
      ```bash
      docker compose run app npm run db:seed
      ```

4. Run services locally
    - Install dependencies
      ```bash
      npm install
      ```
    - Run the development server
      ```bash
      npm run dev
      ```

## Environment Variables

- Create a `.env` or `.env.local` file in the root directory
- Refer to the [.env.example](.env.example) for variables to fill in.

## Database
- This project uses PostgreSQL