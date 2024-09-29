# Git flow

TODO

## Table of contents

<!-- toc -->

- [Terminology](#terminology)
- [Summary](#summary)
  - [Basic contribution](#basic-contribution)
  - [Hotfix](#hotfix)
- [Branch naming](#branch-naming)
  - [Protected branches](#protected-branches)
- [Commit message](#commit-message)
- [Pull request](#pull-request)

<!-- tocstop -->

## Terminology

TODO

## Summary

TODO

### Basic contribution

1. Create a branch from `master`
    - `dev/<task-id>/<task-slug>`
    - `fix/<task-id>/<task-slug>`
2. Commit your work
3. Create a PR into `master` with the title being a [commit message](#commit-message)
4. When the PR is ready and the CI is OK -> **squash**

### Hotfix

1. Create a branch from `environment/<env>`
    - `hotfix/<task-id>/<task-slug>`
2. Commit your work
3. Create a PR into `environment/<env>` with the title being a [commit message](#commit-message)
4. When the PR is ready and the CI is OK -> **squash**

TODO

## Branch naming

TODO

Other than that, the branch naming is not very important as they are automatically deleted once merged.

TODO

### Protected branches

TODO

## Commit message

The commits of this project must follow the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).

The following node module can help writing them:

```bash
npx cz
```

TODO

## Pull request

TODO
