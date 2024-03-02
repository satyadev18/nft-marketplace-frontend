import React from 'react'

interface ComponentProps {
 
  account: any;
}
const Navbar: React.FC<ComponentProps> = ({account}) => {
  return (
    <div>Navbar</div>
  )
}

export default Navbar