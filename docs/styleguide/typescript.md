# TODO

TODO

> This file is an extension of the global [styleguide](../styleguide.md).

## Table of contents

<!-- toc -->

- [`null` vs `undefined`](#null-vs-undefined)
- [When to export `interface`s or `type`s?](#when-to-export-interfaces-or-types)
- [`readonly` keyword](#readonly-keyword)
- [Barrel files (index.ts)](#barrel-files-indexts)

<!-- tocstop -->

## `null` vs `undefined`

`null` and `undefined` are often mixed, but they do not represent the same thing.

It can be summarized as follows:

- `null`: There is a value and this value is `null`.
- `undefined`: There is no value, or the value is `undefined` **and** should be considered as if there were none.

## When to export `interface`s or `type`s?

TODO: always on _non-private_.

## `readonly` keyword

Do not forget to use this keyword, for both readonly arrays and class properties.

- Especially with dependency injection, a lot of properties will never be modified
- For arrays, it informs that the array reference will not be modified

Example:

```typescript
declare class UserService {}

class GroupService {
    private readonly connection: unknown;
    public constructor(private readonly userService: UserService) {
    }
  
    public findByIds(ids: readonly number[]) {
        // ...
    }
}
```

## Barrel files (index.ts)

Do not overuse barrel files, especially in application code:  
There will probably be a lot of bidirectional relation in them.

> **Example:**
>
> With the given code, with dependency injection,
> a barrel file could create circular imports.
>
> ```typescript
> // /group/group.service.ts
> class GroupService {
>     public constructor(private readonly userService: UserService) {}
>     public getUsersForGroup() {}
> }
> 
> // /user/user.service.ts
> class UserService {
>     public constructor(private readonly groupService: GroupService) {}
>     public getGroupsForUser() {}
> }
> ```

TODO
