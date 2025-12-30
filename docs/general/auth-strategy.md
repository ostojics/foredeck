# Auth Strategy & Onboarding Flow

## 1. Purchase-First Philosophy

The system gatekeeps all resource creation behind a successful payment. No tenant or user exists until a license is generated.

### The Flow:

1. **Purchase**: User pays via an external provider (Gumroad, Stripe, etc.).
2. **Webhook (Activation)**:
   - Provider hits your internal API with `email` and `company_name`.
   - Your system creates a **License** first.
   - A **Tenant** is created, linked to that `license_id`.
   - A **User** (Admin) is created, linked to that `tenant_id`.
3. **The Handshake (Setup Link)**:
   - System sends an email: `app.com/setup?key={license_key}`.
   - This `license_key` acts as the secure bridge to "claim" the account.
4. **Identity Binding**:
   - On the setup page, the user chooses Google or Email/Password.
   - This creates the `user_identities` record, officially "activating" the admin.

## 2. Decoupled Authentication

We use a **User + Identity** pattern to separate the profile from the login method.

- Each user is strictly allowed **one** identity (no account merging).
- The `user_identities` table acts as the lookup for all login attempts.

## 3. Multi-Tenant Security (Hybrid RLS)

- **Primary Defense**: A `tenantWhere` utility used in every TypeORM query.
- **Secondary Defense (Firewall)**: Postgres Row Level Security (RLS) policies configured at the database level using `current_setting('app.current_tenant_id')`.

# OAuth flow notes

Implementing the Google authorization code flow in Node.js involves using the
google-auth-library to handle the server-side logic securely. The process involves redirecting the user to Google for consent, receiving a temporary code, and then exchanging that code for access and refresh tokens on your backend.
Step 1: Set up Google OAuth Credentials

    Go to the Google API Console.
    Create a new project or select an existing one.
    Navigate to APIs & Services > Credentials.
    Click +Create Credentials and select OAuth client ID.
    Select Web application as the application type.
    Under Authorized redirect URIs, add the callback URL for your Node.js application (e.g., http://localhost:3001/auth/google/callback or similar).
    Note your Client ID and Client Secret.

Step 2: Configure your Node.js Project
Initialize your Node.js project and install the necessary libraries:
bash

npm init -y
npm install express google-auth-library dotenv

Create an index.js file and set up your Express server and OAuth2Client:
javascript

require('dotenv').config();
const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const app = express();
const port = 3001;

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3001/auth/google/callback'; // Must match Google Console

const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

app.listen(port, () => {
console.log(`Server running on http://localhost:${port}`);
});

Store your CLIENT_ID and CLIENT_SECRET in a .env file for security.
Step 3: Initiate the Authorization Request
Create an endpoint that redirects the user to Google's OAuth server. The user will log in and grant permissions (scopes).
javascript

app.get('/auth/google', (req, res) => {
const scopes = ['www.googleapis.com', 'www.googleapis.com'];

const authorizationUrl = oAuth2Client.generateAuthUrl({
access_type: 'offline', // Requests a refresh token
scope: scopes,
include_granted_scopes: true,
});

res.redirect(authorizationUrl);
});

Step 4: Handle the Callback and Exchange the Code
Create the redirect endpoint (e.g., /auth/google/callback) to receive the authorization code from Google and exchange it for tokens.
javascript

app.get('/auth/google/callback', async (req, res) => {
const code = req.query.code;

if (!code) {
return res.status(400).send('Authorization code missing.');
}

try {
// Exchange the authorization code for tokens
const { tokens } = await oAuth2Client.getToken(code);
oAuth2Client.setCredentials(tokens); // Set credentials for future API calls

    // Optional: Use the access token to fetch user profile info
    // const ticket = await oAuth2Client.verifyIdToken({
    //     idToken: tokens.id_token,
    //     audience: CLIENT_ID,
    // });
    // const payload = ticket.getPayload();
    // console.log('User Payload:', payload);


    // Store the tokens securely (e.g., in a database or session) and log the user in
    res.status(200).send('Authentication successful! Tokens received.');

} catch (error) {
console.error('Error exchanging code for tokens:', error);
res.status(500).send('Authentication failed.');
}
});

Key Security Points

    Client Secret is Server-Side Only: The client_secret should never be exposed on the frontend.
    Use Environment Variables: Keep sensitive credentials out of your source code.
    access_type: 'offline': This parameter is necessary if you need a refresh token to access Google APIs when the user is offline (access tokens expire quickly)
