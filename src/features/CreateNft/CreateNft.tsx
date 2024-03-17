import React from "react";
import { NftComponentProps } from "../../shared/interface";
import { ethers } from "ethers";
import axios from "axios";
import { useState } from "react";
const CreateNft: React.FC<NftComponentProps> = ({ nft, marketplace }) => {
  const [fileImg, setFile] = useState<any>();
  const [name, setName] = useState("");
  const [desc, setDescription] = useState("");
  const [price, setPrice] = useState("");

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
      console.log("Token URI", tokenURI);

      mintThenList(tokenURI);
    } catch (error) {
      console.log("JSON to IPFS: ");
      console.log(error);
    }
  };

  const sendFileToIPFS = async (e: any) => {
    e.preventDefault();
    console.log("123");
    console.log(e);

    if (fileImg) {
      try {
        console.log("1234");
        const formData = new FormData();
        formData.append("file", fileImg);
        console.log(formData);
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
        console.log(ImgHash);
        sendJSONtoIPFS(ImgHash);
      } catch (error) {
        console.log("File to IPFS: ");
        console.log(error);
      }
    }
  };

  const mintThenList = async (uri: any) => {
    await (await nft.mint(uri)).wait();

    const id = await nft.tokenCount();
    console.log("id", id);

    await (await nft.setApprovalForAll(marketplace.address, true)).wait();

    const listingPrice = ethers.utils.parseEther(price.toString());
    console.log("listingPrice", listingPrice);
    await (await marketplace.makeItem(nft.address, id, listingPrice)).wait();
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
            type="text"
            placeholder="Price (In MATIC)"
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
            placeholder="Price (In MATIC.)"
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
              background: " #f7931a",
              border: "none",
              color: "#fff",
            }}
            onClick={sendFileToIPFS}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNft;
