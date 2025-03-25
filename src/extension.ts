import * as vscode from "vscode";
import { getOpenFileQuickPickData } from "./quickPickData";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "bufferList.showOpenBuffers",
    async () => {
      let accepted = false;
      const config = vscode.workspace.getConfiguration("bufferList");
      const { originalEditor, originalViewColumn, items } =
        getOpenFileQuickPickData();

      // Create the `QuickPick`
      const quickPick = vscode.window.createQuickPick();
      quickPick.items = items;
      quickPick.placeholder = "Select an open file...";
      quickPick.matchOnDescription = true;
      quickPick.matchOnDetail = true;

      // Support previewing the file in the current editor group as user hovers on an item.
      quickPick.onDidChangeActive(async (activeItems) => {
        if (
          activeItems[0] &&
          config.get("showPreviewsDuringNavigation", true)
        ) {
          const selectedUri = vscode.Uri.file(activeItems[0].description!);
          // Preview the file in the current editor group.
          await vscode.window.showTextDocument(selectedUri, {
            preview: true,
            preserveFocus: true,
          });
        }
      });

      // Make the selected file the current file in the current editor group.
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

      // If the user dismisses the modal, return back to the original file if they didn't select one from the quick pick list.
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
