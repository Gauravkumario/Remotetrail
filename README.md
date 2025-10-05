This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Environment Setup

1. Copy the environment variables template:

   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your environment-specific values:
   - `NEXT_PUBLIC_APP_ENV`: Set to 'development' for local development
   - `NEXT_PUBLIC_SITE_URL`: Your site URL (http://localhost:3000 for local development)
   - Add any other required environment variables

### Development Server

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment on Netlify

This project is configured for deployment on Netlify. Follow these steps:

1. Push your code to a Git repository
2. Connect your repository to Netlify
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `out`
4. Set up environment variables in Netlify:
   - Go to Site settings > Build & deploy > Environment variables
   - Add all variables from your `.env` file, updating values for production
   - Set `NEXT_PUBLIC_APP_ENV` to 'production'
   - Set `NEXT_PUBLIC_SITE_URL` to your Netlify domain (https://remotetrail.netlify.app)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
