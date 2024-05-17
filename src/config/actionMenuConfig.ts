export interface ActionMenuConfigItem {
    icon: string;
    name: string;
    label: string;
    visible: boolean;
}

const actionMenuConfig: ActionMenuConfigItem[] = [
    {
        icon: "./assets/svg/animations.svg",
        name: "animations",
        label: "Animations",
        visible: true
    },
    {
        icon: "./assets/svg/timeline.svg",
        name: "multiTrack",
        label: "MultiTrack",
        visible: true
    },
    {
        icon: "./assets/svg/settings.svg",
        name: "settings",
        label: "Settings",
        visible: false
    }
];

export default actionMenuConfig;