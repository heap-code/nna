# TODO

TODO

> This file is an extension of the global [styleguide](../styleguide.md).

## Table of contents

<!-- toc -->

- [Writing](#writing)
  - [Headers](#headers)
  - [Links](#links)
  - [Mermaid](#mermaid)
  - [Section - Table of contents](#section---table-of-contents)
    - [ToC generator](#toc-generator)

<!-- tocstop -->

TODO

## Writing

_Markdown_ will not create empty spaces, so avoid long _one-liner_ sentences.
In fact, a line can not have more than one sentence.  
Use other punctuations, as `,`, or linking words to split the lines.

> **Remember**:  
> This concerns the edition of _Markdown_ files, not their preview.
>
> If the files are edited with 3rd parties editor, some rules can possibly not be respected.

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

To keep it "IDE agnostic", a ToC can be created with the [markdown-toc](https://www.npmjs.com/package/markdown-toc) package
and the following command:

```bash
npx markdown-toc -i <path/to/file>
```
