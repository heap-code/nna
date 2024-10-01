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
  - [Review & validation](#review--validation)
  - [Why 'merge-squash'?](#why-merge-squash)

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
3. Create a PR into `master` with the title being a [PR title](#pr-title).  
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
3. Create a PR into `environment/<env>` with the title being a [PR title](#pr-title).  
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

An _environment branch_ is a git branch that starts with the `environments/` folder.  
It is supposed to represent the state (version of code) of a working production-like environment.

The names of the environments depend of the project,
but here is a list of common names:

- `prod`
- `pre-prod`
- `uat`
- `beta`
- ...

> **Note**:  
> The environment can also be a _path_, e.g. `europe/prod`.

The _state_ of an environment could be represented by a tag (and kinda is),
but branches are used for 2 main reasons:

1. A change in a environment branch is the real trigger for a [release/deploy process](./flow.release-deploy.md#release).
2. Gives a simpler way to make [hot-fixes](#hotfix-contribution).

> **Note**:  
> The environment could also be a version, such as `environments/v2`,
> in case a some level of retro-compatibility is required.
>
> However, if there is no environment (no server/application) for a given version,
a git branch `versions/`, that only do releases but no deployments, would probably be more explicit.

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

When creating a PR, it should:

- Have a correct [PR title](#pr-title)
- By default, for any _development branch_, the target is `master`
- The merge strategy is **merge and squash**
- If existing, add any additional information in the description

> **Note**:  
> Other constraints might be applied by [branch protection](./git-host.protection.md#protect-branches)

### PR title

The title of a squash PR must also be a [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/),
but, on the opposite of a [commit message](#commit-message),
it **must** be more strictly respected.

The strictness of the message is specifically applied to the _type_ of the commit and, even more precisely, to the type `feat`,
because it is used to determine a new version, generate a _changelog_, ... (cf. [release](./flow.release-deploy.md#release)).

> **Note**:  
> Do not forget that there is other type of commit, such as `docs` or `perf`.

The type of the commit must be choose depending of the **impact on the applications/project**, not the code.  
For Example:

1. When starting to develop a new feature:
    - if a new entity has been added with a function to load it from the DB
    - **but** there is no way to access this data (depending of the project: from HTTP, by exporting into a file, ...)
    - then it is still a `chore`
2. Later, when the feature is completed:
    - If the end-user can load this data
    - then it is a `feat`

**Summary**:  
It can be a `feat`,
when it can be told to a client: "_From version_ A, _you can now do_ X".

### Review & validation

TODO

Depending on the team ...  
But the reviewer should also verify that the [styleguide](./styleguide.md) is respected.

### Why 'merge-squash'?

As `master` is the important branch,
only the useful changes should appear in its history.

There is no need to keep the noise from the development branches;  
The commits such as `run linter`, `correct test` or `same commit as before #2` gives no valuable information.

Even if someone wants to check a previous chunk of code (that may have changed due a review),
the PR content is still stored and its ID was added in the resulting squashed commit.
