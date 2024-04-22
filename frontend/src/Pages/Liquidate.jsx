import React, { useState } from 'react'
import './style.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import getloan from '../utils/getloan';

const Liquidate = () => {
  const [address,setaddress]=useState()

  const handleclick=async()=>{
    const loancontract =await getloan()

    const tx=await loancontract.liquidate(address);
    await tx.wait()
  }
  return (
    <div className='liquidate'>
      <TextField id="outlined-basic" label="Outlined" variant="outlined"  className='input_liquidate' onChange={(e)=>setaddress(e.target.value)}/>
      <Button variant="contained" onClick={handleclick}>Liquidate</Button>
    </div>
  )
}

export default Liquidate;