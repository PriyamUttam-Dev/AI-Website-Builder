Cannot GET /# Vercel Deployment Guide

This guide will help you deploy the AI Website Builder to Vercel.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- A Google Generative AI API key
- Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Push Code to Git Repository

1. Initialize git repository (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Push to your preferred Git hosting service (GitHub, GitLab, or Bitbucket)

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from the root directory:
   ```bash
   cd Ai-Website--main
   vercel
   ```

4. Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? Select your account
   - Link to existing project? **No**
   - Project name: Enter your desired name
   - Directory: `.` (current directory)
   - Override settings? **No**

### Option B: Using Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your Git repository
4. Vercel will automatically detect the configuration from `vercel.json`

## Step 3: Configure Environment Variables

In your Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. Add the following environment variable:
   - **Name**: `GOOGLE_GENERATIVE_AI_API_KEY`
   - **Value**: Your Google Generative AI API key
   - **Environments**: Select **Production**, **Preview**, and **Development**

### Getting a Google Generative AI API Key

1. Go to [AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the API key and add it to Vercel environment variables

## Step 4: Redeploy

After adding environment variables:

1. Go to the **Deployments** tab in Vercel
2. Click the three dots (...) next to the latest deployment
3. Select **Redeploy**
4. Ensure environment variables are applied

## Project Structure

The deployment uses the following structure:

- **Frontend**: React + Vite (deployed as static build)
- **Backend**: Express + TypeScript (deployed as serverless function)
- **API Routes**: `/api/template` and `/api/chat`

## Configuration Files

- `vercel.json`: Defines build configuration and routing
- `frontend/package.json`: Frontend build scripts
- `be/package.json`: Backend build scripts (updated with `build` and `start` commands)

## Troubleshooting

### Build Fails

- Check that all dependencies are installed
- Ensure TypeScript compiles without errors locally
- Verify environment variables are set correctly

### API Errors

- Verify `GOOGLE_GENERATIVE_AI_API_KEY` is set in Vercel environment variables
- Check the API key is valid and has sufficient quota
- Review Vercel function logs for detailed error messages

### Frontend Not Loading

- Ensure the frontend build output is in `frontend/dist`
- Check that routing in `vercel.json` is correct
- Verify the build command runs successfully locally

## Local Testing

Before deploying, test locally:

1. Backend:
   ```bash
   cd be
   npm install
   npm run dev
   ```

2. Frontend (in another terminal):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Ensure both services work together before deploying

## Production URL

After successful deployment, Vercel will provide:
- Production URL: `https://your-project-name.vercel.app`
- Custom domain can be configured in project settings

## Support

For issues:
- Check Vercel deployment logs
- Review environment variable configuration
- Verify API key validity and permissions
