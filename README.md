# Abacus Law Calendar App

A frontend-focused calendar application that visualizes legal case events by date, time, client, and matter.  
This project demonstrates data fetching, transformation, and dynamic UI rendering using vanilla JavaScript and modular design.

---

## Live Demo

**Live Site:** <https://kerri-task-project.netlify.app>  
**Source Code:** <https://github.com/kkmorrisfam/wdd330-project>

---

## Using the Live Demo

This application is driven entirely by calendar data.  
Only dates that have associated events will display times and details.

To see the full functionality:

- Select a date that contains calendar items
- Then click on a time to view clients and matters

### Suggested Dates to Try

- **January 14, 2026**
- **February 19, 2026**
- **April 9, 2026**

---

## Demo

### Date → Time List

![Calendar Demo](docs/gifs/calendar-demo-1.gif)


---

## Project Overview

The Abacus Law Calendar App simulates how a legal practice might visualize calendar data from an external case-management system.  
Users can select a date from a calendar and progressively drill down into:

- Available event times
- Clients scheduled at a given time
- Matters associated with each client

The project was originally designed to support API-driven calendar data and currently uses structured test data hosted on JSONBin.

---

## Technologies Used

- **JavaScript (ES6 Modules)**
- **HTML5 / CSS3**
- **Parcel** (development server & bundler)
- **JSONBin.io** (mock API data source)
- **LocalStorage** (UI state persistence)
- **Node.js** (for local development)

---

## Key Features

- Interactive monthly calendar with date selection
- Dynamic column-based layout that updates based on user interaction
- Fetches and filters remote JSON data by:
  - Date
  - Time
  - Client
  - Matter
- Toggle view between **Client-centric** and **Matter-centric** displays
- Normalizes inconsistent external data formats (dates, case numbers)
- Dark / Light mode toggle
- Modular architecture using ES6 classes and services

---

## What This Project Demonstrates

- Working with **non-normalized, real-world data**
- Writing custom data-transformation logic (e.g., extracting case numbers)
- Coordinating UI updates across multiple dependent components
- Debugging async data flows and browser/network issues
- Clean separation of concerns:
  - Calendar logic
  - Data services
  - Rendering logic
  - UI utilities

---

## Running the Project Locally

```bash
npm install
npm start
```

---

## Future Enhancements

If I continue building this project, the next improvements I would implement are:

- **Database-backed events (CRUD):** Add the ability to create, edit, and delete calendar events, persisting changes to a database instead of static JSON.
- **Live data integration:** Connect the UI to a real backend API (e.g., Express + MongoDB/Postgres) so updates are reflected immediately.
- **Calendar indicators:** Visually mark dates that have events (e.g., dot/badge on the calendar day) so users can scan the month quickly.

---

## Additional Demos

### Client -> Date -> Time -> Detail

![Client Date and Time Filter](docs/gifs/CalendarDemoInit.gif)

### Toggle Client/Matter

![Client Matter Toggle](docs/gifs/CalendarByMatter_1.gif)

### Toggle Light/Dark Mode

![Light/Dark Toggle](docs/gifs/CalendarLightDark.gif)
