FROM node:16-alpine

LABEL "com.github.actions.name"="Comment to PR from file"
LABEL "com.github.actions.description"="Comment on a PR from a file"
LABEL "com.github.actions.repository"="https://github.com/traveloka/github-actions-pr-comment"
LABEL "com.github.actions.maintainer"="Vincent Tjianattan <t-vincent.tjianattan@traveloka.com>"
LABEL "com.github.actions.icon"="message-circle"
LABEL "com.github.actions.color"="black"

ADD ./* $HOME/

RUN npm install
ENTRYPOINT ["node", "index.js"]