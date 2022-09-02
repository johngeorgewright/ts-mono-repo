# @johngeorgewright/ts-mono-repo

This is a template repository for creating a TypeScript mono repo.

## Setting up

1. Change all references of `@johngeorgewright` to your mono-repo namespace
1. Change all references of `ts-mono-repo` to your new mono-repo name
1. Install Node.js & Yarn
1. Install dependencies `yarn`
1. Use the [generator package](https://github.com/johngeorgewright/ts-mono-repo/tree/master/packages/generator) to create new packages
1. If using VSCode, open the workspace and install recommended extensions
1. Commit changes with `yarn commit`
1. If your packages are to be published publically, change the publish command in `release.config.js` to `yarn npm publish --access public`

## Dependency management

By default, this project's dependencies is kept up-to-date with [renovate](https://www.mend.io/free-developer-tools/renovate/). This project may also be set-up for dependabot too. To do so:

1. Remove the `renovate.json` file
1. `mv .github/.dependabot.yml .github/dependabot.yml`
