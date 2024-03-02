import React from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

interface ComponentProps {
 connectToWeb3:()=>void;
  account: any;
}
const Navbar: React.FC<ComponentProps> = (prop) => {
  return (
    <div>
    <div
      style={{
        background: "#4d4d4d",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px",
      }}
    >
      <div style={{ height: "70px", display: "flex", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginLeft: "14px",
          }}
        >
          <img
            style={{ width: "40px", height: "40px" }}
            src="https://seeklogo.com/images/B/bitcoin-logo-594596D72F-seeklogo.com.png"
            alt=""
          />
          <h3 style={{ marginLeft: "8px", color: "#fff" }}>
            NFT MARKETPLACE{" "}
          </h3>
        </div>
        <div>
          <ul style={{ display: "flex", listStyle: "none" }}>
          <Link style={{textDecoration:'none'}} to='/market'>  <li
              className="list-items"
              style={{
                marginLeft: "1.5REM",
                color: "#fff",
                cursor: "pointer",
              }}
            >
             

              Home
            </li>
              </Link>

              <Link  style={{textDecoration:'none'}} to='/create'>
            <li
              className="list-items"
              style={{
                marginLeft: "1.5REM",
                color: "#fff",
                cursor: "pointer",
              }}
              >
              Create
            </li>
              </Link>
              <Link  style={{textDecoration:'none'}} to='/listings'>
            <li
              className="list-items"
              style={{
                marginLeft: "1.5REM",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Listed Items
            </li>
            </Link>
            <Link  style={{textDecoration:'none'}} to='/purchase'>
            <li
              className="list-items"
              style={{
                marginLeft: "1.5REM",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Purchased Items
            </li>
            </Link>
          </ul>
        </div>
      </div>
      <div style={{ marginRight: "1rem" }}>
        {prop.account ? (
          <h6 style={{ color: "#fff" }}>
            Wallet address : {prop.account}
          </h6>
        ) : (
          <button
            style={{
              padding: "8px 2rem",
              background: "#f7931a",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
            onClick={() => {
              prop.connectToWeb3();
            }}
          >
            Connect to wallet
          </button>
        )}
      </div>
    </div>
  </div>
  )
}

export default Navbar