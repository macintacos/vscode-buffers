import * as vscode from "vscode";
import * as path from "path";
import { getFileIconLabel } from "./fileIcon";
import { getOpenFileQuickPickData } from "./quickPickData";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "bufferList.showOpenBuffers",
    async () => {
      let accepted = false;
      const { originalEditor, originalViewColumn, items } =
        getOpenFileQuickPickData();

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
        }
      });

      quickPick.onDidAccept(async () => {
        const selected = quickPick.selectedItems[0];
        if (selected) {
          const selectedUri = vscode.Uri.file(selected.description!);
          // Open the file in the current editor group and make it active.
          await vscode.window.showTextDocument(selectedUri, { preview: false });
        }

        accepted = true; // Makes sure `onDidHide` doesn't run its default functionality
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
