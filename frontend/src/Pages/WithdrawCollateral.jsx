import React, { useState } from 'react'
import './style.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import getcollateral from '../utils/getcollateral';
import { ethers } from 'ethers';

const WithdrawCollateral = () => {
  const [amount,setamount]=useState();

  const handleclick=async()=>{
    const collateralcontract=await getcollateral()

    const tx=await collateralcontract.withdrawCollateral(ethers.utils.parseEther(`${amount}`))
    await tx.wait();
  }
  return (
    <div className='widcollateral'>
      enter amount to withdraw
      <TextField id="outlined-basic" label="Outlined" variant="outlined"  className='input_widcollateral' type='number' onChange={(e)=>setamount(e.target.value)}/>
      <Button variant="contained" onClick={handleclick}>withdraw</Button>
    </div>
  )
}

export default WithdrawCollateral