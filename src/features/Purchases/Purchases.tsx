import React, { useEffect, useState } from 'react'
import { NftComponentProps } from '../../shared/interface'
import NftItem from '../../components/NftItem/NftItem'
import { ethers } from 'ethers'

const Purchases : React.FC<NftComponentProps> = ({nft,marketplace,account}) => {
  const [loading, setLoading] = useState(true)
  const [purchases, setPurchases] = useState<any>([])
  const loadPurchasedItems = async () => {
    // Fetch purchased items from marketplace by quering Offered events with the buyer set as the user
    const filter =  marketplace.filters.Bought(null,null,null,null,null,account)
    const results = await marketplace.queryFilter(filter)
    //Fetch metadata of each nft and add that to listedItem object.
    const purchases = await Promise.all(results.map(async( i:any) => {
      // fetch arguments from each result
      i = i.args
      // get uri url from nft contract
      const uri = await nft.tokenURI(i.tokenId)
      // use uri to fetch the nft metadata stored on ipfs 
      const response = await fetch(uri)
      const metadata = await response.json()
      // get total price of item (item price + fee)
      const totalPrice = await marketplace.getTotalPrice(i.ItemId)
      // define listed item object
      let purchasedItem = {
        totalPrice,
        tokenId:i.tokenId._hex,
        nft:i.nft,
        price: i.price,
        itemId: i.ItemId,
        name: metadata.name,
        description: metadata.description,
        image: metadata.image
      }
      return purchasedItem
    }))
    setLoading(false)
    setPurchases(purchases)
  }
  useEffect(() => {
    loadPurchasedItems()
  }, [])
  if (loading)
  return (
    <main className="d-flex justify-content-center align-items-center m-4" style={{ padding: "1rem 0",marginTop:'150px',marginLeft:'480px' }}>
      <h2>Loading Data From Blockchain...</h2>
    </main>
  );
  return (
    <div className="flex justify-center">
           
           {purchases.length > 0 ? (
             <div className="px-5 py-3 container">
            <h2 className="px-5 " style={{marginLeft:'20px'}}>Purchased NFT'S</h2>
            
              {purchases.map((item:any) => (
              <>
              
              <NftItem
              image={item.image}
              description={item.description}
              name={item.name}
              nft={item.nft}
              tokenId={item.tokenId}
              
              price={ethers.utils.formatEther(item.totalPrice)}
              />
              </>
          ))}
          
            {/* {soldItems.length > 0 && renderSoldItems(soldItems)} */}
          </div>
        ) : (
          <main style={{ padding: "1rem 0",margin:'30px' }}>
            <h2>No Purchased Assets</h2>
          </main>
        )}
    </div>
  );
}

export default Purchases