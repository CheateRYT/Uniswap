import {useEffect, useRef, useState} from "react";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {useData} from "../DataProvider.tsx";
import {Web3} from "web3";
import abi from "../contractData/abi.json";
import {byteCode} from "../contractData/byteCode.ts";

declare global {
    interface Window {
        ethereum?: import('ethers').Eip1193Provider;
    }
}

const Auth = () => {
    const [accounts, setAccounts] = useState<string[]>([]);
    const selectAccountRef = useRef<HTMLSelectElement>(null);
    const {setSelectedAccount, setContract, contract, ownerAddress} = useData() || {};
    const navigate: NavigateFunction = useNavigate()
    const handleSignInButton = () => {
        if (selectAccountRef.current && selectAccountRef.current.value != "none") {
            setSelectedAccount && setSelectedAccount(selectAccountRef.current.value);
            if (contract) {
                navigate("/app");
            } else {
                alert("Запустите систему")
            }
        } else {
            alert("Выберите аккаунт!!!")
        }
    }
    useEffect(() => {

        if (typeof window.ethereum === "undefined") {
            alert("Установите метамаск");
        } else {
            console.log("MetaMask имеется")
            window.ethereum.request({method: "eth_requestAccounts"}).then((result: string[]) => setAccounts(result))
        }
    }, []);


    const handleStartSystem = () => {
        if (setContract && ownerAddress) {
            alert("Ожидайте, система запускается!!!")
            const deployContract = async () => {
                try {
                    const web3 = new Web3("http://127.0.0.1:8545");
                    const contract = new web3.eth.Contract(abi);
                    const deployTransaction = contract.deploy({
                        data: byteCode,
                    });

                    const gasPrice = await web3.eth.getGasPrice();
                    const options = {
                        from: ownerAddress,
                        gas: "9013568",
                        gasPrice: gasPrice.toString(),
                    };
                    const deployedContract = await deployTransaction.send(options);
                    console.log("Contract deployed at address:", deployedContract.options.address);
                    setContract(deployedContract);
                    console.log(deployedContract)
                    alert("Система запущена")
                    console.log("Адрес владельца контракта - " + ownerAddress)
                    return deployedContract;
                } catch (error) {
                    console.error("Error deploying contract:", error);
                    throw error;
                }
            }
            deployContract();
        }
    }

    return (
        <div>
            <h1>Авторизация с помощью MetaMask</h1>
            <select className="form-control" ref={selectAccountRef} id="">
                <option value="none">Выберите аккаунт</option>
                <option value="nonAuthorized">Зайти в систему как неавторизованный пользователь</option>
                {accounts.map((account, index) => <option key={index} value={account}>{account}</option>)}
            </select>

            <div>---</div>
            <button onClick={handleSignInButton}>Войти</button>
            <button onClick={handleStartSystem}>Запустить систему</button>
        </div>
    );
};

export default Auth;