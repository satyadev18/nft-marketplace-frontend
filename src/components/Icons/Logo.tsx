import React from 'react'
import logo from '../../assets/Designer.png'
interface Properties {
    height:string;
    width:string;
}

const Logo = ({height,width}:Properties) => <img style = {{borderRadius:'20px', height,width}}src={logo} />

export default Logo