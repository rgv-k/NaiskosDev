from flask import Flask, request, jsonify
from service.jira_service import create_issue
import os

app = Flask(__name__)

@app.route("/create-issue", methods=["POST"])
def create_issue_endpoint():
    data = request.json
    project_key = os.getenv("JIRA_PROJECT")

    try:
        issue = create_issue(
            project_key=project_key,
            summary=data.get("summary"),
            description=data.get("description"),
            issue_type=data.get("issue_type", "Task"),
            assignee=data.get("assignee"),
            labels=data.get("labels"),
            priority=data.get("priority"),
            due_date=data.get("due_date")
        )
        return jsonify({"status": "success", "issue_key": issue.key}), 201
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)
