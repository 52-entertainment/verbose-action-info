const fs = require('fs');
const path = require('path');
const core = require('@actions/core');
const github = require('@actions/github');



try {
  let event = "Unknown";
  let context = github.context;
  let pullRequestNumber = "";
  let prettyEventName = context.eventName
    .split('_')
    .map(s=>s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
  switch (context.eventName) {
    case "push":
      event = `Commit ${context.sha.substr(0,8)} pushed by ${context.actor}`
      break;
    case "workflow_dispatch":
      event = `Manually run by ${context.actor}`
      break;
    case "pull_request":
      pullRequestNumber = /:([^\/]+)/.exec(context.ref)[1];
      event = `Pull request #${pullRequestNumber} by ${context.actor}`
      break;
    default:
      let prettyEventName = context.eventName
        .split('_')
        .map(s=>s.charAt(0).toUpperCase() + s.slice(1))
        .join(' ');
      event = `${prettyEventName} by ${context.actor}`;
  }
  core.setOutput('prettyEvent', event)
  core.setOutput('prettyEventName', prettyEventName)
  core.setOutput('PR', pullRequestNumber)
  core.setOutput('runUrl', `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`)

} catch (error) {
  core.setFailed(error.message);
}
