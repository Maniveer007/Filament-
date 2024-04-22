import {ethers} from 'ethers'
import abi from'./collateralABI'

import React from 'react'

const getcollateral = async() => {

  const provider=new ethers.providers.Web3Provider(window.ethereum)

  const signer=await provider.getSigner();

  const contract= new ethers.Contract('0x59aA1d08c04721eDB559c1780272Ee1a10ad108c',abi,signer);
  
  return contract;
}

export default getcollateral