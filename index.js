var fs = require('fs');
var path = require('path');
const core = require('@actions/core');
const github = require('@actions/github');
const octokit = github.getOctokit(process.env.GITHUB_TOKEN);
const context = github.context;

async function getPrNumber() {
    return await octokit.rest.repos.listPullRequestsAssociatedWithCommit({
        owner: context.repo.owner,
        repo: context.repo.repo,
        commit_sha: core.getInput('commitSHA', { required: true }),
    });
}

async function commentToPR(message, PRNumber){
    const new_comment = octokit.issues.createComment({
        ...context.repo,
        issue_number: PRNumber,
        body: message
      });

    return;
}


let main = () => {
    let PRtoComment = getPrNumber();
    let message = core.getInput('messagePrefix', { required: false }) || "";
    let data = ""
    let messageSuffix = core.getInput('messageSuffix', { required: false }) || "";
    let messagePath = core.getInput('path', { required: true });

    if(path.isAbsolute(messagePath)){
        fs.readFile(messagePath, function(err, data){
            message += data;
            message += messageSuffix;

            commentToPR(message, PRtoComment)
        })
    }else{
        fs.readFile(__dirname + "/" + messagePath, function(err,data){
            message += data;
            message += messageSuffix;

            commentToPR(message, PRtoComment)
        })
    }

    return;

}

main()