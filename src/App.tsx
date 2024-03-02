import { ethers } from "ethers";
import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import MarketplaceAddress from "./utils/contractsData/Marketplace-address.json";
import MarketplaceAbi from "./utils/contractsData/Marketplace.json";
import NFTAddress from "./utils/contractsData/NFT-address.json";
import NFTAbi from "./utils/contractsData/NFT.json";
import NoNetworkPage from "./features/NoNetworkPage/NoNetworkPage";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import AllListings from "./features/AllListings/AllListings";
import Purchases from "./features/Purchases/Purchases";
import CreateNft from "./features/CreateNft/CreateNft";
import MyListings from "./features/MyListings/MyListings";
import Navbar from "./features/Navbar/Navbar";
import { ToastContainer } from "react-toastify";
declare var window: any

const App = () => {
  const [account, setAccount] = useState<any>(null);
  const [nftContract, setNftContract] = useState({});
  const [marketPlaceContract, setMarketPlaceContract] = useState({});

  const loadContracts = async (signer:any) => {
    const marketplace = new ethers.Contract(
      MarketplaceAddress.address,
      MarketplaceAbi.abi,
      signer
    );
    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer);

    setNftContract(nft);
    setMarketPlaceContract(marketplace);
    
  };
 
  const connectToWeb3 = async () => {
   const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log(accounts,'accounts')
    setAccount(accounts[0]);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    loadContracts(signer);
  };

  
  

  return (
    <div>
      <BrowserRouter>

      <Navbar account={account} connectToWeb3={connectToWeb3}/>
      <ToastContainer autoClose={3000}/>
        <Routes>
          <Route path="/addnetwork" element={<NoNetworkPage/>} />
          <Route path="/home" element={<NoNetworkPage/>} />
          <Route element={<ProtectedRoutes account={account}/>}>

          <Route path="/market" element={<AllListings marketplace={marketPlaceContract} nft={nftContract}/>} />
          <Route path="/purchase" element={<Purchases marketplace={marketPlaceContract} nft={nftContract} account={account} />} />
          <Route path="/listings" element={<MyListings marketplace={marketPlaceContract} nft={nftContract} account={account} />} />
          <Route path="/create" element={<CreateNft marketplace={marketPlaceContract} nft={nftContract} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
