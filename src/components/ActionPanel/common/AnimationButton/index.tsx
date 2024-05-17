import { toast } from "react-toastify";
import { copyToast } from "../../../../config/toastsConfig";
import { copyToClipboard } from "../../../../utils/copyUtil";
import Button from "../../../base/Button";
import "./AnimationButton.css";

interface AnimationButtonProps {
    label: string;
    onClick: () => void,
    short?: boolean;
    selected?: boolean;
}

const AnimationButton: React.FC<AnimationButtonProps> = ({ label, onClick, short, selected }) => {

    const handleCopyClick = () => {
        copyToClipboard(label);
        toast(`Copied to clipboard: ${label}`, copyToast);
    };
    const classNames = `animation-button ${selected ? 'selected' : ''}`;

    return (
        short
        ? <Button className={classNames} label={label} onClick={onClick} />
        : <div className="animation-button-wrapper">
            <Button className={classNames} label={label} onClick={onClick} />
            <span onClick={handleCopyClick} className="animation-copy">
                <img src="./assets/images/copy_small.png" alt="copy animation" />
            </span>
        </div>
    )
};

export default AnimationButton;