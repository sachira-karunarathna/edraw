import { NonDeletedExcalidrawElement } from "../../packages/excalidraw/element/types";
import { BinaryFiles, UIAppState } from "../../packages/excalidraw/types";
import { appJotaiStore } from "../app-jotai";
import { supabase } from "../config/supabase";
import { projectAtom } from "../store/project";

export const saveDataToCloudStorage = async (
        elements: readonly NonDeletedExcalidrawElement[],
        appState: UIAppState,
        files: BinaryFiles,
        canvas?: HTMLCanvasElement
) => {
        try {
                let currentProjectData = appJotaiStore.get(projectAtom)

                const { data, error } = await supabase
                        .from('projects')
                        .update({
                                data: { elements, appState, files },
                                thumbnail: canvas?.toDataURL("image/png")
                        })
                        .eq('id', currentProjectData?.id)
                        .select()

                console.log("Updated Data: ", data)
                if (error) {
                        console.error('Failed to save to cloud:', error.message);
                }
                return true;
        } catch (error) {
                console.error('Failed to save to cloud:', error);
                throw new Error('Failed to save to cloud storage');
        }
};