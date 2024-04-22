import React, { useState } from 'react'
import './style.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import getcollateral from '../utils/getcollateral';
import { ethers } from 'ethers';

const AddCollateral = () => {
  const [amount,setamount]=useState()

  const handlesubmit=async()=>{
    const collateralcontract=await getcollateral()

    const tx=await collateralcontract.depositCollateral({value:ethers.utils.parseEther(`${amount}`)});
    await tx.wait();
  }


  return (
    <div className='addCollateral'>
      <div>Enter amount to add to collateral</div>
      <TextField id="outlined-basic" label="Outlined" variant="outlined"  className='input_addcoll' type='number' onChange={(e)=>setamount(e.target.value)}/>
      <Button variant="contained" onClick={handlesubmit}>add collateral</Button>
    </div>
  )
}

export default AddCollateral