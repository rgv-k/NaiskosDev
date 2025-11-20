require('dotenv').config();
const { Octokit } = require("@octokit/rest");

// --- CONFIGURATION ---
const OWNER = 'rgv-k'; // Replace with friend's username
const REPO ='NaiskosDev';        // Replace with repo name
// ---------------------

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

async function startCommunication() {
    try {
        console.log("🤖 Server initializing End-to-End check...");

        // STEP 1: TALK (Create an Issue)
        console.log("1️⃣  Creating a new Issue...");
        const issue = await octokit.rest.issues.create({
            owner: OWNER,
            repo: REPO,
            title: "Server Connection Test: End-to-End",
            body: "This issue was automatically created by the Node.js backend to test API connectivity.",
        });

        const issueNumber = issue.data.number;
        console.log(`   ✅ Issue #${issueNumber} created successfully.`);

        // STEP 2: LISTEN/READ (Verify we can see it)
        console.log("2️⃣  Verifying Issue details...");
        const { data: issueData } = await octokit.rest.issues.get({
            owner: OWNER,
            repo: REPO,
            issue_number: issueNumber,
        });
        console.log(`   ✅ Verification complete. Issue status: '${issueData.state}'`);

        // STEP 3: REPLY (Post a Comment)
        console.log("3️⃣  Posting a reply...");
        const comment = await octokit.rest.issues.createComment({
            owner: OWNER,
            repo: REPO,
            issue_number: issueNumber,
            body: "✅ **System Status:** End-to-end communication established. The server can read and write to this repository.",
        });

        console.log(`🎉 SUCCESS! Reply posted: ${comment.data.html_url}`);

    } catch (error) {
        console.error("❌ Communication Breakdown:", error.message);
    }
}

startCommunication();