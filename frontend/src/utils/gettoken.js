import {ethers} from 'ethers'
import abi from'./tokenabi'


const gettoken = async() => {

  const provider=new ethers.providers.Web3Provider(window.ethereum)

  const signer=await provider.getSigner();

  const contract= new ethers.Contract('0x6dC4480d491c8a0eDcf06D2636F3892fF94cA92b',abi,signer);
  
  return contract;
}

export default gettoken ;