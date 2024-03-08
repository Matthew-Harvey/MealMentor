# MealMentor
ChatGPT API Hackathon Project hosted by DonTheDeveloper.

![Thumbnail Image](https://mtlh.vercel.app/assets/mealmentor_thumb.66db444f_1JCSli.webp)

## About
This project is a Cooking App featuring food and chatgpt apis to gather recipes, generate instructions/ingredients and save to a user library; try it out using a feature full demo version with one click.

Built main features as part of a hackathon from March -> April 2023.

## Demo
This project is deployed directly onto Vercel. 
[mymealmentor.vercel.app](https://mymealmentor.vercel.app/)

## Technologies
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

## How to deploy locally
Follow the steps below:
1. Download code from this repository.
2. Install every dependency.
```typescript
npm install
```
3. Create api keys from the following sources:
    1. [Auth0](https://manage.auth0.com/dashboard/)
    2. [OpenAI/ChatGPT](https://platform.openai.com/account/api-keys)
    3. [PlanetScale](https://app.planetscale.com/)
    4. [FoodAPI](https://spoonacular.com/food-api/console#Profile)

4. Get all required keys setup in a .env file.
```typescript
AUTH0_SECRET="key_goes_here"
AUTH0_BASE_URL="url_goes_here"
AUTH0_ISSUER_BASE_URL="auth0_url_goes_here"
AUTH0_CLIENT_ID="clientid_goes_here"
AUTH0_CLIENT_SECRET="key_goes_here"
OPENAI_API_KEY="key_goes_here"
DATABASE_URL='url_goes_here'
FOOD_APIKEY='key_goes_here'
```

5. Run locally
```typescript
 npm run dev
```

6. Enjoy!
