# NNA

> This is a rework of <https://github.com/HugoMendes98/Nx-NestJS-Angular>.
>
> This is still in progress.

| Code               | Code coverage                                                               | Comment coverage                                                               |
|--------------------|-----------------------------------------------------------------------------|--------------------------------------------------------------------------------|
| `apps/backend`     | ![./.badges/apps/backend](./.badges/apps/backend/code/coverage.svg)         | ![./.badges/apps/backend](./.badges/apps/backend/comment/coverage.svg)         |
| `apps/frontend`    | ![./.badges/apps/frontend](./.badges/apps/frontend/code/coverage.svg)       | ![./.badges/apps/frontend](./.badges/apps/frontend/comment/coverage.svg)       |
| `apps/office`      | ![./.badges/apps/office](./.badges/apps/office/code/coverage.svg)           | ![./.badges/apps/office](./.badges/apps/office/comment/coverage.svg)           |
| `libs/common`      | ![./.badges/libs/common](./.badges/libs/common/code/coverage.svg)           | ![./.badges/libs/common](./.badges/libs/common/comment/coverage.svg)           |
| `libs/front`       | ![./.badges/libs/front](./.badges/libs/front/code/coverage.svg)             | ![./.badges/libs/front](./.badges/libs/front/comment/coverage.svg)             |
| `packages/angular` | ![./.badges/packages/angular](./.badges/packages/angular/code/coverage.svg) | ![./.badges/packages/angular](./.badges/packages/angular/comment/coverage.svg) |
| `packages/core`    | ![./.badges/packages/core](./.badges/packages/core/code/coverage.svg)       | ![./.badges/packages/core](./.badges/packages/core/comment/coverage.svg)       |
| `packages/nest`    | ![./.badges/packages/nest](./.badges/packages/nest/code/coverage.svg)       | ![./.badges/packages/nest](./.badges/packages/nest/comment/coverage.svg)       |

## Table of contents

<!-- toc -->

- [Description](#description)
- [Requirements](#requirements)
  - [DevContainer](#devcontainer)
- [Quick Start-up](#quick-start-up)
  - [Install](#install)
  - [Run the `backend`](#run-the-backend)
  - [Run the `frontend`](#run-the-frontend)
  - [Run the `office`](#run-the-office)

<!-- tocstop -->

## Description

!! Description of your project !!

## Requirements

> If you use (or want to use/try) `DevContainer`, you can directly go [here](#devcontainer).

To develop this project, the following conditions are expected:

- [NodeJS](https://nodejs.org/en) (>= 20) - Build/run applications
  - The "real" version for the applications is in the [nvmrc file](./.nvmrc), so [nvm](https://github.com/nvm-sh/nvm) can be used:  
  `nvm use`
- [npm](https://www.npmjs.com/) - Install dependencies and main executor for the "officials" commands of the project.
- [docker](https://www.docker.com/) - To build docker images and for _development-server_ dependencies.

---

_Development-server_ dependencies (database, mail server, ...) can be served with:

```bash
docker compose up 
```

### DevContainer

TODO

## Quick Start-up

Some commands to quickly run the applications:

> Go [here](./docs/commands.md) for more commands and related information.

### Install

Install the node packages:

```bash
npm install
```

### Run the `backend`

```bash
npx mikro-orm migration:fresh --seed SimpleSeeder
```

```bash
npm run backend:start
```

### Run the `frontend`

```bash
npm run frontend:start
```

### Run the `office`

```bash
npm run office:start
```
