# MealMentor

ChatGPT API Hackathon Project hosted by DonTheDeveloper.

## About

This project is a Cooking App featuring food and chatgpt apis to gather recipes, generate instructions/ingredients and save to a user library; try it out using a feature full demo version with one click. Built in one month as part of a hackathon from March -> April 2023.

Technology used:

- TailwindCSS
- Typescript
- React
- Nextjs
- TRPC
- PlanetScale (MySQL)
- Auth0
- ChatGPT API
- Spoonacular API
- Vercel (hosting)

## How to use locally

In order to use this locally, follow the steps below:

1. Download from this repository.
2. Run "npm install" to install each dependency.
3. Get all required keys setup in a .env file.

.ENV requirements

AUTH0_SECRET="key_goes_here"
AUTH0_BASE_URL="url_goes_here"
AUTH0_ISSUER_BASE_URL="auth0_url_goes_here"
AUTH0_CLIENT_ID="clientid_goes_here"
AUTH0_CLIENT_SECRET="key_goes_here"
OPENAI_API_KEY="key_goes_here"
DATABASE_URL='url_goes_here'
FOOD_APIKEY='key_goes_here'

4. Run "npm run dev"
5. Enjoy!

## Deployment

This project is deployed directly onto Vercel. To view the published project, [click here](https://mymealmentor.vercel.app/)
