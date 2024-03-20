import React from "react";
const NftItem = ({
  image,
  name,
  price,
  description,
  onBuyClick,
  nft,
  tokenId,
}:any) => {
  return (
    <div style={{ padding: "2rem" }}>
      {/* <h3>LISTED NFT's</h3> */}

      <div
        style={{
          padding: "1rem",
          borderRadius: "8px",
          width: "80%",
          display: "flex",
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        }}
      >
        <img style={{ borderRadius: "8px", width: "20%" }} src={image} alt="" />
        <div style={{ paddingLeft: "1.5rem", margin: "0" }}>
          <h2 style={{ margin: "4px" }}>{name}</h2>{" "}
          {nft && 
          <>
          
          <span className="mx-2"> <span style={{fontWeight:'600'}}>NFT Address</span> {"- " + nft}</span>
          <br />
          <span className="mx-2"><span style={{fontWeight:'600'}}>NFT Token Id</span> {"- " + tokenId}</span>
          </>}
          <p style={{ margin: "4px" }}>{description}</p>
          <h4 style={{ margin: "4px" }}>{price} ETH</h4>
          {onBuyClick && (
            <button
              style={{
                margin: "4px",
                marginTop: "1rem",
                padding: "8px 2rem",                        
                background: "#f7931a",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
              onClick={onBuyClick}
            >
              Buy
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NftItem;
