const test = require('node:test');
const assert = require('node:assert');
const { readIssue, proposeIssue, createIssue, writeLog } = require('../src/agent/jiraActions');

function fakePerson() {
  return {
    id: 'user-1',
    jiraAccountId: 'jira-acc-1',
    jira: {
      getIssue: async (key) => ({ key, summary: 'Existing issue' }),
      createIssue: async () => ({ key: 'NEW-1' }),
    },
  };
}

test("reads an issue with the person's own Jira client", async () => {
  const issue = await readIssue(fakePerson(), 'ABC-1');
  assert.strictEqual(issue.key, 'ABC-1');
});

test("proposes the issue on the person's own account", () => {
  const proposal = proposeIssue(fakePerson(), { summary: 'New issue' });
  assert.strictEqual(proposal.account, 'jira-acc-1');
});

test('records who, which account and the payload of every write', async () => {
  const person = fakePerson();
  await createIssue(person, proposeIssue(person, { summary: 'New issue' }));
  const entry = writeLog[writeLog.length - 1];
  assert.deepStrictEqual(
    { who: entry.who, account: entry.account, payload: entry.payload },
    { who: 'user-1', account: 'jira-acc-1', payload: { summary: 'New issue' } },
  );
});
