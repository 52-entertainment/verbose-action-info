const fs = require('fs');
const path = require('path');
const core = require('@actions/core');
const github = require('@actions/github');



try {
  let event = "Unknown";
  let context = github.context;
  switch (context.eventName) {
    case "push":
      event = `Commit ${context.sha.substr(0,8)} pushed by ${context.actor}`
      break;
    case "workflow_dispatch":
      event = `Manually run by ${context.actor}`
      break;
    case "pull_request":
      event = `Pull request ${context.ref} by ${context.actor}`
      break;
    default:
      let prettyEventName = context.eventName
        .split('_')
        .map(s=>s.charAt(0).toUpperCase() + s.slice(1))
        .join(' ');
      event = `${prettyEventName} by ${context.actor}`;
  }
  core.setOutput('prettyEvent', event)
  core.setOutput('runUrl', `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`)

} catch (error) {
  core.setFailed(error.message);
}
