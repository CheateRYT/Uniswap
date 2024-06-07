import {useEffect, useRef, useState} from "react";
import {useData} from "../DataProvider.tsx";

const Stacking = () => {
    const {contract, selectedAccount} = useData() || {}
    const [profiBalance, setProfiBalance] = useState<string | null>(null)
    const [profiMyBalance, setProfiMyBalance] = useState<string | null>(null)
    useEffect(() => {
        fetchProfiAll()
        fetchProfiMy()
    }, [contract]);
    const fetchProfiAll = async () => {
        if (contract) {
            const result: number = await contract.methods.getValueAllStackingLP().call()
            setProfiBalance(result.toString().slice(0, -12))
        }
    }
    const fetchProfiMy = async () => {
        if (contract) {
            const result: number = await contract.methods.getMyStackingBalance().call()
            setProfiMyBalance(result.toString().slice(0, -12))
        }
    }
    const putLPValue = useRef<HTMLInputElement>(null);
    const handlePutLP = async () => {

        if (contract && putLPValue.current && selectedAccount) {
            const result = await contract.methods.putLPProfi(putLPValue.current.value).send({from: selectedAccount});

            alert("Ожидайте, транзакция отправлена")
            console.log(result)
        }
        fetchProfiAll()
        fetchProfiMy()
    }
    const handleReturnMyStack = async () => {
        if (contract && selectedAccount) {
            const result = await contract.methods.returnMyStack().send({from: selectedAccount})
            console.log(result)

            alert("Ожидайте, транзакция отправлена")
        }
        fetchProfiAll()
        fetchProfiMy()
    }
    const handleTakeReward = async () => {
        if (contract && selectedAccount) {
            const result = await contract.methods.takeReward().send({from: selectedAccount})
            console.log(result)

            alert("Ожидайте, транзакция отправлена")
        }
        fetchProfiAll()
        fetchProfiMy()
    }
    return (<div className={"stacking"}>
        <h1>Информация о стейкинге в системе</h1>
        <h4>Количество всех LP токенов PROFI на стейкинге - {profiBalance}</h4>
        <h4>Количество ваших LP токенов PROFI на стейкинге - {profiMyBalance}</h4>
        <h3>Положить LP токены на стейкинг</h3>
        <input ref={putLPValue} className={"form-control"} type="text" placeholder={"Количество токенов"}/>
        <button onClick={handlePutLP}>Положить</button>
        <h3>Забрать свои LP токены со стейкинга</h3>
        <button onClick={handleReturnMyStack}>Забрать</button>
        <h3>Забрать награду со стейкинга</h3>
        <button onClick={handleTakeReward}>Забрать награду</button>
    </div>)
}

export default Stacking;
