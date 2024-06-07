import './App.css'
import {NavigateFunction, useNavigate} from "react-router-dom";
import {useData} from "./DataProvider.tsx";
import {path} from "./path.ts";

function App(): JSX.Element {
    const navigate: NavigateFunction = useNavigate()
    const {selectedAccount} = useData() || {}
    const handleClickPoolsList = () => {
        navigate(path.poolsList)
    }
    const handleClickBalanceList = () => {
        navigate(path.balanceList)
    }
    const handleClickStacking = () => {
        navigate(path.stacking)
    }
    const handleClickRouter = () => {
        navigate(path.rooter)
    }
    return (
        <div>
            <h1>Приложение для обмена токенов</h1>

            {selectedAccount != "nonAuthorized" ? (
                <div className="forAuthorization"><p>Для авторизованных</p>
                    <button onClick={handleClickPoolsList}>Информация о существующих пулах в системе</button>
                    <div>---</div>
                    <button onClick={handleClickBalanceList}>Информация о вашем балансе токенов в системе</button>
                    <div>---</div>
                    <button onClick={handleClickStacking}>Информация о стейкинге токенов в системе</button>
                    <div>---</div>
                    <button onClick={handleClickRouter}>Информация о роутере в системе</button>
                </div>

            ) : (
                <div className="forNonAuthorization"><p>Для не авторизованных</p>
                    <button onClick={handleClickPoolsList}>Информация о существующих пулах в системе</button>
                </div>
            )}
        </div>
    )
}

export default App
