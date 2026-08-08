# CO-DNA Website

The product website and browser-based workspace for **CO-DNA**, an AI-powered code intelligence platform. It introduces the VS Code extension, lets users try code analysis in the browser, and provides authenticated dashboard and account experiences.

[View the CO-DNA extension repository](https://github.com/Subhash-2910/Co-DNA/tree/main)

## What it includes

- A responsive product landing page with feature, process, testimonial, pricing, and call-to-action sections
- An interactive playground for uploading or pasting code, running analysis, generating flowcharts, and converting code between languages
- AI-powered code analysis backed by a FastAPI service and Amazon Bedrock (Amazon Nova Lite)
- Supabase authentication with email/password, Google, and GitHub sign-in
- A protected developer dashboard with usage, savings, and code-health views

## Tech stack

- **Frontend:** Next.js 16, React 19, TypeScript
- **UI:** CSS, Phosphor Icons, Monaco Editor, Mermaid, Recharts
- **Authentication:** Supabase
- **AI backend:** FastAPI, AWS Bedrock, Amazon Nova Lite

## Project structure

```text
co-dna-website-main/
├── app/                 # Next.js pages, layout, auth callback, and global styles
├── components/          # Landing page, playground, dashboard, and UI components
├── backendModel1/       # FastAPI service for AI analysis and code conversion
├── lib/                 # Shared Supabase client
├── utils/supabase/      # Browser, server, and middleware Supabase helpers
├── public/              # Static assets
└── middleware.ts        # Session refresh middleware
```

## Getting started

### Prerequisites

- Node.js 20 or later
- npm
- Python 3.10 or later (only required for live AI analysis)
- A Supabase project (only required for authentication)
- AWS credentials with access to Amazon Bedrock's Amazon Nova Lite model (only required for live AI analysis)

### 1. Install frontend dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in this directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Authentication is optional for viewing the landing page and using the playground. It is required for the dashboard and sign-in flows.

### 3. Start the website

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Running the AI backend

The playground calls the local backend at `http://localhost:8000`. From `backendModel1/`, create a `.env` file with your AWS credentials:

```env
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_DEFAULT_REGION=us-east-1
```

Install and start the backend:

```bash
cd backendModel1
python -m pip install fastapi "uvicorn[standard]" boto3 python-dotenv
uvicorn main:app --reload --port 8000
```

The service exposes endpoints for full analysis, technical-debt analysis, code explanation, modernization, and language conversion. If the local AI service is unavailable, the playground displays simulated results so the interface remains usable.

## Available scripts

```bash
npm run dev     # Start the development server
npm run build   # Create a production build
npm run start   # Run the production server
npm run lint    # Check the code with ESLint
```

## Deployment notes

Deploy the Next.js application to your preferred hosting platform. For a production deployment, configure the Supabase variables in the host environment and deploy the FastAPI service separately. Update the playground's backend URL in `components/Playground.tsx` so it points to the deployed API instead of `localhost`.

## Related project

CO-DNA also includes a VS Code extension for code analysis, technical-debt intelligence, security insights, modernization, and code visualization. See the [main project README](https://github.com/Subhash-2910/Code-DNA-final#readme) for the extension overview.

Some Images from website:-

<table>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/a1068549-ed02-4348-8f92-5fe8bc6eb3ac" width="300" alt="Screenshot 1"></td>
    <td><img src="https://github.com/user-attachments/assets/8a53613c-7c85-4d7b-a3cc-af3ee123c380" width="300" alt="Screenshot 2"></td>
    <td><img src="https://github.com/user-attachments/assets/6915b5cb-eca9-4163-8c9d-e5b462e61bc2" width="300" alt="Screenshot 3"></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/56ea2276-c3dd-464e-a0a5-736433fb43a6" width="300" alt="Screenshot 4"></td>
    <td><img src="https://github.com/user-attachments/assets/537a5da2-617d-42e6-9d05-c5ad7c0b911c" width="300" alt="Screenshot 5"></td>
    <td><img src="https://github.com/user-attachments/assets/a9330534-67c7-43e6-85dc-7ee3b44a3b3e" width="300" alt="Screenshot 6"></td>
  </tr>
</table>


