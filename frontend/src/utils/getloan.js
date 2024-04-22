import {ethers} from 'ethers'
import abi from'./loanABI'


const getloan = async() => {

  const provider=new ethers.providers.Web3Provider(window.ethereum)

  const signer=await provider.getSigner();

  const contract= new ethers.Contract('0x4eEaaea91F9b346435af61CEc7514e8AEEC3b5b6',abi,signer);
  
  return contract;
}

export default getloan ;