import {useRef} from "react";
import {useData} from "../DataProvider.tsx";

const Router = () => {
    const {contract, selectedAccount} = useData() || {}
    const gerdaValueRef = useRef<HTMLInputElement>(null);
    const rtkValueRef = useRef<HTMLInputElement>(null)
    const handleChangeGerdaToRTK = async () => {
        if (contract && selectedAccount && gerdaValueRef.current) {
            const result = await contract.methods.changeGerdaToRTK(gerdaValueRef.current.value).send({from: selectedAccount})
            console.log(result)
            alert("Ожидайте, транзакция отправлена")
        }
    }
    const handleChangeRTKtoGerda = async () => {
        if (contract && selectedAccount && rtkValueRef.current) {
            const result = await contract.methods.changeRTKtoGerda(rtkValueRef.current.value).send({from: selectedAccount})
            console.log(result)
            alert("Ожидайте, транзакция отправлена")
        }
    }


    return (<div className={"Router"}>
        <h1>Роутер</h1>
        <h3>Обменять токен Gerda на токен RTK</h3>
        <input className={"form-control"} ref={gerdaValueRef} type="text" placeholder={"Количество GERDA"}/>
        <button onClick={handleChangeGerdaToRTK}>Обменять GERDA</button>
        <h3>Обменять токен RTK на токен Gerda</h3>
        <input className={"form-control"} ref={rtkValueRef} type="text" placeholder={"Количество RTK"}/>
        <button onClick={handleChangeRTKtoGerda}>Обменять RTK</button>
    </div>)
}
export default Router;