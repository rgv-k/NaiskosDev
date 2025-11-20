print(">>> Starting Jira test script...")

import os
from service.jira_service import (
    get_backlog_issues,
    create_issue,
    update_issue,
    transition_issue,
)

# Show environment variables (loaded by jira_service)
print(">>> Checking environment variables...")
print("JIRA_URL:", os.getenv("JIRA_URL"))
print("JIRA_EMAIL:", os.getenv("JIRA_EMAIL"))
print("JIRA_API_TOKEN:", "SET" if os.getenv("JIRA_API_TOKEN") else "MISSING")
print("JIRA_PROJECT:", os.getenv("JIRA_PROJECT") or "MISSING")

try:
    print(">>> Fetching issues...")
    issues = get_backlog_issues()
    print(f"Found {len(issues)} issues assigned to you.")
    for i in issues[:5]:
        print(i.key, "-", i.fields.summary)
except Exception as e:
    print("Error fetching issues:", e)

try:
    project_key = os.getenv("JIRA_PROJECT")
    if not project_key:
        print(">>> Skipping issue creation: JIRA_PROJECT env var not set.")
        print(">>> Set JIRA_PROJECT to your Jira project key (e.g., 'AIDE') to enable create/update/transition steps.")
    else:
        print(">>> Creating test issue...")
        new_issue = create_issue(project_key, "Test issue from NaiskosDev", "Created via API", issue_type="Task")
        print("Created issue:", new_issue.key)

        print(">>> Updating issue...")
        updated = update_issue(new_issue.key, {"summary": "Updated summary from NaiskosDev"})
        print("Updated issue:", updated.key)

        print(">>> Transitioning issue...")
        msg = transition_issue(new_issue.key, "In Progress")
        print(msg)
except Exception as e:
    print("Error creating/updating/transitioning issue:", e)

print(">>> Script finished.")