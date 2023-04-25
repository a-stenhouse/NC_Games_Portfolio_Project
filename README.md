# Arran S Northcoders House of Games API Portfolio Project

## Project Description

Link to hosted back-end: https://nc-games-portfolio-project.onrender.com

This is an api built using express.js and node-pg for the purpose of a back end for a Games review website. The endpoints are built to query an SQL database and return the desired data for the purpose of displaying on the frontend. Jest and supertest were used for testing.

## Getting Going

An initial setup is required in order to get the application to work. After cloning the repo locally, two files: '.env.development' and '.env.test' must be created in the root folder. Inisde each file, PGDATABASE must be set as such: PGDATABASE=nc_games in the development file and PGDATABASE=nc_games_test in the test file.

Run npm -install so that all dependencies are installed. Next run the following npm scripts:
  - "npm run setup-dbs"
  - "npm run seed"

You can use "npm test" if you want to run the tests in the test files

You can also query the endpoints via the link at the top using insomnia to see the responses yourself.

PLEASE UPDATE TO LATEST VERSIONS OF NODE AND POSTGRES TO ENSURE COMPATIBILITY.
