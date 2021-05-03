import { ContractArtifact } from '../../ContractArtifact';

import { abi as ABI_0_1_0 } from './0.1.0.json';
import type { ERC20FeeProxy } from '../../../types/ERC20FeeProxy';

export const erc20FeeProxyArtifact = new ContractArtifact<ERC20FeeProxy>(
  {
    '0.1.0': {
      abi: ABI_0_1_0,
      deployment: {
        private: {
          address: '0x75c35C980C0d37ef46DF04d31A140b65503c0eEd',
          creationBlockNumber: 0,
        },
        mainnet: {
          address: '0x370DE27fdb7D1Ff1e1BaA7D11c5820a324Cf623C',
          creationBlockNumber: 10774767,
        },
        matic: {
          address: 'TODO',
          creationBlockNumber: 0,
        },
        rinkeby: {
          address: '0xda46309973bFfDdD5a10cE12c44d2EE266f45A44',
          creationBlockNumber: 7118080,
        },
      },
    },
  },
  '0.1.0',
);
