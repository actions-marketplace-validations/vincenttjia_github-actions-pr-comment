var fs = require('fs');
var path = require('path');
const core = require('@actions/core');
const github = require('@actions/github');
const octokit = github.getOctokit(process.env.GITHUB_TOKEN);
const context = github.context;

async function getPrNumber() {
    result = await octokit.rest.repos.listPullRequestsAssociatedWithCommit({
        owner: context.repo.owner,
        repo: context.repo.repo,
        commit_sha: core.getInput('commitSHA', { required: true }),
    });

    return result.data[0].number
}

async function commentToPR(message, PRNumber){
    const new_comment = octokit.rest.issues.createComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: PRNumber,
        body: message
      });

    return;
}


async function main() {
    let PRtoComment = await getPrNumber();
    let message = core.getInput('messagePrefix', { required: false }) || "";
    let messageSuffix = core.getInput('messageSuffix', { required: false }) || "";
    let messagePath = core.getInput('path', { required: true });

    if(path.isAbsolute(messagePath)){
        fs.readFile(messagePath, async function(err, data){
            message += data;
            message += messageSuffix;

            await commentToPR(message, PRtoComment)
        })
    }else{
        fs.readFile("/github/workspace/"+messagePath, async function(err,data){
            message += data;
            message += messageSuffix;

            await commentToPR(message, PRtoComment)
        })
    }

    return;
}

main()