import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react'
declare var window : any
const NoNetworkPage = () => {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  useEffect(() => {
    const checkMetaMask = async () => {
      const networkId = await window.ethereum.request({
        method: "net_version",
      });
      if (window.ethereum) {
        try {
          // Request account access
          await window.ethereum.request({ method: "eth_requestAccounts" });
          setIsMetaMaskInstalled(true);
        } catch (error) {
          setIsMetaMaskInstalled(false);
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        setIsMetaMaskInstalled(true);
      }
      // Non-dapp browsers...
      else {
        setIsMetaMaskInstalled(false);
      }
    };

    checkMetaMask();
  }, []);

  const handleSepoliaRequest =  async () => {
    if (window.ethereum) {
      try {
        // Request chain change to Ethereum Mainnet
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x11155111' }], // Chain ID for Ethereum Mainnet
        });

        console.log('Switched to Ethereum Mainnet!');
      } catch (error) {
        console.error('Error switching chain:', error);
      }
    } else {
      console.error('MetaMask not detected!');
    }
  };
  const [networkName, setNetworkName] = useState('');

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const getNetworkName = async () => {
      try {
        const network = await provider.getNetwork();
        console.log('network', network)
        setNetworkName(network.name);
      } catch (error) {
        console.error('Error fetching network:', error);
      }
    };

    if (window.ethereum) {
      getNetworkName();
    } else {
      console.error('MetaMask not detected');
    }
  }, []);

console.log('networkName', networkName)
  return (
    <div>
      {isMetaMaskInstalled ? (
        <div>
        <p>Connect With Ethereum Network</p>
        <button onClick={handleSepoliaRequest}>Here</button>
          </div>
      ) : (
        <p>
          MetaMask is not installed. Download From
          <a href="https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en-US&utm_source=ext_sidebar" target="_blank">here</a>{" "}
        </p>
      )}
    </div>
  );
}

export default NoNetworkPage