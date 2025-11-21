require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const {
  getBacklogIssues,
  createIssue,
  updateIssue,
  transitionIssue
} = require('./jira_service');

(async () => {
  console.log(">>> Starting Jira test script...");

  console.log(">>> Checking environment variables...");
  console.log("JIRA_URL:", process.env.JIRA_URL);
  console.log("JIRA_EMAIL:", process.env.JIRA_EMAIL);
  console.log("JIRA_API_TOKEN:", process.env.JIRA_API_TOKEN ? "SET" : "MISSING");
  console.log("JIRA_PROJECT:", process.env.JIRA_PROJECT || "MISSING");

  try {
    console.log(">>> Fetching issues...");
    const issues = await getBacklogIssues();
    console.log(`Found ${issues.length} issues assigned to you.`);
    issues.slice(0, 5).forEach(i => {
      console.log(`${i.key} - ${i.fields.summary}`);
    });
  } catch (e) {
    console.error("Error fetching issues:", e.message);
  }

  try {
    const projectKey = process.env.JIRA_PROJECT;
    if (!projectKey) {
      console.log(">>> Skipping issue creation: JIRA_PROJECT env var not set.");
    } else {
      console.log(">>> Creating test issue...");
      const newIssue = await createIssue({
        projectKey,
        summary: "Test issue from NaiskosDev",
        description: "Created via API",
        issueType: "Task"
      });
      console.log("Created issue:", newIssue.key);

      console.log(">>> Updating issue...");
      const updated = await updateIssue(newIssue.key, {
        summary: "Updated summary from NaiskosDev"
      });
      console.log("Updated issue:", updated.key);

      console.log(">>> Transitioning issue...");
      const msg = await transitionIssue(newIssue.key, "In Progress");
      console.log(msg);
    }
  } catch (e) {
    console.error("Error creating/updating/transitioning issue:", e.message);
  }

  console.log(">>> Script finished.");
})();
