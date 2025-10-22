import type { Abi } from "../types";

export const ASSET_RESERVES_ABI = [
  {
    type: "constructor",
    inputs: [
      { name: "_hubChainId", type: "uint32", internalType: "uint32" },
      {
        name: "_localMailbox",
        type: "address",
        internalType: "address",
      },
      {
        name: "_remoteReceiver",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "_calcNormalizedAmount",
    inputs: [
      { name: "_asset", type: "address", internalType: "address" },
      {
        name: "_assetNativeAmount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "addRemoteWithdrawerCaller",
    inputs: [{ name: "_withdrawer", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [
      { name: "_user", type: "address", internalType: "address" },
      { name: "_asset", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "delistToken",
    inputs: [{ name: "_token", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "depositERC20",
    inputs: [
      { name: "_token", type: "address", internalType: "address" },
      { name: "_amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "depositERC20WithIntent",
    inputs: [
      { name: "_token", type: "address", internalType: "address" },
      { name: "_amount", type: "uint256", internalType: "uint256" },
      {
        name: "_intent",
        type: "tuple",
        internalType: "struct Intent",
        components: [
          { name: "author", type: "address", internalType: "address" },
          {
            name: "validBefore",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "validAfter",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "nonce", type: "uint256", internalType: "uint256" },
          {
            name: "srcMToken",
            type: "address",
            internalType: "address",
          },
          {
            name: "srcAmount",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "outcome",
            type: "tuple",
            internalType: "struct Outcome",
            components: [
              {
                name: "mTokens",
                type: "address[]",
                internalType: "address[]",
              },
              {
                name: "mAmounts",
                type: "uint256[]",
                internalType: "uint256[]",
              },
              {
                name: "outcomeAssetStructure",
                type: "uint8",
                internalType: "enum OutcomeAssetStructure",
              },
              {
                name: "fillStructure",
                type: "uint8",
                internalType: "enum FillStructure",
              },
            ],
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "depositERC20WithIntentHash",
    inputs: [
      { name: "_token", type: "address", internalType: "address" },
      { name: "_amount", type: "uint256", internalType: "uint256" },
      { name: "_depositor", type: "address", internalType: "address" },
      {
        name: "_permitDeadline",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_permitNonce",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "_intentHash", type: "bytes32", internalType: "bytes32" },
      { name: "signature", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "depositERC20WithSignature",
    inputs: [
      { name: "_token", type: "address", internalType: "address" },
      { name: "_amount", type: "uint256", internalType: "uint256" },
      { name: "_depositor", type: "address", internalType: "address" },
      { name: "_deadline", type: "uint256", internalType: "uint256" },
      {
        name: "_permitNonce",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "signature", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "disableToken",
    inputs: [{ name: "_token", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "enableToken",
    inputs: [{ name: "_token", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "handle",
    inputs: [
      { name: "_origin", type: "uint32", internalType: "uint32" },
      { name: "_sender", type: "bytes32", internalType: "bytes32" },
      { name: "_message", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "isEventRelayed",
    inputs: [{ name: "_eventHash", type: "bytes32", internalType: "bytes32" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "removeRemoteCaller",
    inputs: [{ name: "_withdrawer", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "scheduleTokenRevocation",
    inputs: [{ name: "_token", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setHubProcessor",
    inputs: [
      {
        name: "_newProcessor",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setSpokeMailbox",
    inputs: [{ name: "_newMailbox", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [{ name: "newOwner", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "whitelistAndEnableNewToken",
    inputs: [{ name: "_newToken", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "whitelistNewToken",
    inputs: [{ name: "_newToken", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "withdrawWithPermit",
    inputs: [
      {
        name: "permit",
        type: "tuple",
        internalType: "struct FastWithdrawalPermit",
        components: [
          { name: "nonce", type: "uint256", internalType: "uint256" },
          { name: "spokeChainId", type: "uint32", internalType: "uint32" },
          { name: "token", type: "address", internalType: "address" },
          { name: "amount", type: "uint256", internalType: "uint256" },
          { name: "user", type: "address", internalType: "address" },
          { name: "caller", type: "address", internalType: "address" },
        ],
      },
      { name: "receiver", type: "address", internalType: "address" },
      { name: "userSignature", type: "bytes", internalType: "bytes" },
      { name: "operatorSignature", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "withdrawWithPermitAndWitness",
    inputs: [
      {
        name: "permit",
        type: "tuple",
        internalType: "struct FastWithdrawalPermit",
        components: [
          { name: "nonce", type: "uint256", internalType: "uint256" },
          { name: "spokeChainId", type: "uint32", internalType: "uint32" },
          { name: "token", type: "address", internalType: "address" },
          { name: "amount", type: "uint256", internalType: "uint256" },
          { name: "user", type: "address", internalType: "address" },
          { name: "caller", type: "address", internalType: "address" },
        ],
      },
      { name: "receiver", type: "address", internalType: "address" },
      { name: "witness", type: "bytes32", internalType: "bytes32" },
      { name: "witnessTypeString", type: "string", internalType: "string" },
      { name: "userSignature", type: "bytes", internalType: "bytes" },
      { name: "operatorSignature", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "AssetDelisted",
    inputs: [
      {
        name: "token",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "AssetDeposited",
    inputs: [
      {
        name: "token",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "depositor",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "AssetDisabled",
    inputs: [
      {
        name: "token",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "AssetEnabled",
    inputs: [
      {
        name: "token",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "AssetScheduledForDelisting",
    inputs: [
      {
        name: "token",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "AssetWhitelisted",
    inputs: [
      {
        name: "token",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "AssetWithdrawn",
    inputs: [
      {
        name: "token",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "recipient",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "EventRelayed",
    inputs: [
      {
        name: "eventHash",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RemoteCallerAuthorized",
    inputs: [
      {
        name: "caller",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RemoteCallerRemoved",
    inputs: [
      {
        name: "caller",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RemoteWithdrawalProcessed",
    inputs: [
      {
        name: "token",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "recipient",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "AssetReserves__AssetNotInExpectedStateForDisableOperation",
    inputs: [],
  },
  {
    type: "error",
    name: "AssetReserves__AssetNotInExpectedStateForEnableOperation",
    inputs: [],
  },
  {
    type: "error",
    name: "AssetReserves__AssetNotInExpectedStateForRevokeOperation",
    inputs: [],
  },
  {
    type: "error",
    name: "AssetReserves__AssetNotInExpectedStateForScheduleRevokeOperation",
    inputs: [],
  },
  {
    type: "error",
    name: "AssetReserves__AssetNotInExpectedStateForWhitelistOperation",
    inputs: [],
  },
  {
    type: "error",
    name: "AssetReserves__AssetNotWithdrawable",
    inputs: [{ name: "token", type: "address", internalType: "address" }],
  },
  {
    type: "error",
    name: "AssetReserves__InsufficientValueForFee",
    inputs: [{ name: "fee", type: "uint256", internalType: "uint256" }],
  },
  { type: "error", name: "AssetReserves__InvalidOrigin", inputs: [] },
  {
    type: "error",
    name: "AssetReserves__InvalidTokenAddress",
    inputs: [],
  },
  {
    type: "error",
    name: "AssetReserves__MailboxCannotBeZero",
    inputs: [],
  },
  {
    type: "error",
    name: "AssetReserves__RemoteCallerCannotBeZero",
    inputs: [],
  },
  {
    type: "error",
    name: "AssetReserves__RemoteReceiverCannotBeZero",
    inputs: [],
  },
  {
    type: "error",
    name: "AssetReserves__TokenExceedsAllowablePrecision",
    inputs: [],
  },
  {
    type: "error",
    name: "AssetReserves__UnauthorizedMailbox",
    inputs: [],
  },
  {
    type: "error",
    name: "AssetReserves__UnauthorizedRemoteCaller",
    inputs: [],
  },
  {
    type: "error",
    name: "AssetReserves__UnsupportedAsset",
    inputs: [],
  },
  {
    type: "error",
    name: "AssetReserves__InsufficientDepositAmount",
    inputs: [],
  },
  {
    type: "error",
    name: "AssetReserves__UserBalanceNotEnoughForWithdraw",
    inputs: [
      { name: "amount", type: "uint256", internalType: "uint256" },
      { name: "balance", type: "uint256", internalType: "uint256" },
    ],
  },
  {
    type: "error",
    name: "AssetReserves__WithdrawalAlreadyProcessed",
    inputs: [],
  },
] satisfies Abi;
