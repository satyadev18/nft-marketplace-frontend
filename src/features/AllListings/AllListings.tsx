import React, { useEffect, useState } from 'react'
import { NftComponentProps } from '../../shared/interface'
import NftItem from '../../components/NftItem/NftItem';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const AllListings: React.FC<NftComponentProps> = ({nft,marketplace}) => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any>([]);

  const navigate = useNavigate()

  const loadMarketplaceItems = async () => {
    // Load all unsold items
    const itemCount = await marketplace.itemCount();
    let nftItems = [];
    for (let i = 1; i <= itemCount; i++) {
      const item = await marketplace.marketItems(i);
      if (!item.sold) {
        // get uri url from nft contract
        const uri = await nft.tokenURI(item.tokenId);
        // use uri to fetch the nft metadata stored on ipfs
        const response = await fetch(uri);
        const metadata = await response.json();
        // get total price of item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(item.ItemId);
        // Add item to items array
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
  const buyMarketItem = async (item:any) => {
    await (
      await marketplace.purchaseItems(item.itemId, { value: item.totalPrice })
    ).wait();
    toast('NFT Purchase Successful')
    navigate('/purchase')
  };

  useEffect(() => {
    loadMarketplaceItems();
  }, []);
  if (loading)
  return (
    <main className="d-flex justify-content-center align-items-center m-4" style={{ padding: "1rem 0",marginTop:'150px',marginLeft:'480px' }}>
      <h2>Loading Data From Blockchain...</h2>
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