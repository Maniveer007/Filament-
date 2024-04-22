import { useEffect, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import React from "react";
import "./home.css";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import getcollateral from '../utils/getcollateral'
import { ethers } from 'ethers'

function Home() {
  const [collateralAmount,setcollateralAmount] = useState(0)

  const loaddetails=async()=>{
      const provider=new ethers.providers.Web3Provider(window.ethereum);
      const signer=await provider.getSigner()
      const address=await signer.getAddress()
      const colateralcontract=await getcollateral();

      const bigintcollateral=await colateralcontract.getDeposits(address)

      setcollateralAmount(Number(ethers.utils.formatEther(`${bigintcollateral}`)))
      console.log(Number(bigintcollateral));
  }
  useEffect(()=>{
    loaddetails();
  },[])

  return (
    <>
    <div className='upper_home'>
    <Button  variant="contained">{collateralAmount} ETH</Button>

    </div>
    <div className="home_container">
      <div className="home_container_container">
        <div className="home_container_div">
          <Link to="/getloan">
            <Button variant="contained">Get Loan</Button>
          </Link>
          <Link to="/repayloan">
            <Button variant="outlined">Repay Loan</Button>
          </Link>
        </div>
        <div className="home_container_div">
          <Link to="/addcollateral">
            <Button variant="contained">Add Collateral</Button>
          </Link>
          <Link to="/withdrawcollateral">
            <Button variant="outlined">Withdraw Collateral</Button>
          </Link>
        </div>
      </div>
    </div>


    <div  className='bottom_button_home'>

    <Link to="/liquidate"> <Button  variant="contained">Liquidate</Button></Link>
   
    </div>

    </>
  )
}

export default Home
