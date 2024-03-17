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
    if (chainId === 8001) setConnectedToPolygon(true);
    else setConnectedToPolygon(false);
  }, [chainId]);

  return (
   
    <div>
      {!isMetaMaskInstalled ? (
        <p>
          MetaMask is not installed. Download From
          <a
            href="https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en-US&utm_source=ext_sidebar"
            target="_blank"
          >
            here
          </a>
        </p>
      ) : connectedToPolygon ? (
        <button onClick={() => navigate("/")}>Go ahead</button>
      ) : (
        <button onClick={() => handleMetamaskRequest()}>Connect Metamsk</button>
      )}
    </div>
  );
};

export default NetworkNotFound;
