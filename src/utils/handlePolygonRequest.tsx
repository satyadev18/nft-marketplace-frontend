import { toast } from "react-toastify";

declare var window:any
export const handlePolygonRequest = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x13881",
              chainName: "Polygon Mumbai Testnet",
              nativeCurrency: {
                name: "Matic",
                symbol: "MATIC",
                decimals: 18,
              },
              rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
              blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
            },
          ],
        });
        return;
      } catch (error) {
          console.log(error)
      }
    }
   };

export const handleMetamaskRequest = async() => {
    try{

        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        return true

    
    }
    catch(error:any){
    if(error.code === 4001){
      setTimeout(() => {
        toast('Please Connect Your Metamask to explore platform')
      }, 400);
    }
    return false
    }
    //   setAccount(accounts[0]);
  };