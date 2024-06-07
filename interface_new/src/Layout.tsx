import {NavigateFunction, useNavigate} from "react-router-dom";
import {path} from "./path.ts";

const Layout = ({children}: { children: React.ReactNode }) => {
    const navigate: NavigateFunction = useNavigate()
    const handleLeave = () => {
        navigate(path.auth)
    }
    const handlePrevPage = () => {
        navigate(-1)
    }
    return (
        <div>
            <button onClick={handleLeave}>Выйти из личного кабинета</button>
            <button onClick={handlePrevPage}>Вернуться к предыдущей странице</button>
            <div>---</div>
            {children}
            <footer>
                <div>---</div>
                <button>Редников Лев Дмитриевич | Чемпионат Профессионалы</button>
            </footer>
        </div>
    );
};
export default Layout