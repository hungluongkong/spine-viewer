import "./Header.css";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import DrawCall from "./DrawCall";

const Header = () => {

    return (
        <header className="header">
            <div className="header__content-wrapper">
                <Logo />
                <DrawCall />
                <ThemeToggle />
            </div>
        </header>
    );
};

export default Header;