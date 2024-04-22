import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import getloan from '../utils/getloan';
import gettoken from '../utils/gettoken';
import { ethers } from 'ethers';


const RepayLoan = () => {
  const [tokenbalance,settokenbalance]=useState(0)
  const [loanamount,setloanamount]=useState(0)
  const [Loancontract,setLoancontract]=useState()
  
  const loaddetails=async()=>{
    const provider=new ethers.providers.Web3Provider(window.ethereum);
    const signer=await provider.getSigner()
    const address=await signer.getAddress()
    const loancontract=await getloan()
    const tokencontract=await gettoken()

    const Tokenbalance=await tokencontract.balanceOf(address);
    settokenbalance(Number(Tokenbalance))

    const Loandetails=await loancontract.loanDetails(address)
    setloanamount(Number(Loandetails[1]))
    console.log(Number(Loandetails[1]));
    setLoancontract(loancontract)
  }
  useEffect(()=>{
    loaddetails()
  },[])

  const handleclick=async()=>{
    const tx=await Loancontract.repayLoan()
    await tx.wait()
  }

  return (
    <div className='repayloan'>
      <div className='repayloan_first'>
        <h2>Your token balance :{tokenbalance}</h2>
        <h2>Your loan amount :{loanamount}</h2>
      </div>

      <div className='repayloan_second'>
      <Button variant="contained" onClick={handleclick}>repayloan</Button>
      </div>

    </div>
  )
}

export default RepayLoan