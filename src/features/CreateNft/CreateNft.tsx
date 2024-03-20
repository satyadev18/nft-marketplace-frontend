import React from "react";
import { NftComponentProps } from "../../shared/interface";
import { ethers } from "ethers";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
declare var window: any;
const CreateNft: React.FC<NftComponentProps> = ({ nft, marketplace }) => {
  const [fileImg, setFile] = useState<any>();
  const [name, setName] = useState("");
  const [desc, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [mintDisable, setMintDisable] = useState(false);

  const navigate = useNavigate();
  const sendJSONtoIPFS = async (ImgHash: any) => {
    try {
      const resJSON = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJsonToIPFS",
        data: {
          name: name,
          description: desc,
          image: ImgHash,
        },
        headers: {
          pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
          pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY,
        },
      });

      const tokenURI = `https://gateway.pinata.cloud/ipfs/${resJSON.data.IpfsHash}`;

      mintThenList(tokenURI);
    } catch (error) {
      console.log(error);
    }
  };

  const sendFileToIPFS = async (e: any) => {
    e.preventDefault();
    setMintDisable(true);
    if (fileImg) {
      try {
        const formData = new FormData();
        formData.append("file", fileImg);
        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
            pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY,
            "Content-Type": "multipart/form-data",
          },
        });

        const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        sendJSONtoIPFS(ImgHash);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const mintThenList = async (uri: any) => {
    try {
      await (await nft.mint(uri)).wait();

      const id = await nft.tokenCount();

      await (await nft.setApprovalForAll(marketplace.address, true)).wait();

      const listingPrice = ethers.utils.parseEther(price.toString());
      await (await marketplace.makeItem(nft.address, id, listingPrice)).wait();
      if (window.ethereum && window.ethereum.close) {
        await window.ethereum.close();
      }

  
        toast("Your Nft has been generated successfully");
        setMintDisable(false);
     

      setTimeout(() => {
        navigate("/listings");
      }, 1000);
    } catch (error: any) {
      setMintDisable(false);
      console.log(error, "error");
      if (error?.code === 4001) {
        toast.error(error?.message);
      }
    }
  };
  return (
    <div style={{ padding: "1rem", marginTop: "80px" }}>
      <div style={{ width: "40%", margin: "auto" }}>
        <h4>Create NFT's</h4>
        <div style={{ marginTop: "1rem" }}>
          <label htmlFor="">Name</label>
          <input
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              marginTop: ".5rem",
              outline: "none",
            }}
            type="text"
            placeholder="Name"
          />
        </div>
        <div style={{ marginTop: "1rem" }}>
          <label htmlFor="">Price</label>
          <input
            onChange={(e) => setPrice(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              marginTop: ".5rem",
              outline: "none",
            }}
            type="number"
            placeholder="Price (In ETH)"
          />
        </div>
        <div style={{ marginTop: "1rem" }}>
          <label htmlFor="">Image</label>
          <input
            onChange={(e) => {
              const file = e.target.files && e.target.files[0];
              if (file) {
                setFile(file);
              }
            }}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              marginTop: ".5rem",
              outline: "none",
              border: "1px solid black",
            }}
            type="file"
            placeholder="Price (In ETH.)"
          />
        </div>
        <div style={{ marginTop: "1rem" }}>
          <label htmlFor="">Description</label>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              marginTop: ".5rem",
              outline: "none",
            }}
            placeholder="Description"
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "1.5rem",
          }}
        >
          <button
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              background: mintDisable ? "#E9AA6E" : "#f7931a",
              border: "none",
              color: "#fff",
            }}
            disabled={mintDisable}
            onClick={sendFileToIPFS}
          >
            {mintDisable ? (
              <span>
                Minting NFT <FontAwesomeIcon icon={faSpinner} spin />
              </span>
            ) : (
              "Create"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNft;
