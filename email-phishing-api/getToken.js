const { google } = require("googleapis");
const readline = require("readline");
const fs = require("fs");

// Scopes define what permissions the app has
const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

// Load client credentials from the downloaded JSON file
const credentials = require("./client_secret.json");

const { client_id, client_secret, redirect_uris } = credentials.installed;
const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// Function to get authorization token
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question("Enter the code from the browser: ", (code) => {
    oauth2Client.getToken(code, (err, token) => {
        if (err) return console.error("Error retrieving access token", err);
        
        // Save the token in a file
        fs.writeFileSync("token.json", JSON.stringify(token));
        console.log("Token stored successfully!");
        
        rl.close();
    });
});

// Generate an authentication URL
const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
});

console.log("Authorize this app by visiting this URL:", authUrl);
