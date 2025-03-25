import * as path from "path";

export function getFileIconLabel(filePath: string): string {
  const ext = path.extname(filePath);
  let icon = "file";
  switch (ext) {
    case ".ts":
    case ".js":
      icon = "file-code";
      break;
    case ".json":
      icon = "settings";
      break;
    case ".html":
      icon = "code";
      break;
    case ".css":
      icon = "symbol-color";
      break;
    // ...add more mappings as needed...
    default:
      icon = "file";
  }
  return `$(${icon}) ${path.basename(filePath)}`;
}
