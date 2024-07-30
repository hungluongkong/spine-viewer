import { debugOptionChange } from "./dispatchers/debugOptionChange";
import { defaultMixinChange } from "./dispatchers/defaultMixinChange";
import { destroyPixiApp } from "./dispatchers/destroyPixiApp";
import { filesLoaded } from "./dispatchers/filesLoaded";
import { screenVisibleChange } from "./dispatchers/screenVisibleChange";
import { setCanvasBackground } from "./dispatchers/setCanvasBackground";
import { setMixin } from "./dispatchers/setMixin";
import { setupPose } from "./dispatchers/setupPose";
import { skinChange } from "./dispatchers/skinChange";
import { spineCreated } from "./dispatchers/spineCreated";
import { spineEvent } from "./dispatchers/spineEvent";
import { startAnimation } from "./dispatchers/startAnimation";
import { timelinePlay } from "./dispatchers/timelinePlay";
import { onDebugOptionChange } from "./handlers/onDebugOptionsChange";
import { onDestroyPixiApp } from "./handlers/onDestroyPixiApp";
import { onFilesLoaded } from "./handlers/onFilesLoaded";
import { onSetScreenVisible } from "./handlers/onScreenVisiblechange";
import { onSetCanvasBackground } from "./handlers/onSetCanvasBackground";
import { onSetDefaultMixin } from "./handlers/onSetDefaultMixin";
import { onSetMixin } from "./handlers/onSetMixin";
import { onSetupPose } from "./handlers/onSetupPose";
import { onSkinChange } from "./handlers/onSkinChange";
import { onSpineCreated } from "./handlers/onSpineCreated";
import { onSpineEvent } from "./handlers/onSpineEvent";
import { onStartAnimation } from "./handlers/onStartAnimation";
import { onTimelinePlay } from "./handlers/onTimelinePlay";

const dispatchers = {
    debugOptionChange,
    destroyPixiApp,
    filesLoaded,
    setMixin,
    setCanvasBackground,
    setupPose,
    skinChange,
    spineCreated,
    startAnimation,
    timelinePlay,
    spineEvent,
    defaultMixinChange,
    screenVisibleChange
};

const handlers = {
    onDebugOptionChange,
    onDestroyPixiApp,
    onFilesLoaded,
    onSetMixin,
    onSetDefaultMixin,
    onSetScreenVisible,
    onSetCanvasBackground,
    onSetupPose,
    onSkinChange,
    onSpineCreated,
    onStartAnimation,
    onTimelinePlay,
    onSpineEvent
};

export default {
    dispatchers,
    handlers,
};














