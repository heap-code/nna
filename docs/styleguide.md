# Styleguide

TODO

## Table of contents

<!-- toc -->

- [Compliance](#compliance)
- [Eslint](#eslint)
- [Global](#global)
  - [Ordering](#ordering)
- [Styleguide extensions](#styleguide-extensions)
- [Docker-compose](#docker-compose)

<!-- tocstop -->

## Compliance

The project conforms to the style guide if all the rules described therein are respected.
The same applies to the styleguide extensions of the applications.

if, for a given code format, there is no rule in the styleguide, it is either :

1. Not restricted
2. Missing in the styleguide, in which case the styleguide must be updated.

## Eslint

A lot of rules are already defined with _eslint_.
They are considered as part of the styleguide.

The following sections are rules that it cannot enforce (yet).

## Global

The following sections are applied to almost any files of the project.

### Ordering

The ordering helps to highlight or to search code.
It also avoids conflicts with _git_.

> Always prefer the alphabetical order if none other order takes place.

## Styleguide extensions

Some files, or category of files, have their own styleguide:

> They are _extensions_ of this styleguide, so the [global rules](#global) are still applied, unless explicitly mentioned otherwise.

- [Documentation](./styleguide/documentation.md)
- [Markdown files](./styleguide/markdown.md)
- [Javascript/Typescript](./styleguide/typescript.md)

## Docker-compose

Do **not** prefix the services in a `docker-compose.yml` file.
They are already prefixed by the folder it is run from.
