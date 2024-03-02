import React, { useEffect, useState } from 'react'
import { NftComponentProps } from '../../shared/interface'
import NftItem from '../../components/NftItem/NftItem';
import { ethers } from 'ethers';
const AllListings: React.FC<NftComponentProps> = ({nft,marketplace}) => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any>([]);

  const loadMarketplaceItems = async () => {
    // Load all unsold items
    console.log("object");
    const itemCount = await marketplace.itemCount();
    console.log("itemcount", itemCount);
    let nftItems = [];
    for (let i = 1; i <= itemCount; i++) {
      console.log("inside loop", i);
      const item = await marketplace.marketItems(i);
      console.log("item", item);
      if (!item.sold) {
        // get uri url from nft contract
        console.log("inside sold");
        const uri = await nft.tokenURI(item.tokenId);
        console.log("uri", uri);
        // use uri to fetch the nft metadata stored on ipfs
        const response = await fetch(uri);
        console.log("resoponse", response);
        const metadata = await response.json();
        console.log("metadata", metadata);
        // get total price of item (item price + fee)
        console.log("item.itemId", item.ItemId);
        const totalPrice = await marketplace.getTotalPrice(item.ItemId);
        // Add item to items array
        console.log("totalPrice", totalPrice);
        nftItems.push({
          totalPrice,
          itemId: item.ItemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
        });
      }
    }
    setLoading(false);
    setItems(nftItems);
  };
  console.log(items, "nft items");
  const buyMarketItem = async (item:any) => {
    await (
      await marketplace.purchaseItems(item.itemId, { value: item.totalPrice })
    ).wait();
    loadMarketplaceItems();
  };

  useEffect(() => {
    loadMarketplaceItems();
  }, []);
  console.log("marketPlace", marketplace);
  if (loading)
    return (
      <main style={{ padding: "1rem 0",marginTop:'150px',marginLeft:'480px' }}>
        <h2>Loading...</h2>
      </main>
    );
  return (
    <div className="flex justify-center all-nft-container">
      <div className="all-nft-container-1">

      
      
      {items.length > 0 ? (
        <div className="px-5 container ">
          <h2 style={{marginTop:'8px',marginLeft:'30px'}}>Listed NFT'S</h2>
          {items.map((item:any, idx:number) => (
            <NftItem
            className='list-items'
              image={item.image}
              description={item.description}
              name={item.name}
              onBuyClick={() => buyMarketItem(item)}
              price={ethers.utils.formatEther(item.totalPrice)}
            />
          ))}
        </div>
      ) : (
        <main style={{ padding: "1rem 0" }}>
          <h2>No listed assets</h2>
        </main>
      )}
      </div>
    </div>
  );
}

export default AllListings