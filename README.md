
  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">

</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# URL Shortening Service

## Overview

This GitHub repository houses a sophisticated URL shortening service designed for scalability, security, and comprehensive analytics. The service allows users to generate short URLs for lengthy input URLs and provides detailed analytics about the generated URLs.

## Features

1. **URL Shortening:**
  - Provides a sophisticated URL service to generate compact URLs for specific or lengthy URLs and redirects users from short URLs to the correct IP address.
  - Utilizes the shortId library to generate unique short IDs for input URLs.
  - To generate a short URL, the shortId library is employed, providing a unique ID. The process involves taking input links that users want to shorten. Based on this, a 
      unique ID is generated, resulting in a local link transformation from "https://google.com" to "http://localhost:3000/api/url/xyzabc." This is especially useful when 
      dealing with large input URLs.
   - Example: "https://google.com" transforms to "http://localhost:3000/api/url/xyzabc."

3. **Database Structure:**
   - Employs two database tables: Users and URLs.
   - Users table stores user information for authentication and authorization.
   - URLs table contains records of generated short URLs and associated analytics data.

4. **User Authentication and Authorization:**
   - Implements secure user authentication using JsonWebToken for token-based security.
   - Utilizes bcryptjs library for password hashing and verification.

5. **Middleware for Authentication:**
   - Develops a middleware function to authenticate users before allowing URL generation.
   - Ensures only authenticated users can create short URLs.

6. **Analytics:**
   - Captures analytics data, including click count, time of clicks, browser information, and operating system.
   - Utilizes JavaScript libraries like platform.js for browser info and ua-parser for device info.
   - Presents reconstructed analytics data for a comprehensive user view.

7. **Scalability:**
   - Utilize Redis to distribute the load and balance traffic during high usage periods.
   - Leverage Redis for quick responses, reducing the load on the primary database.
   - uses Redis for caching to enhance scalability and performance.
   - Uses Redis as a persistent cache for storing frequently accessed data.
   - Adopts a caching strategy to check the cache before making database API calls.
   - Leverages Redis for load balancing during high traffic periods.
