import {
  Adapter as AdapterT,
  WalletAdapterNetwork,
  WalletName,
  WalletReadyState,
} from "@solana/wallet-adapter-base";

import {
  clusterApiUrl,
  Connection,
  ConnectionConfig,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionSignature,
} from "@solana/web3.js";

import { 
  TOKEN_PROGRAM_ID,
  createTransferInstruction
} from "@solana/spl-token";

import "./index.css";

import {
  // BitKeepWalletAdapter,
  // BitpieWalletAdapter,
  // BloctoWalletAdapter,
  CloverWalletAdapter,
  SolletExtensionWalletAdapter,
  Coin98WalletAdapter,
  // CoinhubWalletAdapter,
  GlowWalletAdapter,
  LedgerWalletAdapter,
  MathWalletAdapter,
  PhantomWalletAdapter,
  // SafePalWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletWalletAdapter,
  SolongWalletAdapter,
  // TokenPocketWalletAdapter,
  // TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { HuobiWalletAdapter } from "@solana/wallet-adapter-huobi";
import { WalletSVG } from "./WalletSvg";

const DEFAULT_NETWORK = WalletAdapterNetwork.Devnet;

const WalletAdapters: {
  [key: string]: any;
} = {
  // BitKeep: BitKeepWalletAdapter,
  // Bitpie: BitpieWalletAdapter,
  // Blocto: BloctoWalletAdapter,
  Clover: CloverWalletAdapter,
  Coin98: Coin98WalletAdapter,
  // Coinhub: CoinhubWalletAdapter,
  Glow: GlowWalletAdapter,
  HuobiWallet: HuobiWalletAdapter,
  Ledger: LedgerWalletAdapter,
  MathWallet: MathWalletAdapter,
  Phantom: PhantomWalletAdapter,
  "Sollet (Extention)": SolletExtensionWalletAdapter,
  // SafePal: SafePalWalletAdapter,
  Slope: SlopeWalletAdapter,
  Solflare: SolflareWalletAdapter,
  Sollet: SolletWalletAdapter,
  Solong: SolongWalletAdapter,
  // TokenPocket: TokenPocketWalletAdapter,
  // Torus: TorusWalletAdapter,
};

const DEFAULT_WALLETS: (keyof typeof WalletAdapters)[] = [
  // "BitKeep",
  // "Bitpie",
  // "Blocto",
  "Clover",
  "Coin98",
  // "Coinhub",
  "Glow",
  "HuobiWallet",
  "Ledger",
  "MathWallet",
  "Phantom",
  // "SafePal",
  "Slope",
  "Solflare",
  "Sollet",
  "Sollet (Extention)",
  "Solong",
  // "TokenPocket",
  // "Torus",
];

const DEFAULT_LOCAL_STORAGE_KEY = "SOL_LOCAL_STORAGE_KEY";

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

const SetupModal = () => {
  const Modal = document.createElement("div");
  Modal.setAttribute("id", "wallet-modal-container");
  Modal.setAttribute("class", "sol-modal");
  Modal.innerHTML = `<div class="solana-modal-content"></div>`;

  document.querySelector("body")?.appendChild(Modal);
  return Modal;
};

const Icon = `
<path 
    style="margin-left: 2px"
    stroke="white" 
    fill="white" 
    d="M0.71418 1.626L5.83323 6.26188C5.91574 6.33657 6.0181 6.39652 6.13327 6.43762C6.24844 6.47872 6.37371 6.5 6.50048 6.5C6.62725 6.5 6.75252 6.47872 6.8677 6.43762C6.98287 6.39652 7.08523 6.33657 7.16774 6.26188L12.2868 1.626C12.7753 1.1835 12.3703 0.5 11.6195 0.5H1.37997C0.629216 0.5 0.224175 1.1835 0.71418 1.626Z"
></path>`;

const ViewMoreHtml = `
    <span>More options</span>
    <svg width="13" height="7" style="margin-left: 2px" viewBox="0 0 13 7" xmlns="http://www.w3.org/2000/svg">
      ${Icon}
    </svg>
`;

const ViewLessHtml = `
    <span>Less options</span>
    <svg width="13" height="7" style="margin-left: 2px" viewBox="0 0 13 7" xmlns="http://www.w3.org/2000/svg" class="wallet-adapter-modal-list-more-icon-rotate">
        ${Icon}
    </svg>
`;

const ViewMoreNoInstalled = `
    <span>Already have a wallet? View options</span>
    <svg width="13" height="7" style="margin-left: 2px" viewBox="0 0 13 7" xmlns="http://www.w3.org/2000/svg">
        ${Icon}
    </svg>
`;

const Installed = `
    <span>Hide options</span>
    <svg width="13" height="7" style="margin-left: 2px" viewBox="0 0 13 7" xmlns="http://www.w3.org/2000/svg" class="wallet-adapter-modal-list-more-icon-rotate">
        ${Icon}
    </svg>
`;

const SplitWalletsBasedOnInstalled = (wallets: Wallet[]) => {
  return {
    installed: wallets.filter(
      (w) => w.adapter.readyState === WalletReadyState.Installed
    ),
    otherWallets: wallets.filter(
      (w) => w.adapter.readyState !== WalletReadyState.Installed
    ),
  };
};

const NoWalletInstalled = `
<div class="wallet-adapter-modal-middle">
    ${WalletSVG}
    <button
        type="button"
        id="get-started-button"
        class="wallet-adapter-modal-middle-button"
    >
        Get started
    </button>
</div>`;

const RenderWallets = (
  installed: Wallet[],
  otherWallets: Wallet[],
  onlyInstalled: boolean = false
) => {
  let walletsI;

  if (onlyInstalled) {
    walletsI = installed;
  } else {
    walletsI = [...installed, ...otherWallets];
  }

  const WalletsHtml = walletsI
    .map((wallet) => {
      const isInstalled =
        wallet.adapter.readyState === WalletReadyState.Installed;
      return `
      <li id="${wallet.adapter.name}-id" class="wallet">
        <button class="wallet-list-item">
          <img src="${
            wallet.adapter.icon
          }" style="width: 28px; height: 28px;" />
          <p class="wallet-title">${wallet.adapter.name}</p>
          ${isInstalled ? `<span>Installed</span>` : ""}
        </button>
      </li>
    `;
    })
    .join("\n");

  return WalletsHtml;
};

export default class Adapter {
  private readonly endpoint: string;
  private readonly connection: Connection;
  private wallets: Wallet[];
  private wallet?: Wallet;
  private viewMore?: boolean;

  private readonly onConnect?: (adapter: Wallet) => void;
  private readonly onDisconnect?: () => void;
  private readonly onError?: (e: Error, wallet?: Wallet) => void;
  private readonly onConnecting?: (wallet: Wallet) => void;

  private modal: HTMLDivElement;

  private readonly handleReadyStateChange: (
    adapterC: AdapterT,
    readyState: WalletReadyState
  ) => void;
  private autoConnect: boolean | undefined;
  private localStorageKey: string;
  private localStorageWalletName: string;

  constructor(config: AdapterConfig = {}) {
    const {
      network = DEFAULT_NETWORK,
      wallets = DEFAULT_WALLETS,
      connectionConfig = { commitment: "confirmed" },
      localStorageKey = DEFAULT_LOCAL_STORAGE_KEY,
      onConnect,
      onDisconnect,
      onError,
      autoConnect,
      onConnecting,
    } = config || {};

    this.autoConnect = autoConnect;
    this.localStorageKey = localStorageKey;

    this.onConnect = onConnect;
    this.onConnecting = onConnecting;
    this.onDisconnect = onDisconnect;
    this.onError = onError;
    this.modal = SetupModal();
    this.endpoint = Adapter.createEndpoint(network);
    this.connection = new Connection(this.endpoint, connectionConfig);
    this.wallets = wallets?.map((walletName) => {
      let adapter;
      if (walletName === "Torus") {
        adapter = new WalletAdapters[walletName]();
      } else {
        adapter = new WalletAdapters[walletName]({
          network,
        });
      }

      return {
        readyState: adapter.readyState,
        adapter,
      };
    });
    this.localStorageWalletName =
      localStorage.getItem(this.localStorageKey) || "";

    this.handleReadyStateChange = (
      adapterC: AdapterT,
      readyState: WalletReadyState
    ) => {
      const prevWallets = this.wallets;
      const walletIndex = prevWallets?.findIndex(
        ({ adapter }) => adapter.name === adapterC.name
      );
      if (walletIndex === -1) return prevWallets;

      if (
        adapterC?.name === this.localStorageWalletName &&
        (adapterC.readyState === WalletReadyState.Loadable ||
          adapterC.readyState === WalletReadyState.Installed)
      ) {
        this.handleAutoconnect();
      }

      this.wallets = [
        ...prevWallets.slice(0, walletIndex),
        { ...prevWallets[walletIndex], readyState },
        ...prevWallets.slice(walletIndex + 1),
      ];
    };
    this.setupListeners();
  }

  private AddModalClickHandlers = () => {
    this.wallets.forEach((wallet) => {
      const elm = document.getElementById(`${wallet.adapter.name}-id`);
      if (elm) {
        elm.onclick = (e) => {
          this.selectWallet(wallet.adapter.name).connect();
        };
      }
    });
  };
  private getWalletByName(name: string) {
    return this.wallets.find(({ adapter }) => adapter.name === name);
  }

  public showWalletModal() {
    const { installed, otherWallets } = SplitWalletsBasedOnInstalled(
      this.wallets
    );
    const walletsHtml = RenderWallets(installed, otherWallets, true);

    const GetStartedWallet = () => {
      return installed.length
        ? installed[0]
        : this.wallets.find(
            (wallet: { adapter: { name: WalletName } }) =>
              wallet.adapter.name === "Torus"
          ) ||
            this.wallets.find(
              (wallet: { adapter: { name: WalletName } }) =>
                wallet.adapter.name === "Phantom"
            ) ||
            this.wallets.find(
              (wallet: { readyState: any }) =>
                wallet.readyState === WalletReadyState.Loadable
            ) ||
            otherWallets[0];
    };
    this.modal.onclick = () => this.hideWalletModal();

    this.modal.innerHTML = `
    <div id="sol-modal-content" class="solana-modal-content">
        <button id="sol-close-modal-button" class="wallet-adapter-modal-button-close">
          <svg width="14" height="14">
            <path d="M14 12.461 8.3 6.772l5.234-5.233L12.006 0 6.772 5.234 1.54 0 0 1.539l5.234 5.233L0 12.006l1.539 1.528L6.772 8.3l5.69 5.7L14 12.461z"></path>
          </svg>
        </button>
        <h1 class="wallet-adapter-modal-title">${
          installed?.length
            ? "Connect a wallet on Solana to continue"
            : "You'll need a wallet on Solana to continue"
        }</h1>
        ${installed?.length === 0 ? NoWalletInstalled : ""}
        ${
          otherWallets?.length && installed?.length === 0
            ? `
        <button id="sol-modal-view-more" class="wallet-adapter-modal-list-more" tabindex="0">
            ${ViewMoreNoInstalled}
        </button>`
            : ""
        }
        <ul id="sol-wallet-modal-body" class="wallet-modal-body">${walletsHtml}</ul>
        ${
          otherWallets?.length && installed?.length !== 0
            ? `
        <button id="sol-modal-view-more" class="wallet-adapter-modal-list-more" tabindex="0">
            ${ViewMoreHtml}
        </button>`
            : ""
        }
    </div>`;

    const contentDiv = document.getElementById("sol-modal-content");
    const solModalBody = document.getElementById("sol-wallet-modal-body");
    const viewMoreButton = document.getElementById("sol-modal-view-more");
    const closeModalButton = document.getElementById("sol-close-modal-button");
    const getStartedButton = document.getElementById("get-started-button");

    if (contentDiv) {
      contentDiv.onclick = (e) => e.stopPropagation();
    }

    if (getStartedButton) {
      getStartedButton.onclick = () => {
        this.selectWallet(GetStartedWallet()?.adapter.name).connect();
        this.hideWalletModal();
        this.connect();
      };
    }
    if (closeModalButton) {
      closeModalButton.onclick = () => {
        this.hideWalletModal();
      };
    }
    if (viewMoreButton) {
      viewMoreButton.onclick = (e) => {
        if (this.viewMore) {
          viewMoreButton.innerHTML = installed?.length
            ? ViewMoreHtml
            : ViewMoreNoInstalled;
          if (solModalBody) {
            solModalBody.innerHTML = RenderWallets(
              installed,
              otherWallets,
              true
            );
          }
        } else {
          viewMoreButton.innerHTML = installed?.length
            ? ViewLessHtml
            : Installed;

          if (solModalBody) {
            solModalBody.innerHTML = RenderWallets(installed, otherWallets);
          }
        }
        this.viewMore = !this.viewMore;
        this.AddModalClickHandlers();
      };
    }

    this.AddModalClickHandlers();

    this.modal.style.display = "flex";
    return this;
  }

  public hideWalletModal() {
    this.modal.style.display = "none";
    return this;
  }

  public selectWallet(name: string) {
    this.wallet?.adapter.disconnect();
    this.wallet = this.getWalletByName(name);
    this.hideWalletModal();

    if (this.localStorageKey) {
      localStorage.setItem(this.localStorageKey, name);
    }

    return this;
  }

  private handleAutoconnect() {
    const walletName = localStorage.getItem(this.localStorageKey);
    if (walletName) {
      this.selectWallet(walletName);
    }

    if (
      this.wallet?.adapter.connecting ||
      this.wallet?.adapter.connected ||
      !this.autoConnect ||
      !this.wallet?.adapter ||
      !(
        this.wallet?.adapter.readyState === WalletReadyState.Installed ||
        this.wallet?.adapter.readyState === WalletReadyState.Loadable
      )
    )
      return;

    (async () => {
      try {
        await this.connect();
      } catch (error: any) {
        this.wallet = undefined;
      }
    })();
    return this;
  }

  private setupListeners() {
    this.wallets.map(({ adapter, ...rest }) => {
      // @ts-ignore
      const handleState = (readyState) => {
        this.handleReadyStateChange(adapter, readyState);
      };
      adapter.on("readyStateChange", handleState, adapter);

      if (
        adapter?.name === this.localStorageWalletName &&
        (adapter.readyState === WalletReadyState.Loadable ||
          adapter.readyState === WalletReadyState.Installed)
      ) {
        this.handleAutoconnect();
      }
      return { adapter, ...rest, toCleanUp: handleState };
    });
  }

  public isConnected() {
    return this.wallet?.adapter.connected;
  }

  public getPublicKey() {
    return this.wallet?.adapter.publicKey;
  }

  public disconnect() {
    this.wallet?.adapter.disconnect();
    this.wallet = undefined;
    if (this.onDisconnect) {
      this.onDisconnect();
    }
    localStorage.removeItem(this.localStorageKey);
    return this;
  }

  public connect() {
    this?.wallet?.adapter
      .connect()
      .then(() => {
        if (this.onConnect && this.wallet && this.isConnected()) {
          this.onConnect(this.wallet);
        }
      })
      .catch((e) => {
        this.onError && this.onError(e, this.wallet);
      });
  }

  private removeListeners() {
    this.wallets.forEach(({ adapter, toCleanUp }) => {
      // @ts-ignore
      adapter.off("readyStateChange", toCleanUp, adapter);
    });
  }

  public async SignMessage(message: string) {
    if (this.isConnected()) {
      return await this.wallet?.adapter
        // @ts-ignore
        ?.signMessage(new TextEncoder().encode(message))
        .catch((e: Error) => {
          if (this.onError) {
            this.onError(e, this.wallet);
          }
        });
    } else {
      if (this.onError) {
        this.onError(new Error("Wallet not connected"), this.wallet);
        return false;
      }
    }
  }

  public async requestAirdrop({ onAirdropRequest, onSuccess, onError }: any) {
    if (this.isConnected() && this.wallet && this.wallet?.adapter?.publicKey) {
      let signature: TransactionSignature = "";
      try {
        signature = await this.connection.requestAirdrop(
          this.wallet?.adapter.publicKey,
          LAMPORTS_PER_SOL
        );
        onAirdropRequest && onAirdropRequest(signature);

        await this.connection.confirmTransaction(signature, "processed");
        onSuccess && onSuccess(signature);
      } catch (error: any) {
        onError && onError(error);
      }
    } else {
      onError && onError(new Error("PublicKey not connected"));
    }
  }

  public async sendTransaction(
    reciever: string,
    amount: number,
    { onError, onSuccess, onTransactionSent }: any
  ) {
    if (!this.wallet?.adapter.publicKey) {
      onError && onError("Wallet not connected!");
      return;
    }

    let signature: TransactionSignature = "";
    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: this.wallet.adapter.publicKey,
          toPubkey: new PublicKey(reciever),
          lamports: amount,
        })
      );

      signature = await this.wallet.adapter.sendTransaction(
        transaction,
        this.connection
      );
      onTransactionSent && onTransactionSent(signature);

      await this.connection.confirmTransaction(signature, "processed");
      onSuccess && onSuccess(signature);
      return signature;
    } catch (error: any) {
      onError && onError("Wallet not connected!");
      throw new Error("Wallet not connected!");
    }
  }

  public close() {
    this.removeListeners();
  }

  public getWallet() {
    return this.wallet;
  }

  public async sendTokenTransaction(
    reciever: string,
    amount: number,
    decimals: number,
    MINT_PUBLIC_KEY: string,
    { onError, onSuccess, onTransactionSent }: any
  ) {
    if (!this.wallet?.adapter.publicKey) {
      onError && onError("Wallet not connected!");
      return;
    }

    const mintPublicKey = new PublicKey(
      MINT_PUBLIC_KEY
    );

    const dp = Math.pow(10, decimals);

    let signature: TransactionSignature = "";

    try {
      const toWallet = new PublicKey(reciever)

      let fromTokenAccountData: any = await this.connection.getParsedTokenAccountsByOwner(this.wallet.adapter.publicKey, {
        mint: mintPublicKey
      });
      fromTokenAccountData = fromTokenAccountData.value[0];
      let toTokenAccountsData: any = await this.connection.getParsedTokenAccountsByOwner(toWallet, {
        mint: mintPublicKey
      })
      toTokenAccountsData = toTokenAccountsData.value[0];
    
      const fromTokenAccount = new PublicKey(fromTokenAccountData.pubkey);
      const toTokenAccount = new PublicKey(toTokenAccountsData.pubkey);

      let transaction = new Transaction().add(
        createTransferInstruction(
            fromTokenAccount,
            toTokenAccount,
            this.wallet.adapter.publicKey,
            amount * dp,
            [],
            TOKEN_PROGRAM_ID
        ),
      );

      signature = await this.wallet.adapter.sendTransaction(
        transaction,
        this.connection
      );

      onTransactionSent && onTransactionSent(signature);
      await this.connection.confirmTransaction(signature, "processed");
      onSuccess && onSuccess(signature);
      return signature;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  private static createEndpoint(network: WalletAdapterNetwork) {
    return clusterApiUrl(network);
  }
}
