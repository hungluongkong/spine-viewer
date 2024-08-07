import {
    TextureAtlas,
    AtlasAttachmentLoader,
    SkeletonJson,
    RegionAttachment,
    MeshAttachment,
    ClippingAttachment,
    SkeletonBounds,
    PathAttachment,
    Spine,
    SkeletonBinary
} from "@pixi-spine/all-3.8";

import {
    Application,
    BaseTexture,
    Sprite,
    Texture,
    Container,
    Graphics,

} from "pixi.js";
import events from "../events";
import { AnimationPlayData, DebugOption, FilesLoadedData, SpineMixin } from "../interfaces";
import { hexStringToNumber } from "../utils/numberUtils";
import { spineDebug } from "../utils/spineDebug";

interface PixiDragEvent {
    data: {
        global: {
            x: number;
            y: number;
        }
    }
}

interface Point {
    x: number;
    y: number;
}

interface HandlerRemover<T> {
    name: T;
    removeHandler: () => void;
}



enum PixiServiceRemoveHandlers {
    ON_START_ANIMATION,
    ON_SKIN_CHANGED,
    ON_SET_MIXIN,
    ON_SET_DEFAULT_MIXIN,
    ON_SET_CANVAS_BACKGROUND,
    ON_SET_SCREEN_VISIBLE,
    ON_TIMELINE_PLAY,
    ON_DEBUG_OPTION_CHANGED,
    ON_SETUP_POSE,
    ON_DESTROY_PIXI_APP,
    ON_FILES_LOADED,
    ON_RESIZE,
    ON_SCROLL,
    ON_DRAG_START,
    ON_DRAG_END,
    ON_DRAG_MOVE
}

class PixiService {
    private spine: Spine | null;
    private app: Application | null;
    private background: Sprite | null;
    private appInitialized: boolean;
    private dragging: boolean;
    private initialPointerPosition: Point | null;
    private initialSpinePosition: Point | null;
    private handlerRemovers: HandlerRemover<PixiServiceRemoveHandlers>[];

    private drawCallElement: HTMLElement;
    private coordinateAxises: Graphics;

    private screens: Graphics[];

    constructor() {
        const spineClassesForDebug = {
            Spine,
            core: {
                RegionAttachment,
                MeshAttachment,
                ClippingAttachment,
                SkeletonBounds,
                PathAttachment
            }
        };
        const pixiClassesForDebug = {
            Container,
            Graphics
        };
        spineDebug(spineClassesForDebug, pixiClassesForDebug);
        this.app = null;
        this.background = null;
        this.spine = null;
        this.appInitialized = false;
        this.dragging = false;
        this.initialPointerPosition = null;
        this.initialSpinePosition = null;
        this.handlerRemovers = [];
        this.drawCallElement = document.getElementById("draw-call-debug") || document.createElement("div");
        this.coordinateAxises = new Graphics();
        this.screens = [];
    }

    public init(): void {
        this.handlerRemovers.push({
            name: PixiServiceRemoveHandlers.ON_START_ANIMATION,
            removeHandler: events.handlers.onStartAnimation(this.onStartAnimation.bind(this))
        });
        this.handlerRemovers.push({
            name: PixiServiceRemoveHandlers.ON_SKIN_CHANGED,
            removeHandler: events.handlers.onSkinChange(this.onSkinChange.bind(this))
        });
        this.handlerRemovers.push({
            name: PixiServiceRemoveHandlers.ON_SET_MIXIN,
            removeHandler: events.handlers.onSetMixin(this.onSetMixin.bind(this))
        });
        this.handlerRemovers.push({
            name: PixiServiceRemoveHandlers.ON_SET_DEFAULT_MIXIN,
            removeHandler: events.handlers.onSetDefaultMixin(this.onSetDefaultMixin.bind(this))
        });
        this.handlerRemovers.push({
            name: PixiServiceRemoveHandlers.ON_SET_CANVAS_BACKGROUND,
            removeHandler: events.handlers.onSetCanvasBackground(this.onSetCanvasBackground.bind(this))
        });
        this.handlerRemovers.push({
            name: PixiServiceRemoveHandlers.ON_SET_SCREEN_VISIBLE,
            removeHandler: events.handlers.onSetScreenVisible(this.onSetScreenVisible.bind(this))
        });
        this.handlerRemovers.push({
            name: PixiServiceRemoveHandlers.ON_TIMELINE_PLAY,
            removeHandler: events.handlers.onTimelinePlay(this.onTimelinePlay.bind(this))
        });
        this.handlerRemovers.push({
            name: PixiServiceRemoveHandlers.ON_DEBUG_OPTION_CHANGED,
            removeHandler: events.handlers.onDebugOptionChange(this.onDebugOptionChange.bind(this))
        });
        this.handlerRemovers.push({
            name: PixiServiceRemoveHandlers.ON_SETUP_POSE,
            removeHandler: events.handlers.onSetupPose(this.onSetupPose.bind(this))
        });
        this.handlerRemovers.push({
            name: PixiServiceRemoveHandlers.ON_DESTROY_PIXI_APP,
            removeHandler: events.handlers.onDestroyPixiApp(this.onDestroyPixiApp.bind(this))
        });
        this.handlerRemovers.push({
            name: PixiServiceRemoveHandlers.ON_FILES_LOADED,
            removeHandler: events.handlers.onFilesLoaded(this.onFilesLoaded.bind(this))
        });
    }

    private removeAllEventListeners() {
        this.handlerRemovers.forEach(handlerRemover => {
            handlerRemover.removeHandler();
        });

        this.handlerRemovers = [];
    }

    private onStartAnimation(animationData: AnimationPlayData): void {
        this.spine?.state.clearTrack(animationData.track || 0);
        this.spine?.state.clearListeners();
        this.spine?.skeleton.setToSetupPose();
        if (animationData.animation) {
            this.spine?.state.setAnimation(animationData.track || 0, animationData.animation, animationData.loop);
            this.spine?.state.addListener({
                event: (_, event) => {
                    events.dispatchers.spineEvent(event.data.name);
                }
            })
        }
    }

    private onSkinChange(skin: string): void {
        this.spine?.skeleton.setSkinByName(skin);
    }

    private onSetMixin(mixin: SpineMixin): void {
        this.spine?.stateData.setMix(mixin.fromAnim, mixin.toAnim, mixin.duration);
    }

    private onSetDefaultMixin(mixin: number): void {
        if (this.spine) {
            this.spine.stateData.defaultMix = mixin;
        }
    }

    private onSetCanvasBackground(background: string): void {
        if (this.background) {
            this.background.tint = hexStringToNumber(background);
        }
    }

    private onSetScreenVisible(visible: boolean): void {
        this.screens.forEach(screen => {
            screen.visible = visible;
        });
        if (this.background) {
            this.background.visible = visible;
        }
    }

    private onTimelinePlay(timeline: string[]): void {
        const animations = [...timeline];
        const firstAnimation = animations.shift();

        if (!firstAnimation) return;

        this.spine?.state.clearTrack(0);
        this.spine?.state.clearListeners();
        this.spine?.skeleton.setToSetupPose();
        this.spine?.state.setAnimation(0, firstAnimation, false);
        this.spine?.state.addListener({
            event: (_, event) => {
                events.dispatchers.spineEvent(event.data.name);
            },
            complete: (entry) => {
                const nextAnimation = animations.shift();

                if (nextAnimation) {
                    this.spine?.state.setAnimation(0, nextAnimation, false);
                }
            }
        })
    }

    private onDebugOptionChange(debugOption: DebugOption): void {
        if (this.spine) {
            // @ts-ignore
            this.spine[debugOption.option] = debugOption.value;
        }
    }

    private onSetupPose(): void {
        this.spine?.state.clearTrack(0);
        this.spine?.skeleton.setToSetupPose();
    }

    private onDestroyPixiApp(): void {
        this.spine = null;
        this.background = null;
        this.app?.destroy(true, {
            children: true,
            texture: true,
            baseTexture: true
        });
        this.app = null;
        const canvasWrapper = document.getElementById("canvas-wrapper");
        if (canvasWrapper) {
            canvasWrapper.style.display = "none";
        }
        this.appInitialized = false;

        this.removeAllEventListeners();
    }

    public dispose() {
        this.spine = null;
        this.background = null;
        this.app?.destroy(true, {
            children: true,
            texture: true,
            baseTexture: true
        });
        this.app = null;
        const canvasWrapper = document.getElementById("canvas-wrapper");
        if (canvasWrapper) {
            canvasWrapper.style.display = "none";
        }
        this.appInitialized = false;
    }

    private onFilesLoaded(filesLoadedData: FilesLoadedData): void {

        if (this.appInitialized) return;

        this.drawCallElement = document.getElementById("draw-call-debug") || document.createElement("div");
        const files = filesLoadedData.files;
        const rawJson = files.find((file) => file.type === "json")?.data;
        const rawSkel = files.find((file) => file.type === "skel")?.data as ArrayBuffer;
        const rawAtlas = files.find((file) => file.type === "atlas")?.data;
        const rawSkeletonData =  rawSkel ? new Uint8Array(rawSkel) : JSON.parse(rawJson as string);
        const spineAtlas = new TextureAtlas(rawAtlas as string, function (
            line,
            callback
        ) {
            const imageData = filesLoadedData.files.find((file) => file.path === line)?.data;
            //  @ts-ignore
            callback(BaseTexture.from(imageData));
        });

        const spineAtlasLoader = new AtlasAttachmentLoader(
            spineAtlas
        );
        const spineJsonParser = new (rawSkel ? SkeletonBinary: SkeletonJson)(spineAtlasLoader);
        const spineData = spineJsonParser.readSkeletonData(rawSkeletonData);
        this.spine = new Spine(spineData);

        // @ts-ignore
        this.spine["drawDebug"] = true;

        const wrapper = document.getElementById("canvas-wrapper");

        this.app = new Application({
            backgroundColor: hexStringToNumber(filesLoadedData.canvasBackground) || 0x8701B6,
            antialias: true,
            width: window.innerWidth,
            height: window.innerHeight,
        });
        wrapper?.appendChild(this.app.view);
        // @ts-ignore
        globalThis.__PIXI_APP__ = this.app;

        this.background = new Sprite(Texture.WHITE);

        this.background.width = this.app.screen.width;
        this.background.height = this.app.screen.height;
        this.background.tint = hexStringToNumber(filesLoadedData.canvasBackground);
        this.background.interactive = true;
        this.background
            .on("pointerdown", this.onDragStart.bind(this))
            .on("pointerup", this.onDragEnd.bind(this))
            .on("pointerupoutside", this.onDragEnd.bind(this))
            .on("pointermove", this.onDragMove.bind(this));

        this.app.stage.addChild(this.background);

        // add coordination axises (by graphic)
        this.coordinateAxises.lineStyle(1, 0xff0000);
        this.coordinateAxises.moveTo(-5000, 0);
        this.coordinateAxises.lineTo(5000, 0);
        this.coordinateAxises.lineStyle(1, 0x00ff00);
        this.coordinateAxises.moveTo(0, -5000);
        this.coordinateAxises.lineTo(0, 5000);
        this.coordinateAxises.position.set(this.app.renderer.width / 2, this.app.renderer.height / 2);
        this.app.stage.addChild(this.coordinateAxises);

        const screen = {
            baseWidth: 720,
            baseHeight: 1280,
            maxWidth: 720,
            maxHeight: 1560
        };

        // draw screen base and screen max with thin lines
        const screenBase = new Graphics();
        screenBase.lineStyle(0.5, 0xea9afc);
        screenBase.drawRect(-screen.baseWidth / 2, -screen.baseHeight / 2, screen.baseWidth, screen.baseHeight);
        this.spine.addChild(screenBase);

        const screenMax = new Graphics();
        screenMax.lineStyle(0.5, 0x98f542);
        screenMax.drawRect(-screen.maxWidth / 2, -screen.maxHeight / 2, screen.maxWidth, screen.maxHeight);
        this.spine.addChild(screenMax);

        this.screens.push(screenBase);
        this.screens.push(screenMax);
        this.screens.push(this.coordinateAxises);
        this.onSetScreenVisible(false);


        this.spine.x = this.app.renderer.width / 2;
        this.spine.y = this.app.renderer.height / 2;
        // @ts-ignore
        this.app.stage.addChild(this.spine);
        this.appInitialized = true;
        this.addGlobalListeners();

        events.dispatchers.spineCreated({
            animations: this.spine.spineData.animations.map(animation => animation.name),
            skins: this.spine.spineData.skins.map(skin => skin.name)
        });
        let maxDrawCall = 0;
        let drawCall = 0;
        this.app.ticker.add((t) => {
            maxDrawCall = Math.max(maxDrawCall, drawCall);
            this.drawCallElement.innerHTML = `Draw Call: ${drawCall} - Max: ${maxDrawCall}`;
            drawCall = 0;
        });
        const { renderer } = this.app;
        // @ts-ignore
        const { drawElements } = renderer.gl;
        // @ts-ignore
        renderer.gl.drawElements = (...args) => {
        // @ts-ignore
            drawElements.call(renderer.gl, ...args);
            drawCall++;
        };
    }

    private onScroll(event: WheelEvent) {
        event.preventDefault();

        if (!this.spine) return;

        const oldScale = this.spine.transform.scale;
        let newScale = this.spine.transform.scale.x;

        if (event.deltaY <= 0) {
            newScale = oldScale.x + 0.2;
        } else if (event.deltaY > 0) {
            newScale = oldScale.x - 0.2;
        }

        if (newScale < 0.02) {
            newScale = 0.02;
        };

        this.spine.transform.scale.x = newScale;
        this.spine.transform.scale.y = newScale;
    }

    private addOnScrollListener() {
        const onScroll = this.onScroll.bind(this);
        this.app?.view.addEventListener('wheel', onScroll);

        const removeOnScrollHandler = () => {
            this.app?.view.removeEventListener('wheel', onScroll);
        };

        this.handlerRemovers.push({
            name: PixiServiceRemoveHandlers.ON_SCROLL,
            removeHandler: removeOnScrollHandler
        });
    }

    private onResize() {
        if (this.app && this.app.view) {
            this.app.renderer.resize(window.innerWidth, window.innerHeight);
        }
    }

    private addOnResizeListener() {
        const onResize = this.onResize.bind(this);
        window.addEventListener('resize', onResize);

        const removeOnResizeHandler = () => {
            window.removeEventListener('resize', onResize);
        };

        this.handlerRemovers.push({
            name: PixiServiceRemoveHandlers.ON_RESIZE,
            removeHandler: removeOnResizeHandler
        });
    }

    private addGlobalListeners(): void {
        this.addOnScrollListener();
        this.addOnResizeListener();
    }

    private onDragStart(event: PixiDragEvent) {
        if (!this.spine) return;
        this.initialPointerPosition = Object.assign({}, event.data.global);
        this.initialSpinePosition = {
            x: this.spine.x,
            y: this.spine.y,
        };
        this.spine.alpha = 0.5;
        this.dragging = true;
    }

    private onDragEnd() {
        if (!this.spine) return;
        this.spine.alpha = 1;
        this.dragging = false;
        this.initialPointerPosition = null;
        this.initialSpinePosition = null;
    }

    private onDragMove(event: PixiDragEvent) {
        if (!this.spine || !this.initialPointerPosition || !this.initialSpinePosition) return;
        if (this.dragging) {
            const newPosition = event.data.global;
            const xDelta = newPosition.x - this.initialPointerPosition.x;
            const yDelta = newPosition.y - this.initialPointerPosition.y;

            this.spine.x = this.initialSpinePosition.x + xDelta;
            this.spine.y = this.initialSpinePosition.y + yDelta;
            this.coordinateAxises.position.set(this.spine.x, this.spine.y);
        }
    }

}

export default PixiService;