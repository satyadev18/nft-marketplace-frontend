import React from 'react'
import { toast } from 'react-toastify';

interface ComponentProps {
 connectToWeb3:()=>void;
  account: any;
}
const Navbar: React.FC<ComponentProps> = ({account,connectToWeb3}) => {
  return (
    <div>Navbar
      <button onClick={()=>{
        toast.success('Your NFT Listing Successful')
      }}>show toaster</button>
    </div>
  )
}

export default Navbar