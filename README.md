<h1 align="center">Reservation System — Frontend</h1>

<p align="center">
  The web frontend for a <b>hotel / property reservation &amp; management system</b> — bookings,
  operations, and reporting — built with React 19 and Vite.
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-19-20232A?style=flat&logo=react&logoColor=61DAFB" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-7-646CFF?style=flat&logo=vite&logoColor=white" />
  <img alt="Ant Design" src="https://img.shields.io/badge/Ant_Design-6-0170FE?style=flat&logo=antdesign&logoColor=white" />
  <img alt="React Query" src="https://img.shields.io/badge/TanStack_Query-5-FF4154?style=flat&logo=reactquery&logoColor=white" />
  <img alt="Zustand" src="https://img.shields.io/badge/Zustand-5-2D3748?style=flat" />
  <img alt="License" src="https://img.shields.io/badge/license-Proprietary-red?style=flat" />
</p>

---

> ⚠️ **Proprietary software.** This repository is **not** open source and is **not** licensed under MIT
> or any other open-source license. See [License](#license) below.

## Overview

A single-page application for managing reservations and day-to-day operations — bookings, guests,
housekeeping, and reporting. Server state is handled with TanStack React Query, client state with
Zustand, forms with React Hook Form, and the UI is built on Ant Design. Reports and documents are
generated client-side as PDFs.

## Tech Stack

| Area              | Tools                                             |
| ----------------- | ------------------------------------------------- |
| Framework         | React 19                                          |
| Build tool        | Vite 7                                            |
| UI library        | Ant Design 6 + Ant Design Charts                  |
| Server state      | TanStack React Query (+ Devtools)                 |
| Client state      | Zustand                                           |
| Routing           | React Router DOM 7                                |
| Forms             | React Hook Form                                   |
| Networking        | Axios                                             |
| Documents         | @react-pdf/renderer                               |
| Dates             | Moment                                            |
| Tooling           | ESLint                                            |

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables in a .env file
#    (API base URL and any keys — not committed to the repo)

# 3. Start the dev server
npm run dev        # runs Vite on http://localhost:5173

# Production build
npm run build      # outputs to /dist
npm run preview    # preview the production build
npm run lint       # lint the codebase
```

## Environment

This app relies on environment variables (API endpoints, keys) defined in a `.env` file that is
**not** committed. Request the required values from the project owner.

## Project Structure

```
src/                      # application source (components, pages, state, api)
public/                   # static assets
create-housekeepers*.js   # operational seed/utility scripts
vite.config.js            # Vite configuration
eslint.config.js          # ESLint configuration
```

## License

**© 2026 Nabeel Yaseen. All rights reserved.**

This software and its source code are **proprietary and confidential**. No license — including the
MIT License — is granted. You may **not** copy, modify, distribute, sublicense, or use any part of
this code, in whole or in part, without the express prior written permission of the copyright holder.

Unauthorized use, reproduction, or distribution is strictly prohibited.
