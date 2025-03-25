import * as vscode from "vscode";
import * as path from "path";
import { getFileIconLabel } from "./fileIcon";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "bufferList.showOpenBuffers",
    async () => {
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
          if (!doc.isUntitled) {
            fileMap.set(doc.uri.fsPath, doc.uri);
          }
        });
      }

      // Create a list of `QuickPickItems` from `fileMap`
      const items: vscode.QuickPickItem[] = [];
      fileMap.forEach((uri) => {
        items.push({
          label: getFileIconLabel(uri.fsPath),
          description: uri.fsPath,
        });
      });

      // Create the `QuickPick`
      const quickPick = vscode.window.createQuickPick();
      quickPick.items = items;
      quickPick.placeholder = "Select an open file...";
      quickPick.matchOnDescription = true;
      quickPick.matchOnDetail = true;

      // Preview the file in the current editor group as user hovers on an item.
      quickPick.onDidChangeActive(async (activeItems) => {
        if (activeItems[0]) {
          const selectedUri = vscode.Uri.file(activeItems[0].description!);
          // Preview the file in the current editor group.
          await vscode.window.showTextDocument(selectedUri, {
            preview: true,
            preserveFocus: true,
          });
          vscode.commands.executeCommand("workbench.action.quickInputFocus");
        }
      });

      let accepted = false;
      quickPick.onDidAccept(async () => {
        const selected = quickPick.selectedItems[0];
        if (selected) {
          const selectedUri = vscode.Uri.file(selected.description!);
          // Open the file in the current editor group and make it active.
          await vscode.window.showTextDocument(selectedUri, { preview: false });
        }

        accepted = true;
        quickPick.hide();
      });

      quickPick.onDidHide(async () => {
        // If canceled, restore original editor
        if (originalEditor && originalEditor.document && !accepted) {
          await vscode.window.showTextDocument(originalEditor.document, {
            preview: false,
            viewColumn: originalViewColumn,
          });
        }
        quickPick.dispose();
      });

      quickPick.show();
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
