import { useMemo } from 'react';
import Select, { SingleValue } from 'react-select';
import events from '../../../events';
import { useSpineViewerStore } from '../../../store';
import ActionPanelContent from '../common/ActionPanelContent';
import PanelCheckbox from '../common/PanelCheckbox';

const maxTracks = 6;

interface SelectOption {
    label: string;
    value: string;
}

const MultiTrack = () => {
    const { animations, loopAnimations, setLoopAnimations } = useSpineViewerStore((store) => {
        return {
            animations: store.animations,
            loopAnimations: store.loopAnimations,
            setLoopAnimations: store.setLoopAnimations
        };
    });

    const selectOptions: SelectOption[] = useMemo(() => {
        return animations.map((animation) => {
            return {
                label: animation,
                value: animation
            };
        });
    }, [animations]);

    const handleAnimationChange = (
        selectedOption: SingleValue<SelectOption>,
        trackIndex: number
    ) => {
        events.dispatchers.startAnimation({
            animation: selectedOption?.value || '',
            loop: loopAnimations,
            track: trackIndex
        });
    };

    return (
        <ActionPanelContent title='Multi Tracks'>
            <div className=''>
                <>
                    {Array.from({ length: maxTracks }, (_, i) => i).map((_, i) => {
                        return (
                            <div key={`track-${i}`}>
                                <PanelCheckbox
                                    onChange={(e) => setLoopAnimations(e.target.checked)}
                                    checked={loopAnimations}
                                    label={`Track ${i}. Loop`}
                                />
                                <Select
                                    onChange={(e) => {
                                        handleAnimationChange(e, i);
                                    }}
                                    options={selectOptions}
                                    isClearable
                                />
                            </div>
                        );
                    })}
                </>
            </div>
        </ActionPanelContent>
    );
};

export default MultiTrack;
