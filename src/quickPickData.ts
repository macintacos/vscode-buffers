import * as vscode from "vscode";
import { getFileIconLabel } from "./fileIcon";

export function getOpenFileQuickPickData(): {
  originalEditor: vscode.TextEditor | undefined;
  originalViewColumn: vscode.ViewColumn | undefined;
  items: vscode.QuickPickItem[];
} {
  // Save the original active editor (MRU group)
  const originalEditor = vscode.window.activeTextEditor;
  const originalViewColumn = originalEditor
    ? originalEditor.viewColumn
    : vscode.ViewColumn.One;

  // Retrieve open tabs from all groups (deduplicated by file `fsPath`)
  const fileMap = new Map<string, vscode.Uri>();
  if (vscode.window.tabGroups && vscode.window.tabGroups.all) {
    for (const group of vscode.window.tabGroups.all) {
      for (const tab of group.tabs) {
        // Ensure we are only dealing with text editors
        if (tab.input && (tab.input as any).uri) {
          const uri = (tab.input as any).uri as vscode.Uri;
          fileMap.set(uri.fsPath, uri);
        }
      }
    }
  } else {
    // Fallback: use open text documents
    vscode.workspace.textDocuments.forEach((doc) => {
      fileMap.set(doc.uri.fsPath, doc.uri);
    });
  }

  // Create a list of `QuickPickItems` from `fileMap`
  let items: vscode.QuickPickItem[] = [];
  fileMap.forEach((uri) => {
    items.push({
      label: getFileIconLabel(uri.fsPath),
      description: uri.fsPath,
    });
  });

  // Get user setting for alphabetical order.
  const config = vscode.workspace.getConfiguration("buffers");
  const alphabeticalOrder = config.get("alphabeticalOrder", false);

  if (alphabeticalOrder) {
    items.sort((a, b) => a.label.localeCompare(b.label));
  } else if (originalEditor && originalEditor.document) {
    const currentPath = originalEditor.document.uri.fsPath;
    items = items.filter((item) => item.description !== currentPath);
    items.unshift({
      label: getFileIconLabel(currentPath),
      description: currentPath,
    });
  }

  return { originalEditor, originalViewColumn, items };
}
