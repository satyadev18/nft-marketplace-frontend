import React, { useEffect, useState } from 'react'
import { NftComponentProps } from '../../shared/interface'
import NftItem from '../../components/NftItem/NftItem';
import { ethers } from 'ethers';

const MyListings: React.FC<NftComponentProps> = ({nft,marketplace,account}) => {
  const [userListedItems, setUserListedItems] = useState<any>([]);
  const [userSoldItems, setUserSoldItems] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  const getListedItems = async () => {
    const itemCount = await marketplace.itemCount();
    let listedItems = [],
      soldItems = [];
    for (let i = 1; i <= itemCount; i++) {
      const item = await marketplace.marketItems(i);

      if (item.seller.toLowerCase() === account) {
        const uri = await nft.tokenURI(item.tokenId);

        const response = await fetch(uri);

        const metadata = await response.json();

        const totalPrice = await marketplace.getTotalPrice(item.ItemId);
        let nftItem = {
          totalPrice,
          itemId: item.ItemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
        };
        listedItems.push(nftItem);

        // if (nftItem.sold) {
        //   soldItems.push(nftItem);
        // }
      }
    }
    // console.log("listedItems,soldItems", listedItems, soldItems);
    // setUserSoldItems(soldItems);
    setUserListedItems(listedItems);
    setLoading(false);
  };

  useEffect(() => {
    getListedItems();
  }, []);
  

  return (
    <div>
      <div className="flex justify-center">
        {userListedItems.length > 0 ? (
          <div className="px-5 py-3 container">
            <h2 style={{ marginTop: "8px", marginLeft: "30px" }}>
              My Listed NFT'S
            </h2>
            {userListedItems.map((item:any, idx:number) => (
              <NftItem
                image={item.image}
                description={item.description}
                name={item.name}
                // onBuyClick={() => buyMarketItem(item)}
                price={ethers.utils.formatEther(item.totalPrice)}
              />
            ))}

            {/* {soldItems.length > 0 && renderSoldItems(soldItems)} */}
          </div>
        ) : (
          <main style={{ padding: "1rem 0", margin: "30px" }}>
            <h2>No listed assets</h2>
          </main>
        )}
      </div>
    </div>
  );
}

export default MyListings