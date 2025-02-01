import EnergyTrading from './EnergyTrading.json';

const getContractInstance = (provider, contractAddress) => {
  if(!provider){
    return null;
  }
  const signer = provider.getSigner();
  return new ethers.Contract(contractAddress, EnergyTrading.abi, signer);
};

export { getContractInstance };