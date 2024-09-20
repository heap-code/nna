# DevContainer feature - desktop xfce4

## Description

This feature is a copy of the 'desktop-lite' feature:
<https://github.com/devcontainers/features/tree/main/src/desktop-lite>

## Changes

The main change is the removal of _fluxbox_ to use _xfce4_ instead.

> This change is to allow the cypress studio mode to work correctly with assertions;  
> with fluxbox the "assertion submenu" does not seem to be detected by the mouse
> and the event click is triggered for the element bellow (no more search has been done).

## Future

For now, the feature will stay in this repository.

If it works well, it may be changed into its own _devContainer feature_
or a proposition may be made into the original feature to let the user choose the display manager.

Also there's already some discussion/proposition about it:

- Allow other desktop environment: <https://github.com/devcontainers/features/issues/1030>
- Make _fluxbox_ optional: <https://github.com/devcontainers/features/pull/1058>
