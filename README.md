# Solana Wallet Adapter for VanillaJS

The official Solana wallet adapter works only with React/Next other javascript frameworks. We created this library to be able to use it with Vanilla Javascript.

## Requirements

* Node and NPM
* Yarn

## Installation and Usage

Install dependencies:

```
yarn install
```
Build the js library:

```
npm run build:dev
```
**OR**

```
npm run build:prod
```
## Documentation
```ts
export  enum  WalletAdapterNetwork  {
	Mainnet  =  'mainnet-beta',
	Testnet  =  'testnet',
	Devnet  =  'devnet',
}

// Adapter Config Props
interface  AdapterConfig  {
	network?:  WalletAdapterNetwork;  // default: "devnet", to connect to other networks "testnet" or "mainnet-beta
	wallets?:  string[];
	connectionConfig?:  ConnectionConfig;
	autoConnect?:  boolean;  // will reconnecto the last connected wallet when the page or component is loaded.
	onConnect?:  (wallet:  Wallet)  =>  void;  // call back when a wallet connets
	onConnecting?:  (wallet:  Wallet)  =>  void;  // call back when a wallet is connecting
	onDisconnect?:  ()  =>  void;  // call back when a wallet is disconnected\
	onError?:  (e:  Error,  wallet?:  Wallet)  =>  void;  // callback when a wallet errors out
}

```
### Solana Adapter class

```ts
class  Adapter  {
	showWalletModal():  this;
	hideWalletModal():  this;
	selectWallet(name:  string):  this;
	isConnected():  boolean  |  undefined;
	getPublicKey():  PublicKey  |  null  |  undefined;
	disconnect():  this;
	connect():  void;
	SignMessage(message:  string):  Promise<any>;
	requestAirdrop({onAirdropRequest,onSuccess,onError}:any): Promise<void>;
	sendTransaction(reciever:string,amount:number,{onError,onSuccess, onTransactionSent}:  any): Promise<void>;
	close():  void;
	getWallet():  Wallet  |  undefined;
}
```

### Send a SOL Transaction

```ts
const wallet  =  new SolanaAdapter();

wallet.selectWallet('Phantom');
wallet.sendTransaction('public-key-to-send-to',  1,  {
	onTransactionSent:  (signature)  =>  {},
	onSuccess:  (signature)  =>  {},
	onError:  (error)  =>  {}
});
```

### Send a Token Transaction

```ts
const wallet = new SolanaAdapter();
wallet.sendTokenTransaction("to-address", 1, 6, "token-mint-address", {
	onTransactionSent:  (signature)  =>  {},
	onSuccess:  (signature)  =>  {},
	onError:  (error)  =>  {}
});
```


### To load specfic wallets

TLDR: By default all wallets are loaded which is also why the bundle is size

```ts
const  wallet  =  new  SolanaAdapter({
	wallets: ["BitKeep",  "Bitpie",  "Phantom"]
});
```
#### Possible wallet options
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
];
```
## LICENSE

MIT