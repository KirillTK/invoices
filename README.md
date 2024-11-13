# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.


## How to run the app locally

To run the app locally, follow these steps:

1. **Run Docker**: Ensure you have Docker installed and running on your machine. You can download Docker from [here](https://www.docker.com/products/docker-desktop).

2. **Create .env**: Create a `.env` file in the root directory of your project. This file should contain all the necessary environment variables required for the app to run. Refer to the `.env.example` file for the required variables.

3. **Start the database**: Open your terminal and run the following command to start the database initially:
   ```sh
   ./start-database.sh
   ```
   After the initial setup, you only need to run the `factura-postgres` container:
   ```
   docker start factura-postgres
   ```

4. **Run Prisma Studio (optional)**: If you want to interact with your database using Prisma Studio, run the following command:
   ```sh
   npm run db:studio
   ```

5. **Start the development server**: Finally, start the development server by running:
   ```sh
   npm run dev
   ```

Your app should now be running locally at `http://localhost:3000`.


## How to run database migrations with Drizzle

To manage your database schema and run migrations with Drizzle, follow these steps:

1. **Apply Migrations**: To apply existing migrations, run the following command:
   ```sh
   npx drizzle-kit migrate --config=drizzle.config.ts
   ```

2. **Create New Migration**: To create a new migration, use the following command and provide a name for the migration (e.g., `init`):
   ```sh
   npx drizzle-kit generate --config=drizzle.config.ts --name=init
   ```

This will generate a new migration file in the specified migrations folder and allow you to define the changes you want to make to your database schema.

For more information on Drizzle and its migration capabilities, refer to the [Drizzle documentation](https://orm.drizzle.team).
