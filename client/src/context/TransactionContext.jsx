import React, { useEffect, useState, createContext } from "react";

import { ethers } from "ethers";


import { contractABI, contractAddress } from '../utils/constants'

export const TransactionContext = createContext();

const { ethereum } = window;

const createEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);
// console.log({
//     provider,
//     signer,
//     transactionsContract})
  return transactionsContract;
};

export const TransactionsProvider = ({ children }) => {
  const [formData, setFormData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));
  const [transactions, setTransactions] = useState([]);

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  

  const checkIfWalletIsConnect = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_accounts" });
console.log(accounts)
      if (accounts.length) {
        setCurrentAccount(accounts[0]);

        
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };


  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_requestAccounts", });

      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  const sendTransaction = async () => {
    try {
        if (!ethereum) return alert("Please install MetaMask.");
        const {addressTo, amount, keyword, message} = formData;
const transactionContract = createEthereumContract();
const parsedAmount = ethers.utils.parseEther(amount);
await ethereum.request({
    method:'eth_sendTransaction',
    params:[{
        from:currentAccount,
        to:addressTo,
        gas:'0x5208',//21000Gwei,
        value:parsedAmount._hex
    }]
});
const transactionHash = await transactionContract.addToBlockchain(addressTo,parsedAmount,message,keyword);
setIsLoading(true)
console.log(`loading - ${transactionHash.hash}`);
await transactionHash.wait();
setIsLoading(false)
console.log(`success - ${transactionHash.hash}`);

const transactionCount = await transactionContract.getTransactionCount();
setTransactionCount(transactionCount.toNumber())
    } catch (error) {
        console.log(error);

        throw new Error("No ethereum object");
    }
  }
  

  useEffect(() => {
    checkIfWalletIsConnect();
    //checkIfTransactionsExists();
  }, [transactionCount]);

  return (
    <TransactionContext.Provider
      value={{
        transactionCount,
        connectWallet,
        transactions,
        currentAccount,
        isLoading,
        sendTransaction,
        handleChange,
        formData,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};