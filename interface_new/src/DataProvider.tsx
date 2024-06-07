import {Contract, Web3} from "web3";
import {createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState} from "react";
import abi from "./contractData/abi.json";

type ContextType = {
    web3: Web3 | null;
    setWeb3: Dispatch<SetStateAction<Web3 | null>>;
    selectedAccount: string | null;
    setSelectedAccount: Dispatch<SetStateAction<string | null>>;
    contract: Contract<typeof abi> | null;
    setContract: Dispatch<SetStateAction<Contract<typeof abi> | null>>;
    ownerAddress: string | null;
    setOwnerAddress: Dispatch<SetStateAction<string | null>>;
}

const DataContext = createContext<ContextType | null>(null);

export const DataProvider = ({children}: { children: ReactNode }) => {
    const [web3, setWeb3] = useState<Web3 | null>(null);
    const [contract, setContract] = useState<Contract<typeof abi> | null>(null);
    const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
    const [ownerAddress, setOwnerAddress] = useState<string | null>(null)
    useEffect(() => {
        setOwnerAddress("0x5622a83c012d2e1f19856b2f783f0a960b9e5c93")
    }, []);
    return (
        <DataContext.Provider value={{
            web3,
            setWeb3,
            selectedAccount,
            contract,
            setSelectedAccount,
            setContract,
            ownerAddress,
            setOwnerAddress
        }}>
            {children}
        </DataContext.Provider>
    );
}

export const useData = () => useContext(DataContext);