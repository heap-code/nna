# TODO

TODO

> This file is an extension of the global [styleguide](../styleguide.md).

## Table of contents

<!-- toc -->

- [File structure](#file-structure)
- [Writing](#writing)
  - [3rd & Active vs Passive](#3rd--active-vs-passive)
  - [Headers](#headers)

<!-- tocstop -->

## File structure

TODO

### Vectorial images

It is recommended to use [draw.io](https://app.diagrams.net/) when creating schemas, graphs, ... .

There is plugins for the following IDEs:

- Visual Studio Code: <https://marketplace.visualstudio.com/items?itemName=hediet.vscode-drawio>
- JetBrains IDE: <https://plugins.jetbrains.com/plugin/15635-diagrams-net-integration>

> These files should have a `drawio.svg` extension.

## Writing

_Markdown_ will not create empty spaces, so avoid long _one-liner_ sentences.
In fact, a line can not have more than one sentence.  
Use other punctuations, as `,`, or linking words to split the lines.

> **Remember**:  
> This concerns the edition of _Markdown_ files, not their preview.
>
> If the files are edited with 3rd parties editor, some rules can possibly not be respected.

### 3rd & Active vs Passive

The first person should only be used to express an opinion, a choice, a preference, etc.  
The second person can be used to give instructions, but it is not recommended,
unless it is the imperative mood.

The passive voice should be preferred over the active one to omit pronouns.  
Example:

```text
I load the data when the app is ready -> The data are loaded when the app is ready.
```

### Headers

All headers should start with an UPPERCASE, unless it starts with a special formatting.

### Links

To optimize its navigation,
all files should be linked by another and possibly link **to** another documentation.  
So a new user can navigate through the documentation like a web page.

### Mermaid

TODO

### Section - Table of contents

It is highly recommended to add a _table of contents_ to the documentation files.

> It can be omitted for short files.

When added, there are 2 rules to respect:

- The section must be second, after the document title (level-1 header) and its header is `Table of contents`.
- The table of contents should not contain the document title nor the header for the section itself.

**Example:**

```md
<!-- Markdown -->
# Document title

Some summary/description/...

## Table of contents

- [Section 1](#section-1)
- [Section 2](#section-2)
  - [Sub-section 2.1](#sub-section-2.1)

## Section 1

Content

## Section 2

Content

### Sub-section 2.1
```

#### ToC generator

The table of contents can be generated with some IDE plugins,
but the output can change depending of the IDE and/or plugins.

To keep it "IDE agnostic", a ToC can be created with the [markdown-toc](https://www.npmjs.com/package/markdown-toc) package and the following command:

```bash
npx markdown-toc -i <path/to/file>
```
