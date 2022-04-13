import { Adapter as AdapterT, WalletAdapterNetwork, WalletReadyState } from "@solana/wallet-adapter-base";
import { ConnectionConfig, PublicKey } from "@solana/web3.js";
import "./index.css";
interface AdapterConfig {
    network?: WalletAdapterNetwork;
    wallets?: string[];
    connectionConfig?: ConnectionConfig;
    autoConnect?: boolean;
    onConnect?: (wallet: Wallet) => void;
    onConnecting?: (wallet: Wallet) => void;
    onDisconnect?: () => void;
    localStorageKey?: string;
    onError?: (e: Error, wallet?: Wallet) => void;
}
interface Wallet {
    readyState: WalletReadyState;
    adapter: AdapterT;
    toCleanUp?: any;
}
export default class Adapter {
    private readonly endpoint;
    private readonly connection;
    private wallets;
    private wallet?;
    private viewMore?;
    private readonly onConnect?;
    private readonly onDisconnect?;
    private readonly onError?;
    private readonly onConnecting?;
    private modal;
    private readonly handleReadyStateChange;
    private autoConnect;
    private localStorageKey;
    private localStorageWalletName;
    constructor(config?: AdapterConfig);
    private AddModalClickHandlers;
    private getWalletByName;
    showWalletModal(): this;
    hideWalletModal(): this;
    selectWallet(name: string): this;
    private handleAutoconnect;
    private setupListeners;
    isConnected(): boolean | undefined;
    getPublicKey(): PublicKey | null | undefined;
    disconnect(): this;
    connect(): void;
    private removeListeners;
    SignMessage(message: string): Promise<any>;
    requestAirdrop({ onAirdropRequest, onSuccess, onError }: any): Promise<void>;
    sendTransaction(reciever: string, amount: number, { onError, onSuccess, onTransactionSent }: any): Promise<string | undefined>;
    close(): void;
    getWallet(): Wallet | undefined;
    private static createEndpoint;
}
export {};
