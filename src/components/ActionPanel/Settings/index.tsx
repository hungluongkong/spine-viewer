import { ColorResult } from "react-color";
import { useSettingsStore } from "../../../store";
import ColorPicker from "../../base/ColorPicker";
import ActionPanelContent from "../common/ActionPanelContent";
import "./Settings.css";
import PanelCheckbox from "../common/PanelCheckbox";

const Settings = () => {

    const { canvasBackground, setCanvasBackground, setScreenVisible, screenVisible } = useSettingsStore(store => {
        return {
            canvasBackground: store.canvasBackground,
            setCanvasBackground: store.setCanvasBackground,
            setScreenVisible: store.setScreenVisible,
            screenVisible: store.screenVisible
        }
    });

    const handleColorChange = (color: ColorResult) => {
        setCanvasBackground(color.hex);
    };

    return (
        <ActionPanelContent title="Settings">
            <div className="setting">
                <span className="setting__text">Canvas color</span>
                <ColorPicker color={canvasBackground} handleColorChange={handleColorChange} />
            </div>
            <div className="settings">
                <PanelCheckbox
                    key={'screen-visible'}
                    onChange={(e) => setScreenVisible(e.target.checked)}
                    checked={screenVisible}
                    label={'Draw Screen Bounds'}
                />
            </div>
        </ActionPanelContent>
    )
}

export default Settings;