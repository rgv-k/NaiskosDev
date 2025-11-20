require('dotenv').config(); // Load the secret key
const { Octokit } = require("@octokit/rest");

// 1. Connect to the API
const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN, // Uses the key from your .env file
});

async function connectToRepo() {
    try {
        // 2. Test the connection by getting repo details
        // REPLACE 'FRIEND_USERNAME' and 'REPO_NAME' with real values
        const { data } = await octokit.rest.repos.get({
            owner: 'rgv-k',
            repo: 'NaiskosDev',
        });

        console.log("✅ SUCCESS: Connected to GitHub API!");
        console.log(`📦 Repository: ${data.full_name}`);
        console.log(`⭐ Stars: ${data.stargazers_count}`);
        console.log(`🔗 URL: ${data.html_url}`);

    } catch (error) {
        console.error("❌ ERROR: Could not connect.", error.message);
        if (error.status === 404) {
             console.error("Tip: Check if the Repo Name is correct or if you have invite permissions.");
        }
    }
}

connectToRepo();