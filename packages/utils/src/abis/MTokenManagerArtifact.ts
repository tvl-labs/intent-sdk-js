import type { Abi } from "../types";

export const MTokenManagerArtifact = [
  {
    type: "constructor",
    inputs: [
      {
        name: "manager",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "REFUND_AGENT_ROLE",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "authority",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "burnMToken",
    inputs: [
      {
        name: "operator",
        type: "address",
        internalType: "address",
      },
      {
        name: "from",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "mToken",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getAllowance",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
      {
        name: "spender",
        type: "address",
        internalType: "address",
      },
      {
        name: "mToken",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getBalanceOfResource",
    inputs: [
      {
        name: "resourceId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "mToken",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getBalanceOfUser",
    inputs: [
      {
        name: "user",
        type: "address",
        internalType: "address",
      },
      {
        name: "mToken",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getIntentBalance",
    inputs: [
      {
        name: "intentId",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isConsumingScheduledOp",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bytes4",
        internalType: "bytes4",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "mTokenApprove",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
      {
        name: "spender",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "mToken",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "mTokenTransfer",
    inputs: [
      {
        name: "from",
        type: "address",
        internalType: "address",
      },
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "mToken",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "mTokenTransferFrom",
    inputs: [
      {
        name: "spender",
        type: "address",
        internalType: "address",
      },
      {
        name: "from",
        type: "address",
        internalType: "address",
      },
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "mToken",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "mintMToken",
    inputs: [
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "mToken",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "refundUser",
    inputs: [
      {
        name: "user",
        type: "address",
        internalType: "address",
      },
      {
        name: "mToken",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setAuthority",
    inputs: [
      {
        name: "newAuthority",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setIntentBook",
    inputs: [
      {
        name: "_intentBook",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setTokenRegistry",
    inputs: [
      {
        name: "_tokenRegistry",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setWithdrawalHandler",
    inputs: [
      {
        name: "_withdrawalHandler",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "totalSupply",
    inputs: [
      {
        name: "mToken",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "transferMTokensFromIntent",
    inputs: [
      {
        name: "from",
        type: "address",
        internalType: "address",
      },
      {
        name: "fromIntentId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "toIntentId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "mToken",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "spentIntent",
        type: "tuple",
        internalType: "struct Intent",
        components: [
          {
            name: "author",
            type: "address",
            internalType: "address",
          },
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
          {
            name: "nonce",
            type: "uint256",
            internalType: "uint256",
          },
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
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferMTokensFromIntent",
    inputs: [
      {
        name: "fromIntentId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "mToken",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferMTokensToIntent",
    inputs: [
      {
        name: "from",
        type: "address",
        internalType: "address",
      },
      {
        name: "intentId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "mToken",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "signedIntent",
        type: "tuple",
        internalType: "struct SignedIntent",
        components: [
          {
            name: "intent",
            type: "tuple",
            internalType: "struct Intent",
            components: [
              {
                name: "author",
                type: "address",
                internalType: "address",
              },
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
              {
                name: "nonce",
                type: "uint256",
                internalType: "uint256",
              },
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
          {
            name: "signature",
            type: "bytes",
            internalType: "bytes",
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "checkVaultExists",
    inputs: [
      {
        name: "vaultAddress",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "transferMTokensToIntent",
    inputs: [
      {
        name: "from",
        type: "address",
        internalType: "address",
      },
      {
        name: "intentId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "mToken",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "intent",
        type: "tuple",
        internalType: "struct Intent",
        components: [
          {
            name: "author",
            type: "address",
            internalType: "address",
          },
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
          {
            name: "nonce",
            type: "uint256",
            internalType: "uint256",
          },
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
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "withdrawIntentBalance",
    inputs: [
      {
        name: "intentId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "from",
        type: "address",
        internalType: "address",
      },
      {
        name: "mToken",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "withdrawMToken",
    inputs: [
      {
        name: "from",
        type: "address",
        internalType: "address",
      },
      {
        name: "mToken",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "event",
    name: "Approval",
    inputs: [
      {
        name: "mToken",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "owner",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "spender",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
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
    name: "AuthorityUpdated",
    inputs: [
      {
        name: "authority",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MTokenBurned",
    inputs: [
      {
        name: "mToken",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "user",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
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
    name: "MTokenMinted",
    inputs: [
      {
        name: "mToken",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "user",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
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
    name: "MTokenTransferred",
    inputs: [
      {
        name: "mToken",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "fromId",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "toId",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
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
    name: "RefundProcessed",
    inputs: [
      {
        name: "agent",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "user",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "mToken",
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
    name: "AccessManagedInvalidAuthority",
    inputs: [
      {
        name: "authority",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "AccessManagedRequiredDelay",
    inputs: [
      {
        name: "caller",
        type: "address",
        internalType: "address",
      },
      {
        name: "delay",
        type: "uint32",
        internalType: "uint32",
      },
    ],
  },
  {
    type: "error",
    name: "AccessManagedUnauthorized",
    inputs: [
      {
        name: "caller",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "AuthorMismatch",
    inputs: [],
  },
  {
    type: "error",
    name: "CallerNotIntentBook",
    inputs: [],
  },
  {
    type: "error",
    name: "InsufficientAllowance",
    inputs: [],
  },
  {
    type: "error",
    name: "InsufficientIntentBalance",
    inputs: [
      {
        name: "intentBalance",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "InsufficientMTokens",
    inputs: [],
  },
  {
    type: "error",
    name: "IntentIDMismatch",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidSignature",
    inputs: [],
  },
  {
    type: "error",
    name: "MTokenDestroyed",
    inputs: [],
  },
  {
    type: "error",
    name: "MTokenPaused",
    inputs: [],
  },
  {
    type: "error",
    name: "MissmatchedMToken",
    inputs: [],
  },
  {
    type: "error",
    name: "UnauthorizedCaller",
    inputs: [],
  },
  {
    type: "error",
    name: "UnsupportedMToken",
    inputs: [],
  },
] satisfies Abi;
