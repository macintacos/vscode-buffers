import * as path from "path";
import { regex } from "regex";

export function getFileIconLabel(filePath: string): string {
  const fileName = path.basename(filePath);
  let icon = "file-code";

  switch (true) {
    // Complicated conditions up here
    case regex`(
      CONDUCT|
      CONTRIBUTING|
      LICENSE|
      MAINTAINERS|
      README
    )`.test(fileName):
      icon = "book";
      break;
    case regex`(
        \.test\..*|   # e.g. ".test.js"
        _test\.go|    # e.g. "blah_test.go"
        test.*\.py    # e.g. "test_thing.py"
      )`.test(fileName):
      icon = "beaker";
      break;
    case regex`(
        go\.(mod|sum)|
        \.(
          json|jsonc|toml|yml|yaml|
          mailmap
        )
      )`.test(fileName):
      icon = "settings";
      break;
    case /\.git(ignore|config)/.test(fileName):
      icon = "git-merge";
      break;

    // Basic file extension checks down here
    case /\.html?$/.test(fileName):
      icon = "code";
      break;
    case /\.css$/.test(fileName):
      icon = "symbol-color";
      break;
    case /\.md(|x)$/.test(fileName):
      icon = "markdown";
      break;
    case /\.(png|svg|jpg|jpeg|mp4)/.test(fileName):
      icon = "attach";
      break;

    // Default to whatever `icon` is.
    default:
      break;
  }

  return `$(${icon})  ${fileName}`;
}
