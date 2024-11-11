import React from "react";
import type { NonDeletedExcalidrawElement } from "../element/types";
import { t } from "../i18n";
import type { ExportOpts, BinaryFiles, UIAppState } from "../types";
import { Dialog } from "./Dialog";
import { exportToFileIcon, LinkIcon } from "./icons";
import { ToolButton } from "./ToolButton";
import { actionSaveFileToDisk } from "../actions/actionExport";
import { Card } from "./Card";
import "./ExportDialog.scss";
import { nativeFileSystemSupported } from "../data/filesystem";
import { trackEvent } from "../analytics";
import type { ActionManager } from "../actions/manager";
import { getFrame } from "../utils";
import { CloudIcon } from "lucide-react";

import { supabase } from "../../../excalidraw-app/config/supabase";
import { appJotaiStore } from "../../../excalidraw-app/app-jotai";
import { projectAtom } from "../../../excalidraw-app/store/project";

const actionUpdateToCloud = async (
  elements: readonly NonDeletedExcalidrawElement[],
  appState: UIAppState,
  files: BinaryFiles,
  canvas: HTMLCanvasElement
) => {
  try {
    let currentProjectData = appJotaiStore.get(projectAtom)

    const { data, error } = await supabase
      .from('projects')
      .update({
        data: { elements, appState, files },
        thumbnail: canvas.toDataURL("image/png")
      })
      .eq('id', currentProjectData?.id)
      .select()
    if (error) {
      console.error(error.message)
    } else {
      return true;
    }
  } catch (error) {
    console.error('Failed to save to cloud:', error);
    throw new Error('Failed to save to cloud storage');
  }
};

const JSONExportModal = ({
  elements,
  appState,
  setAppState,
  files,
  actionManager,
  exportOpts,
  canvas,
  onCloseRequest,
}: {
  appState: UIAppState;
  setAppState: React.Component<any, UIAppState>["setState"];
  files: BinaryFiles;
  elements: readonly NonDeletedExcalidrawElement[];
  actionManager: ActionManager;
  onCloseRequest: () => void;
  exportOpts: ExportOpts;
  canvas: HTMLCanvasElement;
}) => {
  const { onExportToBackend } = exportOpts;
  return (
    <div className="ExportDialog ExportDialog--json">
      <div className="ExportDialog-cards">
        {exportOpts.saveFileToDisk && (
          <Card color="lime">
            <div className="Card-icon">{exportToFileIcon}</div>
            <h2>{t("exportDialog.disk_title")}</h2>
            <div className="Card-details">
              {t("exportDialog.disk_details")}
              {!nativeFileSystemSupported &&
                actionManager.renderAction("changeProjectName")}
            </div>
            <ToolButton
              className="Card-button"
              type="button"
              title={t("exportDialog.disk_button")}
              aria-label={t("exportDialog.disk_button")}
              showAriaLabel={true}
              onClick={() => {
                actionManager.executeAction(actionSaveFileToDisk, "ui");
              }}
            />
          </Card>
        )}

        <Card color="blue">
          <div className="Card-icon">
            <CloudIcon size={24} />
          </div>
          <h2>{"Save to Cloud"}</h2>
          <div className="Card-details">
            {"Save your drawing to cloud storage for easy access anywhere"}
          </div>
          <ToolButton
            className="Card-button"
            type="button"
            title={"Save to Cloud"}
            aria-label={"Save to Cloud"}
            showAriaLabel={true}
            onClick={async () => {
              try {
                trackEvent("export", "cloud", `ui (${getFrame()})`);
                await actionUpdateToCloud(elements, appState, files, canvas);
                setAppState({ openDialog: null });
                setAppState({ toast: { message: "Saved to cloud successfully!" } });
              } catch (error: any) {
                setAppState({ errorMessage: error.message });
              }
            }}
          />
        </Card>
        {onExportToBackend && (
          <Card color="pink">
            <div className="Card-icon">{LinkIcon}</div>
            <h2>{t("exportDialog.link_title")}</h2>
            <div className="Card-details">{t("exportDialog.link_details")}</div>
            <ToolButton
              className="Card-button"
              type="button"
              title={t("exportDialog.link_button")}
              aria-label={t("exportDialog.link_button")}
              showAriaLabel={true}
              onClick={async () => {
                try {
                  trackEvent("export", "link", `ui (${getFrame()})`);
                  await onExportToBackend(elements, appState, files);
                  onCloseRequest();
                } catch (error: any) {
                  setAppState({ errorMessage: error.message });
                }
              }}
            />
          </Card>
        )}
        {exportOpts.renderCustomUI &&
          exportOpts.renderCustomUI(elements, appState, files, canvas)}
      </div>
    </div>
  );
};

export const JSONExportDialog = ({
  elements,
  appState,
  files,
  actionManager,
  exportOpts,
  canvas,
  setAppState,
}: {
  elements: readonly NonDeletedExcalidrawElement[];
  appState: UIAppState;
  files: BinaryFiles;
  actionManager: ActionManager;
  exportOpts: ExportOpts;
  canvas: HTMLCanvasElement;
  setAppState: React.Component<any, UIAppState>["setState"];
}) => {
  const handleClose = React.useCallback(() => {
    setAppState({ openDialog: null });
  }, [setAppState]);

  return (
    <>
      {appState.openDialog?.name === "jsonExport" && (
        <Dialog onCloseRequest={handleClose} title={t("buttons.export")}>
          <JSONExportModal
            elements={elements}
            appState={appState}
            setAppState={setAppState}
            files={files}
            actionManager={actionManager}
            onCloseRequest={handleClose}
            exportOpts={exportOpts}
            canvas={canvas}
          />
        </Dialog>
      )}
    </>
  );
};
