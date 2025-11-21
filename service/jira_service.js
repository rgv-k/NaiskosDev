import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import JiraApi from "jira-client";
import axios from "axios";

// -----------------------------------------------------
// Resolve correct .env path for ESM (THIS FIXES YOUR ISSUE)
// -----------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

// -----------------------------------------------------
// GLOBAL JIRA CLIENT HOLDER
// -----------------------------------------------------
let jira = null;

// -----------------------------------------------------
// Connect to Jira
// -----------------------------------------------------
function connectJira() {
  if (jira) return jira;

  const base = process.env.JIRA_URL;
  const email = process.env.JIRA_EMAIL;
  const token = process.env.JIRA_API_TOKEN;

  if (!base || !email || !token) {
    throw new Error("Missing Jira credentials in .env");
  }

  const host = base.replace(/^https?:\/\//, "").replace(/\/$/, "");

  jira = new JiraApi({
    protocol: "https",
    host,
    username: email,
    password: token,
    apiVersion: "2",
    strictSSL: true
  });

  return jira;
}

// -----------------------------------------------------
// GET ISSUES USING NEW JIRA CLOUD ENDPOINT
// -----------------------------------------------------
async function getAssignedIssues(jql = "assignee=currentUser()") {
  const base = process.env.JIRA_URL;
  const email = process.env.JIRA_EMAIL;
  const token = process.env.JIRA_API_TOKEN;

  const auth = Buffer.from(`${email}:${token}`).toString("base64");

  try {
    const res = await axios.post(
      `${base}/rest/api/3/search/jql`,
      { jql },
      {
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    );

    return res.data.issues || [];
  } catch (err) {
    console.error(">>> Jira search error:", err.response?.data || err.message);
    throw new Error(`Error searching issues: ${err.message}`);
  }
}

// -----------------------------------------------------
// CREATE ISSUE
// -----------------------------------------------------
async function createIssue({ projectKey, summary, description, issueType = "Task" }) {
  const client = connectJira();
  if (!projectKey) projectKey = process.env.JIRA_PROJECT;

  const payload = {
    fields: {
      project: { key: projectKey },
      summary,
      description,
      issuetype: { name: issueType }
    }
  };

  try {
    const result = await client.addNewIssue(payload);
    return result;
  } catch (err) {
    throw new Error(`Failed to create issue: ${err.message}`);
  }
}

// -----------------------------------------------------
// UPDATE ISSUE
// -----------------------------------------------------
async function updateIssue(issueKey, fields) {
  const client = connectJira();
  try {
    await client.updateIssue(issueKey, { fields });
    return await client.findIssue(issueKey);
  } catch (err) {
    throw new Error(`Failed to update issue ${issueKey}: ${err.message}`);
  }
}

// -----------------------------------------------------
// TRANSITION ISSUE
// -----------------------------------------------------
async function transitionIssue(issueKey, transitionName) {
  const client = connectJira();
  try {
    const transitions = await client.listTransitions(issueKey);
    const available = transitions.transitions || transitions;

    const match = available.find((t) => t.name === transitionName);

    if (!match) {
      const availableNames = available.map((t) => t.name).join(", ");
      return `Transition '${transitionName}' not found. Available: ${availableNames}`;
    }

    await client.transitionIssue(issueKey, { transition: { id: match.id } });
    return `Issue ${issueKey} transitioned to ${transitionName}`;
  } catch (err) {
    throw new Error(`Failed to transition issue ${issueKey}: ${err.message}`);
  }
}

// -----------------------------------------------------
// EXPORTS
// -----------------------------------------------------
export {
  connectJira,
  getAssignedIssues,
  createIssue,
  updateIssue,
  transitionIssue
};

// -----------------------------------------------------
// SELF-TEST MODE (node jira_service.js --test)
// -----------------------------------------------------
if (process.argv.includes("--test")) {
  console.log(">>> Running Jira service test...");

  try {
    const issues = await getAssignedIssues();
    console.log(`>>> Issues assigned to you: ${issues.length}`);

    const created = await createIssue({
      summary: "Test issue from terminal",
      description: "This issue was created via Node.js Jira integration."
    });

    console.log(">>> Created:", created.key);

    const updated = await updateIssue(created.key, {
      summary: "Updated test issue"
    });

    console.log(">>> Updated:", updated.key);

    const transitioned = await transitionIssue(created.key, "In Progress");
    console.log(">>>", transitioned);

    console.log(">>> All tests finished successfully.");
  } catch (err) {
    console.error(">>> TEST ERROR:", err.message);
  }
}
