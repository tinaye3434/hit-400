import { ethers } from 'ethers';
import LedgerABI from '../abis/LedgerABI.json';

export function getContractInstance(
  provider: ethers.BrowserProvider,
  address: string
): ethers.Contract {
  return new ethers.Contract(
    address,
    LedgerABI,
    provider
  ) as ethers.Contract;
}