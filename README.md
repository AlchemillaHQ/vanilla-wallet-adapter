
This Library loads the default class into the window for us

```ts

export enum WalletAdapterNetwork {
    Mainnet = 'mainnet-beta', 
    Testnet = 'testnet',
    Devnet = 'devnet',
}

// Adapter Config Props
interface AdapterConfig {
  network?: WalletAdapterNetwork; // default: "devnet", to connect to other networks "testnet" or "mainnet-beta 
  wallets?: string[];
  connectionConfig?: ConnectionConfig;
  autoConnect?: boolean; // will reconnecto the last connected wallet when the page or component is loaded.
  onConnect?: (wallet: Wallet) => void; // call back when a wallet connets
  onConnecting?: (wallet: Wallet) => void; // call back when a wallet is connecting
  onDisconnect?: () => void; // call back when a wallet is disconnected
  onError?: (e: Error, wallet?: Wallet) => void; // callback when a wallet errors out
}
```

### Solana Adapter class

```ts
class Adapter {
    showWalletModal(): this;
    hideWalletModal(): this;
    selectWallet(name: string): this;
    isConnected(): boolean | undefined;
    getPublicKey(): PublicKey | null | undefined;
    disconnect(): this;
    connect(): void;
    SignMessage(message: string): Promise<any>; // Sign a message not supported by all wallets
    requestAirdrop({ onAirdropRequest, onSuccess, onError }: any): Promise<void>; // requests a airdrop
    sendTransaction(reciever: string, amount: number, { onError, onSuccess, onTransactionSent }: any): Promise<void>; // send a transaction
    close(): void;
    getWallet(): Wallet | undefined;
}
```



### Send a Transaction
```ts
const wallet = new SolanaAdapter();
wallet.selectWallet('Phantom');

wallet.sendTransaction('public-key-to-send-to', 1, {
    onTransactionSent: (signature) => { ...when a transaction is sent... },
    onSuccess: (signature) => { ...do what you want with signature...},
    onError: (error) => { ...when an error occurs...}
}) // amount is in lamport
```

`Production Javascript file` build check under `dist/`
`Usage example:` To see production example refer to `dist/index.html`

### To load specfic wallets
TLDR: By default all wallets are loaded which is also why the bundle is size
```ts
const wallet = new SolanaAdapter({
    wallets: ["BitKeep", "Bitpie", "Phantom"]
});

```

#### rest wallet options && default value:

```ts
[
"BitKeep",
"Bitpie",
"Blocto",
"Clover",
"Coin98",
"Coinhub",
"Glow",
"HuobiWallet",
"Ledger",
"MathWallet",
"Phantom",
"SafePal",
"Slope",
"Solflare",
"Sollet",
"Solong",
"TokenPocket",
"Torus",
];```
