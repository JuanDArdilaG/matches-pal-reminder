# Matches Pal Reminder

## Description

Matches Pal Reminder (MPR) is a simple server that executes a script to scrape websites for incoming football matches and notifies users via email.

## Usage

### Pre-requisites

- Node.js v18.16.0+

### Installation

1. Clone the repository
2. Install dependencies
   ```
   npm install
   ```
3. Create a `.env` file in the root directory and add the following environment variables:
   ```
   EMAIL=<email>
   PASSWORD=<password>
   ```

### Running the server

```
npm start
```

### Endpoints

`POST /run-script`
