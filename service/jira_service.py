import os
from dotenv import load_dotenv
from jira import JIRA
from jira.exceptions import JIRAError
from requests import Session

# Load environment variables from service/.env
ENV_PATH = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(ENV_PATH)

_JIRA_CLIENT = None

def connect_jira():
    """
    Returns a cached JIRA client after validating env vars and server connectivity.
    Raises RuntimeError on missing config or connection/auth failures.
    """
    global _JIRA_CLIENT
    if _JIRA_CLIENT:
        return _JIRA_CLIENT

    base = os.getenv("JIRA_URL")
    email = os.getenv("JIRA_EMAIL")
    token = os.getenv("JIRA_API_TOKEN")

    if not base or not email or not token:
        raise RuntimeError("JIRA_URL, JIRA_EMAIL and JIRA_API_TOKEN must be set in service/.env")

    options = {"server": base}
    try:
        session = Session()
        _JIRA_CLIENT = JIRA(options=options, basic_auth=(email, token), session=session)
        # connectivity/auth check
        info = _JIRA_CLIENT.server_info()
        print("Connected to Jira. Server version:", info.get("version"))
        return _JIRA_CLIENT
    except JIRAError as e:
        raise RuntimeError(f"Failed to connect to Jira: {e}") from e

def get_backlog_issues(jql="assignee=currentUser()"):
    """
    Returns search results for the provided JQL.
    """
    jira = connect_jira()
    try:
        return jira.search_issues(jql)
    except JIRAError as e:
        raise RuntimeError(f"Error searching issues: {e}") from e

def create_issue(project_key, summary, description, issue_type="Task"):
    """
    Creates an issue after validating that the issue type exists in the project.
    Returns the created issue object.
    """
    jira = connect_jira()
    try:
        meta = jira.createmeta(projectKeys=project_key)
        types = [t["name"] for t in meta["projects"][0]["issuetypes"]]
    except Exception:
        raise RuntimeError(f"Unable to read project metadata for {project_key}")

    if issue_type not in types:
        raise RuntimeError(f"Issue type '{issue_type}' not available in project {project_key}. Available: {types}")

    issue_dict = {
        "project": {"key": project_key},
        "summary": summary,
        "description": description,
        "issuetype": {"name": issue_type},
    }
    try:
        return jira.create_issue(fields=issue_dict)
    except JIRAError as e:
        raise RuntimeError(f"Failed to create issue: {e}") from e

def update_issue(issue_key, fields):
    """
    Updates fields of an existing issue and returns the refreshed issue object.
    """
    jira = connect_jira()
    try:
        issue = jira.issue(issue_key)
        issue.update(fields=fields)
        return jira.issue(issue_key)
    except JIRAError as e:
        raise RuntimeError(f"Failed to update issue {issue_key}: {e}") from e

def transition_issue(issue_key, transition_name):
    """
    Attempts to transition an issue by name. Returns a message indicating success
    or available transitions when the requested one is not found.
    """
    jira = connect_jira()
    try:
        issue = jira.issue(issue_key)
        transitions = jira.transitions(issue)
        tid = next((t["id"] for t in transitions if t["name"] == transition_name), None)
        if tid:
            jira.transition_issue(issue, tid)
            return f"Issue {issue_key} transitioned to {transition_name}"
        else:
            names = [t["name"] for t in transitions]
            return f"Transition '{transition_name}' not found. Available transitions: {names}"
    except JIRAError as e:
        raise RuntimeError(f"Failed to transition issue {issue_key}: {e}") from e