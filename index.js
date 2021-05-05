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

  let refrgx = /refs\/(?<type>head|tag)s\/(?<ref>.*)/;

  let parsedRef = refrgx.exec(context.ref);

  let shortRef;
  let refType;

  if (parsedRef) {
    shortRef = parsedRef.groups.ref;
		switch (parsedRef.groups.type){
      case "heads":
        refType = "branch";
        break;
      case "tags":
        refType = "tag";
        break;
      default:
        refType = parsedRef.groups.type;
    }
  } else {
    shortRef = context.ref;
    refType = "none"
  }

  let shortSHA = context.sha.substr(0,8);
  switch (context.eventName) {
    case "push":
      event = `Commit ${shortSHA} pushed by ${context.actor}`
      break;
    case "workflow_dispatch":
      event = `Manually run by ${context.actor}`
      break;
    case "pull_request":
      pullRequestNumber = /pull\/(.*)\/merge/.exec(context.ref)[1];
      event = `Pull request #${pullRequestNumber} by ${context.actor}`
      break;
    default:
      let prettyEventName = context.eventName
        .split('_')
        .map(s=>s.charAt(0).toUpperCase() + s.slice(1))
        .join(' ');
      event = `${prettyEventName} by ${context.actor}`;
  }
  core.setOutput('ref', shortRef)
  core.setOutput('ref_type', refType)
  core.setOutput('sha', shortSHA)
  core.setOutput('event', event)
  core.setOutput('name', prettyEventName)
  core.setOutput('pull_request', pullRequestNumber)
  core.setOutput('run_url', `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`)
  core.setOutput('commit_url', `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/commit/${shortSHA}`)
  core.setOutput('ref_url', `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/tree/${shortRef}`)
  core.setOutput('pr_url', pullRequestNumber.length>0 ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/pull/${pullRequestNumber}` : "")

} catch (error) {
  core.setFailed(error.message);
}
