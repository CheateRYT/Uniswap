import {useData} from "../DataProvider.tsx";
import {useEffect, useRef, useState} from "react";

const PoolsList = () => {
    const {contract, selectedAccount, setSelectedAccount} = useData() || {}
    const [poolsList, setPoolsList] = useState<string[]>([])
    const [poolName, setPoolName] = useState<string>("")
    const [poolOwner, setPoolOwner] = useState<string>("")
    const [firstTokenReserve, setFirstTokenReserve] = useState<string>("")
    const [secondTokenReserve, setSecondTokenReserve] = useState<string>("")
    const poolAddressNameRef = useRef<HTMLInputElement>(null);
    const poolAddressOwnerRef = useRef<HTMLInputElement>(null);
    const poolAddressReserveRef = useRef<HTMLInputElement>(null);
    const poolAddressTradeRef = useRef<HTMLSelectElement>(null)
    const valueToTradeRef = useRef<HTMLInputElement>(null)
    const tradeMethodRef = useRef<HTMLSelectElement>(null)
    const poolAddressForLiqRef = useRef<HTMLSelectElement>(null)
    const tokenForLiqRef = useRef<HTMLSelectElement>(null)
    const valueToLiqRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        const fetchPoolsList = async () => {
            if (contract) {
                const result: string[] = await contract.methods.getAllPoolsAddress().call()
                setPoolsList(result)
            }
        }
        fetchPoolsList()
    }, [contract]);

    const handleClickPoolName = () => {
        const fetchPoolName = async () => {
            if (contract && poolAddressNameRef.current) {
                const result: string = await contract.methods.getPoolName(poolAddressNameRef.current.value).call();
                const splitNames = result.split("-");
                const modifiedResult = `1-${splitNames[0]};2-${splitNames[1]}`;
                alert("Ожидайте, транзакция отправлена")
                setPoolName(modifiedResult);
            }
        }
        fetchPoolName()
    }
    const handleClickPoolOwner = () => {
        const fetchPoolOwner = async () => {
            if (contract && poolAddressOwnerRef.current) {
                const result: string = await contract.methods.getPoolOwner(poolAddressOwnerRef.current.value).call()
                alert("Ожидайте, транзакция отправлена")
                setPoolOwner(result)
            }
        }
        fetchPoolOwner()
    }

    const handleClickPoolReserve = () => {
        const fetchPoolReserve = async () => {
            if (contract && poolAddressReserveRef.current) {
                const firstTokenResult: number = await contract.methods.getFirstTokenReserve(poolAddressReserveRef.current.value).call()
                setFirstTokenReserve(firstTokenResult.toString().slice(0, -12))
                const secondTokenResult: number = await contract.methods.getSecondTokenReserve(poolAddressReserveRef.current.value).call()
                setSecondTokenReserve(secondTokenResult.toString().slice(0, -12))
                alert("Ожидайте, транзакция отправлена")
            }
        }
        fetchPoolReserve()
    }


    const handleClickTrade = () => {
        const fetchPoolTrade = async () => {
            if (contract && poolAddressTradeRef.current && selectedAccount && valueToTradeRef.current && setSelectedAccount) {
                if (tradeMethodRef.current) {
                    if (tradeMethodRef.current.value === "firstToSecond") {
                        const result = await contract.methods.tradeFirstToSecond(poolAddressTradeRef.current.value, valueToTradeRef.current.value, selectedAccount).send({from: selectedAccount});
                        const account: string = await selectedAccount;
                        setSelectedAccount("reload");
                        setSelectedAccount(account);
                        console.log(result);
                        alert("Ожидайте, транзакция отправлена")
                    } else if (tradeMethodRef.current.value === "secondToFirst") {
                        const result = await contract.methods.tradeSecondToFirst(poolAddressTradeRef.current.value, valueToTradeRef.current.value, selectedAccount).send({from: selectedAccount});
                        const account: string = selectedAccount;
                        setSelectedAccount("reload");
                        setSelectedAccount(account);
                        console.log(result);
                        alert("Ожидайте, транзакция отправлена")
                    }
                }
            }
        };
        fetchPoolTrade();
    };


    const handleAddLiq = async () => {
        if (selectedAccount && contract && poolAddressForLiqRef.current && valueToLiqRef.current && tokenForLiqRef.current) {
            if (tokenForLiqRef.current.value == "first") {
                const result = await contract.methods.addFirstTokenLiquidity(poolAddressForLiqRef.current.value, valueToLiqRef.current.value).send({from: selectedAccount})

                console.log(result)
            } else if (tokenForLiqRef.current.value == "second") {
                alert("Ожидайте, транзакция отправлена")
                const result = await contract.methods.addSecondTokenLiquidity(poolAddressForLiqRef.current.value, valueToLiqRef.current.value).send({from: selectedAccount})
                console.log(result)
                alert("Ожидайте, транзакция отправлена")
            }

        }
    }

    return (
        <div>
            <h1>Информация о существующих пулах</h1>
            <h4>Список адресов всех пулов в системе : {poolsList && poolsList.join(",")}</h4>
            <h3>Узнать пару токенов которые обмениваются в пуле</h3>
            <input className="form-control" ref={poolAddressNameRef} type="text" placeholder="Введите адрес пула"/>
            <h4>Пара токенов: {poolName}</h4>
            <button onClick={handleClickPoolName}>Узнать пару</button>
            <h3>Узнать адрес владельца пула</h3>
            <input className="form-control" ref={poolAddressOwnerRef} type="text" placeholder="Введите адрес пула"/>
            <h4>Адрес владельца пула: {poolOwner}</h4>
            <button onClick={handleClickPoolOwner}>Узнать владельца</button>
            <h3>Узнать резервы каждого токена в пуле: {poolOwner}</h3>
            <input className="form-control" ref={poolAddressReserveRef} type="text" placeholder="Введите адрес пула"/>
            <h4>Резерв первого токена: {firstTokenReserve}</h4>
            <h4>Резерв второго токена: {secondTokenReserve}</h4>
            <button onClick={handleClickPoolReserve}>Узнать резервы</button>
            <h3>Обменять токены в пуле</h3>
            <select className="form-control" ref={poolAddressTradeRef} name="" id="">
                <option value="none">Выберите пул</option>
                {poolsList.map((pool, index) => <option key={index} value={pool}>{pool}</option>)}
            </select>
            <select className="form-control" ref={tradeMethodRef} name="" id="">
                <option value="none">Выберите какой токен обменять</option>
                <option value="firstToSecond">Первый на второй</option>
                <option value="secondToFirst">Второй на первый</option>
            </select>
            <input className="form-control" ref={valueToTradeRef} type="number" placeholder="Количество"/>
            <button onClick={handleClickTrade}>Обменять</button>

            <h3>Поддержать ликвидность в пуле</h3>
            <select className="form-control" ref={poolAddressForLiqRef} name="" id="">
                <option value="none">Выберите пул</option>
                {poolsList.map((pool, index) => <option key={index} value={pool}>{pool}</option>)}
            </select>
            <select className="form-control" ref={tokenForLiqRef} name="" id="">
                <option value="none">Выберите в какой токен хотите добавить ликвидность</option>
                <option value="first">В первый токен</option>
                <option value="second">Во второй токен</option>
            </select>
            <input className="form-control" ref={valueToLiqRef} type="number" placeholder="Количество токенов"/>
            <button onClick={handleAddLiq}>Добавить ликвидность</button>

        </div>
    )
}
export default PoolsList;