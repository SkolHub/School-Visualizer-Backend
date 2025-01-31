# SchoolHub School Visualizer Backend: Stay on Top of Your Classes with Push Notifications

## Overview
The SchoolHub School Visualizer Backend is a robust API designed for managing and scheduling school events with real-time notifications. Whether it's the start of an English or Math class, or a break period, this backend keeps users updated and organized. Built using NestJS with Drizzle ORM for smooth database interactions and PostgreSQL for storage, the system ensures high performance and reliability.

## Key Features
- **Push Notifications for Class Timings**: Instantly notify students when lessons or breaks are starting or ending. Supports customizable notifications for various subjects such as English, Math, and more.
- **Task Scheduling with BullMQ**: Efficiently manage scheduled tasks using BullMQ, allowing accurate countdowns and notifications for school events.
- **Redis-Powered Task Management**: Tasks and notifications are stored and retrieved using Redis, ensuring fast response times and seamless operation.
- **Schedule Upload**: Easily upload your school schedule via the `/schedule` endpoint.
- **User Settings**: Toggle notifications on or off with ease through the `/settings` endpoint.
- **Authentication**: Secure authentication with the `/auth` endpoint to ensure only authorized users can interact with the system.

## Tech Stack
- **NestJS**: A powerful framework for building scalable and maintainable APIs.
- **Drizzle ORM**: Lightweight and flexible ORM for seamless database operations with PostgreSQL.
- **BullMQ**: Task queue management for reliable scheduling.
- **Redis**: High-performance in-memory database for fast data storage and retrieval.
- **APNs**: Push notifications for delivering timely updates to iOS users.

## API Endpoints
- `/auth`: Authenticate users and issue access tokens.
- `/schedule`: Upload your school’s timetable and manage events.
- `/settings`: Configure your notification preferences (turn on/off).

You can find all endpoints in the OpenAPI dump here in the repo

---

With SchoolHub, you never have to miss an important lesson or break again!