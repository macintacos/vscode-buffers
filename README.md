# 📋 Buffers

This extension provides a command to show you a deduplicated, filterable list of all the files that are open in your workspace. If you select a file, that file will be opened in your last-active editor group. That's it, [that's the extension](https://www.youtube.com/watch?v=5ngg5-uwQYI).

## Why?

If you've ever used Vim or Neovim, you might be familiar with its concept of ["buffers"](https://neovim.io/doc/user/usr_22.html#_the-buffer-list). The way you interact with these buffers is predominantly by opening what Vim/Neovim calls a ["window"](https://neovim.io/doc/user/windows.html#_1.-introduction) which is essentially a view of a buffer. The neat thing about this is that, as far as those tools are concerned, there is only ever one instance of the buffer. No matter how many windows you open, the number of buffers open remains the same.

With Vim, it is trivial to switch to a different window, open the list of buffers, pick the buffer you care about, and then show that buffer in that window. This is simple, because again, those buffers are not "tied" to any given window.

In vanilla VSCode, it's a bit more complicated. Let's say you have multiple files open, in multiple splits (VSCode calls them ["Editor Groups"](https://code.visualstudio.com/docs/getstarted/userinterface#_editor-groups)), like so:

1. Editor Group #1:
   1. `file1.txt`
   1. `file2.txt`
1. Editor Group #2
   1. `file1.txt`

Let's say you're in Editor Group #2 and:

- You want to open `file2.txt` in Editor Group #2.
- You don't want to use the mouse.
- [You don't use tabs.](https://code.visualstudio.com/docs/getstarted/userinterface#_working-without-tabs)
- You don't want to search through all the files in your project to open it in this group.
  - I mean, it's open already, why would I want to introduce the potential for picking another file called the same thing?

You _might_ think that you could accomplish this with `edt mru`, but you'll notice that if you select `file2.txt` from the list, it will actually focus the file in Editor Group #1. There is a command called `openPreviousEditorFromHistory` that might work, but it's not searchable, and it can show you files that have been closed, which defeats the purpose of our goal.

This extension provides a way to accomplish this. It provides a command, `"Show Open Buffers"`, that does what it says on the tin. It presents you with a list of open buffers in the project, and when you've selected one, it will open in the currently active Editor Group, regardless of where that file currently "exists" in the editor group lists.

Inspired by this issue from 2021: https://github.com/microsoft/vscode/issues/128874

## Features

- Command `"Show Open Buffers"`. Shows the list of open buffers, and allows you to select one to open in the currently-active editor.

## Extension Settings

- `bufferList.showPreviewsDuringNavigation`: Uncheck this if you don't want to have previews of the files as you navigate the list. Defaults to `true`.
- `bufferList.alphabeticalOrder`: Check this if you want the list to be in alphabetical order. Defaults to `false`.

## Changelog

See: [CHANGELOG.md](./CHANGELOG.md)
