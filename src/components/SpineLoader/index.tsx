import { toast } from "react-toastify";
import { errorToast } from "../../config/toastsConfig";
import { FileEntry } from "../../interfaces";
import SpineProvider from "../../providers/SpineProvider";
import { useSpineViewerStore } from "../../store";
import DropZone from "./DropZone";
import LoadDefaultSpinButton from "./LoadDefaultSpinButton";
import "./SpineLoader.css";
import SpineLoaderInfoText from "./SpineLoaderInfoText";


const SpineLoader = () => {

    const { setLoadedFiles, setFilesLoading } = useSpineViewerStore(state => {
        return {
            setLoadedFiles: state.setLoadedFiles,
            setFilesLoading: state.setFilesLoading,
            setAnimations: state.setAnimations
        }
    });

    const onFilesLoaded = (files: FileEntry[]) => {
        setLoadedFiles(files);
        setFilesLoading(false);
    };

    const onStartLoadingFiles = () => {
        setFilesLoading(true);
    }

    const onLoadError = (message: string) => {
        toast(message, errorToast);
        setFilesLoading(false);
        setLoadedFiles([]);
    }

    const handleDefaultSpineLoad = () => {
        setFilesLoading(true);
        SpineProvider.getDemoSpine().then((fileEntries) => {
            setLoadedFiles(fileEntries as FileEntry[]);
            setFilesLoading(false);
        });
    }

    return (
        <div className="spine-loader">
            <LoadDefaultSpinButton onClick={handleDefaultSpineLoad} />
            <SpineLoaderInfoText text="Chọn tất cả các file (skel/json , atlas, png & jpg) của spine" />
            <DropZone onFilesLoaded={onFilesLoaded} onError={onLoadError} onStartLoadingFiles={onStartLoadingFiles} />
            <div className="tutorial-popup">
                <h2 className="spine-loader-info-text">Hướng Dẫn:</h2>
                <img src="./assets/images/ex.png" alt="tutorial" />
            </div>
        </div>
    )
};

export default SpineLoader;