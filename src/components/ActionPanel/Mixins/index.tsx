import { useSpineViewerStore } from "../../../store";
import ActionPanelContent from "../common/ActionPanelContent";
import events from "../../../events";

const Mixins = () => {

    const { defaultMixins, setDefaultMixins } = useSpineViewerStore(store => {
        return {
            defaultMixins: store.defaultMixins,
            setDefaultMixins: store.setDefaultMixins
        }
    })

    const handleMixinsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const mix = parseFloat(e.target.value);
        setDefaultMixins(mix);
        events.dispatchers.defaultMixinChange(mix);
    }

    return (
        <ActionPanelContent title="Mixins">
            {/* slide bar from 0 to 1 */}
            {/* add label to show current value */}
            <input type="range" min="0" max="1" step="0.1" value={defaultMixins} onChange={handleMixinsChange} />
            <span className="mixin-label">{defaultMixins}</span> 
        </ActionPanelContent>
    )
}

export default Mixins;