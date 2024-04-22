import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './style.css';
import getloan from '../utils/getloan';
import { ethers } from 'ethers';

{/* <div>Maximum USDC you can take loan,{"asdasd"}</div> */}
const GetLoan = () => {
  const [maxloan,setmaxloan]=useState()
  const [loanamount,setloanamount]=useState()
  const [contract,setcontract]=useState()
  const loaddetails=async()=>{
    const provider=new ethers.providers.Web3Provider(window.ethereum);
    const signer=await provider.getSigner()
    const address=await signer.getAddress()
    const loancontract=await getloan()
    
    const collateral_usdc=await loancontract.totalValueInUSDC(address)
    setcontract(loancontract);
    setmaxloan(Number(collateral_usdc)*0.75);
  }

  const handleclick=async()=>{
      const tx=await contract.borrowLoan(loanamount);
      await tx.wait();
  }
  useEffect(()=>{
    loaddetails()
  },[])
  return (
   <div className='getloan_contaier'>
      <div className='getloan_upper'>Maximum USDC you can take loan:{maxloan}</div>
      <div className='getloan_form_div'>
      <TextField id="outlined-basic" label="Outlined" variant="outlined" onChange={(e)=>setloanamount(e.target.value)} className='input' type='number'/>
      <Button variant="contained" onClick={handleclick}>get loan</Button>

      </div>
   </div>
  )
}

export default GetLoan