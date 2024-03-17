import { ethers } from "ethers";
import React, { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  handleMetamaskRequest,
  handlePolygonRequest,
} from "../../utils/handlePolygonRequest";
declare var window: any;
const NetworkNotFound = () => {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [connectedToPolygon, setConnectedToPolygon] = useState(false);
  const [chainId, setChainId] = useState<number>();
  const [metamaskConnected, setMetamskConnected] = useState(false)
  const navigate = useNavigate();


  const checkMetaMask = async () => {
    if (window.ethereum) {
      try {
        // await window.ethereum.request({ method: "eth_requestAccounts" });
        setIsMetaMaskInstalled(true);
      } catch (error) {
        setIsMetaMaskInstalled(false);
      }
    }
  };

  const getNetworkName = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const network = await provider.getNetwork();

      setChainId(network.chainId);
    } catch (error) {
      console.error("Error fetching network:", error);
    }
  };
  useMemo(() => {
    if (window.ethereum && isMetaMaskInstalled) {
      getNetworkName();
    }
  }, []);

  useEffect(() => {
    checkMetaMask();
  }, []);
  useEffect(() => {
    if (chainId === 11155111) setConnectedToPolygon(true);
    else setConnectedToPolygon(false);
  }, [chainId]);

  const metamaskRequest = async()=>{
   const data = await handleMetamaskRequest()
   if(data){
    setMetamskConnected(true)
   }
   else{
    setMetamskConnected(false)
   }
  }

  return (
   
    <div>
       
      {!isMetaMaskInstalled ? (
        <p className="d-flex justify-content-center align-items-center m-4">
          To Interact With Blockchain Please Install <b> &nbsp; Metamask  &nbsp;</b> Extension From &nbsp;
          <a
            href="https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en-US&utm_source=ext_sidebar"
            target="_blank"
          >
           <span>
             here
            </span>  
          </a>
        </p>
      ) : connectedToPolygon ? (
        <div className="d-flex justify-content-center align-items-center m-4" >

        <button className="btn btn-secondary" onClick={() => navigate("/")}>Go ahead</button>
        </div>
      ) : (
        connectedToPolygon ?
       ( <div className="d-flex justify-content-center align-items-center m-4" >
          
        <button className="btn btn btn-secondary" onClick={metamaskRequest}>Connect Metamsk</button>
        </div>):
        <div className="d-flex justify-content-center align-items-center m-4" >
          
        <p>Switch to Sepolia Testnet and connect your wallet</p>
        </div>
      )}
    </div>
  );
};

export default NetworkNotFound;
