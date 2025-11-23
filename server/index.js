require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- Routes ---

// 1. GitHub Proxy: Fetch Issues
app.get('/api/github/prs', async (req, res) => {
  try {
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO; 

    if (!token) return res.status(500).json({ error: 'Missing GitHub Token' });

    // Query: Open issues/PRs involving me
    let query = 'is:open involves:@me';
    if (repo) {
      query += ` repo:${repo}`;
    }

    const response = await axios.get(
      'https://api.github.com/search/issues',
      {
        params: {
          q: query,
          sort: 'updated',
          order: 'desc'
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'X-GitHub-Api-Version': '2022-11-28' 
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    console.error('GitHub API Error:', errorMsg);
    res.status(500).json({ error: 'Failed to fetch from GitHub', details: errorMsg });
  }
});

// 2. GitHub Proxy: Close Issue (NEW)
app.post('/api/github/issues/close', async (req, res) => {
  try {
    const { owner, repo, number } = req.body;
    const token = process.env.GITHUB_TOKEN;

    if (!token) return res.status(500).json({ error: 'Missing GitHub Token' });
    if (!owner || !repo || !number) return res.status(400).json({ error: 'Missing issue details' });

    console.log(`Closing GitHub Issue: ${owner}/${repo} #${number}`);

    const response = await axios.patch(
      `https://api.github.com/repos/${owner}/${repo}/issues/${number}`,
      { state: 'closed' },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'X-GitHub-Api-Version': '2022-11-28' 
        }
      }
    );
    
    res.json({ success: true, data: response.data });
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    console.error('GitHub Close Error:', errorMsg);
    res.status(500).json({ error: 'Failed to close issue', details: errorMsg });
  }
});

// 3. Jira Proxy
app.get('/api/jira/issues', async (req, res) => {
  try {
    const domain = process.env.JIRA_DOMAIN;
    const email = process.env.JIRA_EMAIL;
    const token = process.env.JIRA_TOKEN;
    const projectKey = process.env.JIRA_PROJECT_KEY; 

    if (!domain || !email || !token) {
      console.error('Missing Jira Env Vars');
      return res.status(500).json({ error: 'Missing Jira Credentials' });
    }

    const auth = Buffer.from(`${email}:${token}`).toString('base64');
    
    // CHANGE: Modified JQL to exclude self-reported issues and sort by recent updates
    let jql = 'assignee=currentUser() AND resolution=Unresolved AND reporter != currentUser() ORDER BY updated DESC';
    
    if (projectKey) {
      jql = `project="${projectKey}" AND ${jql}`;
    }

    console.log(`Connecting to Jira: https://${domain}.atlassian.net/rest/api/3/search/jql`);

    const response = await axios.get(
      `https://${domain}.atlassian.net/rest/api/3/search/jql`,
      {
        params: {
          jql: jql,
          maxResults: 5,
          fields: 'summary,status,priority,updated' 
        },
        headers: {
          'Authorization': `Basic ${auth}`,
          'Accept': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    const errorMsg = error.response?.data?.errorMessages?.[0] || error.message;
    console.error('Jira API Error Detail:', error.response?.data || errorMsg);
    res.status(500).json({ error: 'Failed to fetch from Jira', details: errorMsg });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});