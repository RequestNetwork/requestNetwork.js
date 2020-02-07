/* tslint:disable */
/* eslint-disable spellcheck/spell-checker */
/* Generated by ts-generator ver. 0.0.8 */

import { Contract, ContractTransaction, EventFilter, Signer } from 'ethers';
import { Listener, Provider } from 'ethers/providers';
import { Arrayish, BigNumber, BigNumberish, Interface } from 'ethers/utils';
import { TransactionOverrides, TypedEventDescription, TypedFunctionDescription } from '.';

interface MultisigContractInterface extends Interface {
  functions: {
    owners: TypedFunctionDescription<{ encode([]: [BigNumberish]): string }>;

    removeOwner: TypedFunctionDescription<{
      encode([owner]: [string]): string;
    }>;

    revokeConfirmation: TypedFunctionDescription<{
      encode([transactionId]: [BigNumberish]): string;
    }>;

    isOwner: TypedFunctionDescription<{ encode([]: [string]): string }>;

    confirmations: TypedFunctionDescription<{
      encode([,]: [BigNumberish, string]): string;
    }>;

    calcMaxWithdraw: TypedFunctionDescription<{ encode([]: []): string }>;

    getTransactionCount: TypedFunctionDescription<{
      encode([pending, executed]: [boolean, boolean]): string;
    }>;

    dailyLimit: TypedFunctionDescription<{ encode([]: []): string }>;

    lastDay: TypedFunctionDescription<{ encode([]: []): string }>;

    addOwner: TypedFunctionDescription<{ encode([owner]: [string]): string }>;

    isConfirmed: TypedFunctionDescription<{
      encode([transactionId]: [BigNumberish]): string;
    }>;

    getConfirmationCount: TypedFunctionDescription<{
      encode([transactionId]: [BigNumberish]): string;
    }>;

    transactions: TypedFunctionDescription<{
      encode([]: [BigNumberish]): string;
    }>;

    getOwners: TypedFunctionDescription<{ encode([]: []): string }>;

    getTransactionIds: TypedFunctionDescription<{
      encode([from, to, pending, executed]: [BigNumberish, BigNumberish, boolean, boolean]): string;
    }>;

    getConfirmations: TypedFunctionDescription<{
      encode([transactionId]: [BigNumberish]): string;
    }>;

    transactionCount: TypedFunctionDescription<{ encode([]: []): string }>;

    changeRequirement: TypedFunctionDescription<{
      encode([_required]: [BigNumberish]): string;
    }>;

    confirmTransaction: TypedFunctionDescription<{
      encode([transactionId]: [BigNumberish]): string;
    }>;

    submitTransaction: TypedFunctionDescription<{
      encode([destination, value, data]: [string, BigNumberish, Arrayish]): string;
    }>;

    changeDailyLimit: TypedFunctionDescription<{
      encode([_dailyLimit]: [BigNumberish]): string;
    }>;

    MAX_OWNER_COUNT: TypedFunctionDescription<{ encode([]: []): string }>;

    required: TypedFunctionDescription<{ encode([]: []): string }>;

    replaceOwner: TypedFunctionDescription<{
      encode([owner, newOwner]: [string, string]): string;
    }>;

    executeTransaction: TypedFunctionDescription<{
      encode([transactionId]: [BigNumberish]): string;
    }>;

    spentToday: TypedFunctionDescription<{ encode([]: []): string }>;
  };

  events: {
    DailyLimitChange: TypedEventDescription<{
      encodeTopics([dailyLimit]: [null]): string[];
    }>;

    Confirmation: TypedEventDescription<{
      encodeTopics([sender, transactionId]: [string | null, BigNumberish | null]): string[];
    }>;

    Revocation: TypedEventDescription<{
      encodeTopics([sender, transactionId]: [string | null, BigNumberish | null]): string[];
    }>;

    Submission: TypedEventDescription<{
      encodeTopics([transactionId]: [BigNumberish | null]): string[];
    }>;

    Execution: TypedEventDescription<{
      encodeTopics([transactionId]: [BigNumberish | null]): string[];
    }>;

    ExecutionFailure: TypedEventDescription<{
      encodeTopics([transactionId]: [BigNumberish | null]): string[];
    }>;

    Deposit: TypedEventDescription<{
      encodeTopics([sender, value]: [string | null, null]): string[];
    }>;

    OwnerAddition: TypedEventDescription<{
      encodeTopics([owner]: [string | null]): string[];
    }>;

    OwnerRemoval: TypedEventDescription<{
      encodeTopics([owner]: [string | null]): string[];
    }>;

    RequirementChange: TypedEventDescription<{
      encodeTopics([required]: [null]): string[];
    }>;
  };
}

export abstract class MultisigContract extends Contract {
  abstract connect(signerOrProvider: Signer | Provider | string): MultisigContract;
  abstract attach(addressOrName: string): MultisigContract;
  abstract deployed(): Promise<MultisigContract>;

  abstract on(event: EventFilter | string, listener: Listener): MultisigContract;
  abstract once(event: EventFilter | string, listener: Listener): MultisigContract;
  abstract addListener(eventName: EventFilter | string, listener: Listener): MultisigContract;
  abstract removeAllListeners(eventName: EventFilter | string): MultisigContract;
  abstract removeListener(eventName: any, listener: Listener): MultisigContract;

  abstract interface: MultisigContractInterface;

  abstract functions: {
    owners(arg0: BigNumberish): Promise<string>;

    removeOwner(owner: string, overrides?: TransactionOverrides): Promise<ContractTransaction>;

    revokeConfirmation(
      transactionId: BigNumberish,
      overrides?: TransactionOverrides,
    ): Promise<ContractTransaction>;

    isOwner(arg0: string): Promise<boolean>;

    confirmations(arg0: BigNumberish, arg1: string): Promise<boolean>;

    calcMaxWithdraw(): Promise<BigNumber>;

    getTransactionCount(pending: boolean, executed: boolean): Promise<BigNumber>;

    dailyLimit(): Promise<BigNumber>;

    lastDay(): Promise<BigNumber>;

    addOwner(owner: string, overrides?: TransactionOverrides): Promise<ContractTransaction>;

    isConfirmed(transactionId: BigNumberish): Promise<boolean>;

    getConfirmationCount(transactionId: BigNumberish): Promise<BigNumber>;

    transactions(
      arg0: BigNumberish,
    ): Promise<{
      destination: string;
      value: BigNumber;
      data: string;
      executed: boolean;
      0: string;
      1: BigNumber;
      2: string;
      3: boolean;
    }>;

    getOwners(): Promise<string[]>;

    getTransactionIds(
      from: BigNumberish,
      to: BigNumberish,
      pending: boolean,
      executed: boolean,
    ): Promise<BigNumber[]>;

    getConfirmations(transactionId: BigNumberish): Promise<string[]>;

    transactionCount(): Promise<BigNumber>;

    changeRequirement(
      _required: BigNumberish,
      overrides?: TransactionOverrides,
    ): Promise<ContractTransaction>;

    confirmTransaction(
      transactionId: BigNumberish,
      overrides?: TransactionOverrides,
    ): Promise<ContractTransaction>;

    submitTransaction(
      destination: string,
      value: BigNumberish,
      data: Arrayish,
      overrides?: TransactionOverrides,
    ): Promise<ContractTransaction>;

    changeDailyLimit(
      _dailyLimit: BigNumberish,
      overrides?: TransactionOverrides,
    ): Promise<ContractTransaction>;

    MAX_OWNER_COUNT(): Promise<BigNumber>;

    required(): Promise<BigNumber>;

    replaceOwner(
      owner: string,
      newOwner: string,
      overrides?: TransactionOverrides,
    ): Promise<ContractTransaction>;

    executeTransaction(
      transactionId: BigNumberish,
      overrides?: TransactionOverrides,
    ): Promise<ContractTransaction>;

    spentToday(): Promise<BigNumber>;
  };

  abstract owners(arg0: BigNumberish): Promise<string>;

  abstract removeOwner(
    owner: string,
    overrides?: TransactionOverrides,
  ): Promise<ContractTransaction>;

  abstract revokeConfirmation(
    transactionId: BigNumberish,
    overrides?: TransactionOverrides,
  ): Promise<ContractTransaction>;

  abstract isOwner(arg0: string): Promise<boolean>;

  abstract confirmations(arg0: BigNumberish, arg1: string): Promise<boolean>;

  abstract calcMaxWithdraw(): Promise<BigNumber>;

  abstract getTransactionCount(pending: boolean, executed: boolean): Promise<BigNumber>;

  abstract dailyLimit(): Promise<BigNumber>;

  abstract lastDay(): Promise<BigNumber>;

  abstract addOwner(owner: string, overrides?: TransactionOverrides): Promise<ContractTransaction>;

  abstract isConfirmed(transactionId: BigNumberish): Promise<boolean>;

  abstract getConfirmationCount(transactionId: BigNumberish): Promise<BigNumber>;

  abstract transactions(
    arg0: BigNumberish,
  ): Promise<{
    destination: string;
    value: BigNumber;
    data: string;
    executed: boolean;
    0: string;
    1: BigNumber;
    2: string;
    3: boolean;
  }>;

  abstract getOwners(): Promise<string[]>;

  abstract getTransactionIds(
    from: BigNumberish,
    to: BigNumberish,
    pending: boolean,
    executed: boolean,
  ): Promise<BigNumber[]>;

  abstract getConfirmations(transactionId: BigNumberish): Promise<string[]>;

  abstract transactionCount(): Promise<BigNumber>;

  abstract changeRequirement(
    _required: BigNumberish,
    overrides?: TransactionOverrides,
  ): Promise<ContractTransaction>;

  abstract confirmTransaction(
    transactionId: BigNumberish,
    overrides?: TransactionOverrides,
  ): Promise<ContractTransaction>;

  abstract submitTransaction(
    destination: string,
    value: BigNumberish,
    data: Arrayish,
    overrides?: TransactionOverrides,
  ): Promise<ContractTransaction>;

  abstract changeDailyLimit(
    _dailyLimit: BigNumberish,
    overrides?: TransactionOverrides,
  ): Promise<ContractTransaction>;

  abstract MAX_OWNER_COUNT(): Promise<BigNumber>;

  abstract required(): Promise<BigNumber>;

  abstract replaceOwner(
    owner: string,
    newOwner: string,
    overrides?: TransactionOverrides,
  ): Promise<ContractTransaction>;

  abstract executeTransaction(
    transactionId: BigNumberish,
    overrides?: TransactionOverrides,
  ): Promise<ContractTransaction>;

  abstract spentToday(): Promise<BigNumber>;

  abstract filters: {
    DailyLimitChange(dailyLimit: null): EventFilter;

    Confirmation(sender: string | null, transactionId: BigNumberish | null): EventFilter;

    Revocation(sender: string | null, transactionId: BigNumberish | null): EventFilter;

    Submission(transactionId: BigNumberish | null): EventFilter;

    Execution(transactionId: BigNumberish | null): EventFilter;

    ExecutionFailure(transactionId: BigNumberish | null): EventFilter;

    Deposit(sender: string | null, value: null): EventFilter;

    OwnerAddition(owner: string | null): EventFilter;

    OwnerRemoval(owner: string | null): EventFilter;

    RequirementChange(required: null): EventFilter;
  };

  abstract estimate: {
    owners(arg0: BigNumberish): Promise<BigNumber>;

    removeOwner(owner: string): Promise<BigNumber>;

    revokeConfirmation(transactionId: BigNumberish): Promise<BigNumber>;

    isOwner(arg0: string): Promise<BigNumber>;

    confirmations(arg0: BigNumberish, arg1: string): Promise<BigNumber>;

    calcMaxWithdraw(): Promise<BigNumber>;

    getTransactionCount(pending: boolean, executed: boolean): Promise<BigNumber>;

    dailyLimit(): Promise<BigNumber>;

    lastDay(): Promise<BigNumber>;

    addOwner(owner: string): Promise<BigNumber>;

    isConfirmed(transactionId: BigNumberish): Promise<BigNumber>;

    getConfirmationCount(transactionId: BigNumberish): Promise<BigNumber>;

    transactions(arg0: BigNumberish): Promise<BigNumber>;

    getOwners(): Promise<BigNumber>;

    getTransactionIds(
      from: BigNumberish,
      to: BigNumberish,
      pending: boolean,
      executed: boolean,
    ): Promise<BigNumber>;

    getConfirmations(transactionId: BigNumberish): Promise<BigNumber>;

    transactionCount(): Promise<BigNumber>;

    changeRequirement(_required: BigNumberish): Promise<BigNumber>;

    confirmTransaction(transactionId: BigNumberish): Promise<BigNumber>;

    submitTransaction(destination: string, value: BigNumberish, data: Arrayish): Promise<BigNumber>;

    changeDailyLimit(_dailyLimit: BigNumberish): Promise<BigNumber>;

    MAX_OWNER_COUNT(): Promise<BigNumber>;

    required(): Promise<BigNumber>;

    replaceOwner(owner: string, newOwner: string): Promise<BigNumber>;

    executeTransaction(transactionId: BigNumberish): Promise<BigNumber>;

    spentToday(): Promise<BigNumber>;
  };
}
