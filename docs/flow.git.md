# Git flow

TODO

## Table of contents

<!-- toc -->

- [Summary](#summary)
  - [Simple contribution](#simple-contribution)
  - [Hotfix contribution](#hotfix-contribution)
- [Terminology](#terminology)
  - [Variables format](#variables-format)
  - [Dictionary](#dictionary)
- [Branch naming](#branch-naming)
  - [Environment branches](#environment-branches)
- [Commit message](#commit-message)
- [Pull request](#pull-request)
  - [PR title](#pr-title)
  - [Why 'merge-squash' ?](#why-merge-squash-)

<!-- tocstop -->

## Summary

This is a summary, mostly examples, of how one can manage _git_ within this project.

The shown examples still respects the rest of the document.  
It has been put on the top to be more easily accessible.

> So it is expected that the documentation if fully read at least once.

### Simple contribution

Simple contribution to the project:

1. Create a branch from `master`.  
Example:
    - `dev/<slug>`
    - `fix/<task-id>/<slug>`
2. Commit/push your work
3. Create a PR into `master` with the title being a [commit message](#commit-message).  
Example:
    - `fix: correct loading page`
    - `feat(#123/user): add user auth`
4. When the PR is ready and the CI is OK
 -> **squash and merge**

### Hotfix contribution

It may occur that an error is reported/found on a environment and that a fix must be quickly applied .

> The correction might already be applied to `master`,
> but it is not desired to ship it alongside other features.  
> The following process still applies and the correction itself can be _cherry-picked_.

1. Create a branch from `environment/<env>`.  
Example:
    - `hotfix/<slug>`
    - `hotfix/<task-id>/<slug>`
2. Commit/push your work
3. Create a PR into `environment/<env>` with the title being a [commit message](#commit-message).  
Example:
    - `fix: correct password secret`
    - `fix(#123/user): clean auth data`
4. When the PR is ready and the CI is OK
 -> **squash and merge**

## Terminology

Some words are re-used thorough the document,
their meaning, regarding the document, are described here.

### Variables format

A variable appears in a _snippet_ and follows this format: `<my-var>`.  
The `<>` signifies that `my-var` is a variable and is not part of the 'output-string'.

Example with the snippet `git commit -m "Hello <my-name>"` and the value of `my-name` being `there`, it outputs `git commit -m "Hello there"`.

If a variable appears multiple times on the same snippet, it is the same value.  
If it is not the intention, the variable can be suffixed with `_<...>`.  
Example: `git -m "Hello <name-user_local>" -u <name-user_remote>`

> Unless explicitly mentioned otherwise, all variables are in [kebab-case](https://developer.mozilla.org/en-US/docs/Glossary/Kebab_case).

### Dictionary

- `<task-id>` - The task id for a given task.  
For example, it can be:
  - `#123`, the number of an issue in _GitHub_
  - `DEV-123`, the issue id on [JIRA](https://www.atlassian.com/software/jira)
  - ...
- _(git) branch folder_ - chunk of string in a branch ended by the separator `/`.  
Example: the branch `dev/user/group` has a _folder_ `dev/` and `dev/user`.
- `master` - the principal branch.  
 Even if the default branch has been renamed, the documentation will refer to it as `master`
- [slug](https://stackoverflow.com/questions/4230846/what-is-the-etymology-of-slug-in-a-url) -
a short _display-name_ (e.g. `user-group`).

## Branch naming

All branches are considered 'development branches',
except for the following ones:

- `master`: Represents a stable state:  
A functional code on which is added a set of new features/fix/...
- `environments/<env>`: everything "under" this _branch folder_ is an [environment branch](#environment-branches)

> These branches are protected by [branch protections](./git-host.protection.md#protect-branches).

Other than that, the branch naming is not very important as they are automatically deleted once merged.

However it is still recommended to use _git branch folder_.
This helps on some tools to have a better view of the actives branches.  
For example:

- `feat/`: for new features
- `fix/`: for corrections
- `docs/`: for documentation
- `test/`: for tests
- `dev/`: for _development_ (a bit of everything)

It is highly recommended to set a `<task-id>` in the branch name;
some tools may relay on it to update a task status.  
Example:

- `fix/PR-123/user-login`
- `feat/123/user/group`

### Environment branches

TODO

## Commit message

The commits of this project must follow the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).

> Even if it is less important than the [Pull Request title](#pr-title).

The following node module can help writing them:

```bash
npx cz
```

The scope of the commit can be a path.  
Example: `chore(user/group): add relation between entities`

As for the [branch naming](#branch-naming), the scope of the commit can contain the `<task-id>`.  
Example: `fix(PR-123/users): correct login`

## Pull request

TODO: Squash

### PR title

TODO

### Why 'merge-squash' ?

As `master` is the important branch,
only the useful changes should appear in its history.

There is no need to keep the noise from the development branches;  
The commits such as `run linter`, `correct test` or `same commit as before #2` gives no valuable information.

Even if someone wants to check a previous chunk of code (that may have changed due a review),
the PR content is still stored and its ID was added in the resulting squashed commit.
