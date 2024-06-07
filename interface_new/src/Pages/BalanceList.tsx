import {useEffect, useState} from "react";
import {useData} from "../DataProvider.tsx";

export const BalanceList = () => {

    const [gerdaAddress, setGerdaAddress] = useState<string>("")
    const [krendelAddress, setKrendelAddress] = useState<string>("")
    const [rtkAddress, setRtkAddress] = useState<string>("")
    const [profiAddress, setProfiAddress] = useState<string>("")
    const [gerdaBalance, setGerdaBalance] = useState<string>("")
    const [krendelBalance, setKrendelBalance] = useState<string>("")
    const [rtkBalance, setRtkBalance] = useState<string>("")
    const [profiBalance, setProfiBalance] = useState<string>("")

    const {selectedAccount, setSelectedAccount, contract, ownerAddress} = useData() || {}
    useEffect(() => {


        fetchTokenAddresses()

    }, [selectedAccount, contract]);


    const fetchTokenAddresses = async () => {
        if (contract && selectedAccount) {

            // фетчим адреса токенов
            const gerda: number = await contract.methods.Gerda().call()
            setGerdaAddress(gerda.toString());
            const krendel: number = await contract.methods.Krendel().call()
            setKrendelAddress(krendel.toString());
            const rtk: number = await contract.methods.RTK().call()
            setRtkAddress(rtk.toString());
            const profi: number = await contract.methods.Profi().call()
            setProfiAddress(profi.toString());


            //Фетчим количество каждого токена на балансе
            const gerdaBalance: number = await contract.methods.getBalance(gerda).call({from: selectedAccount})
            setGerdaBalance(gerdaBalance.toString().slice(0, -12));
            const krendelBalance: number = await contract.methods.getBalance(krendel).call({from: selectedAccount})
            setKrendelBalance(krendelBalance.toString().slice(0, -12));
            const rtkBalance: number = await contract.methods.getBalance(rtk).call({from: selectedAccount})
            setRtkBalance(rtkBalance.toString().slice(0, -12));
            const profiBalance: number = await contract.methods.getBalance(profi).call({from: selectedAccount})
            setProfiBalance(profiBalance.toString().slice(0, -12));

        }
    }
    const handleGiveStartTokens = () => {
        const fetchGive = async () => {
            if (contract && selectedAccount && ownerAddress && setSelectedAccount) {
                if (selectedAccount === ownerAddress) {
                    const result = await contract.methods.giveStartTokensToUsers(10000).send({from: selectedAccount})

                    console.log(result)
                    alert("Ожидайте, транзакция отправлена")
                    fetchTokenAddresses()
                } else {
                    console.log("selectedAccount - " + selectedAccount + " Owner address - " + ownerAddress)
                    alert("Раздать стартовые токены может только Owner")
                }

            }

        }
        fetchGive()
    }


    return (<div><h1>Информация о балансе ваших токенов в системе</h1>

        <h4>Адрес токена GerdaCoin - {gerdaAddress}</h4>
        <h4>Адрес токена KrendelCoin - {krendelAddress}</h4>
        <h4>Адрес токена RTKCoin - {rtkAddress}</h4>
        <h4>Адрес токена ProfiCoin - {profiAddress}</h4>
        <div>---</div>
        <h3>Ваш баланс токена GerdaCoin - {gerdaBalance}</h3>
        <h3>Ваш баланс токена KrendelCoin - {krendelBalance}</h3>
        <h3>Ваш баланс токена RTKCoin - {rtkBalance}</h3>
        <h3>Ваш баланс токена ProfiCoin - {profiBalance}</h3>


        <button onClick={handleGiveStartTokens}>Раздать стартовые токены пользователям</button>


    </div>)
}
