const writeLog = [];

// person.jira is the client authenticated with the person's own Jira account.
function jiraFor(person) {
  return person.jira;
}

async function readIssue(person, key) {
  return jiraFor(person).getIssue(key);
}

function proposeIssue(person, fields) {
  return { account: person.jiraAccountId, fields };
}

async function createIssue(person, proposal) {
  const created = await jiraFor(person).createIssue(proposal.fields);
  writeLog.push({
    who: person.id,
    account: person.jiraAccountId,
    payload: proposal.fields,
    at: new Date().toISOString(),
  });
  return created;
}

module.exports = { readIssue, proposeIssue, createIssue, writeLog };
