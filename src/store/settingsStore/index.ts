import create from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface SettingsStore {
    theme: string;
    canvasBackground: string;
    screenVisible: boolean;
}

export interface SettingsStoreActions {
    setTheme: (theme: string) => void;
    setCanvasBackground: (canvasBackground: string) => void;
    setScreenVisible: (screenVisible: boolean) => void;
}

export const useSettingsStore = create<SettingsStore & SettingsStoreActions>()(
    devtools(
        persist((set) => ({
            theme: "dark",
            canvasBackground: "#e4eaf0",
            screenVisible: false,
            setTheme: (theme) => set((_) => ({ theme })),
            setCanvasBackground: (canvasBackground) => set((_) => ({ canvasBackground })),
            setScreenVisible: (screenVisible) => set((_) => ({ screenVisible }))
        }), { name: "settings" })
    )
);