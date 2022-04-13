"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const wallet_adapter_base_1 = require("@solana/wallet-adapter-base");
const web3_js_1 = require("@solana/web3.js");
require("./index.css");
const wallet_adapter_wallets_1 = require("@solana/wallet-adapter-wallets");
const wallet_adapter_huobi_1 = require("@solana/wallet-adapter-huobi");
const WalletSvg_1 = require("./WalletSvg");
const DEFAULT_NETWORK = wallet_adapter_base_1.WalletAdapterNetwork.Devnet;
console.log(DEFAULT_NETWORK, wallet_adapter_base_1.WalletAdapterNetwork);
const WalletAdapters = {
    BitKeep: wallet_adapter_wallets_1.BitKeepWalletAdapter,
    Bitpie: wallet_adapter_wallets_1.BitpieWalletAdapter,
    Blocto: wallet_adapter_wallets_1.BloctoWalletAdapter,
    Clover: wallet_adapter_wallets_1.CloverWalletAdapter,
    Coin98: wallet_adapter_wallets_1.Coin98WalletAdapter,
    Coinhub: wallet_adapter_wallets_1.CoinhubWalletAdapter,
    Glow: wallet_adapter_wallets_1.GlowWalletAdapter,
    HuobiWallet: wallet_adapter_huobi_1.HuobiWalletAdapter,
    Ledger: wallet_adapter_wallets_1.LedgerWalletAdapter,
    MathWallet: wallet_adapter_wallets_1.MathWalletAdapter,
    Phantom: wallet_adapter_wallets_1.PhantomWalletAdapter,
    SafePal: wallet_adapter_wallets_1.SafePalWalletAdapter,
    Slope: wallet_adapter_wallets_1.SlopeWalletAdapter,
    Solflare: wallet_adapter_wallets_1.SolflareWalletAdapter,
    Sollet: wallet_adapter_wallets_1.SolletWalletAdapter,
    SolletExtension: wallet_adapter_wallets_1.SolletExtensionWalletAdapter,
    Solong: wallet_adapter_wallets_1.SolongWalletAdapter,
    TokenPocket: wallet_adapter_wallets_1.TokenPocketWalletAdapter,
    Torus: wallet_adapter_wallets_1.TorusWalletAdapter,
};
const DEFAULT_WALLETS = [
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
    "SolletExtension",
    "Solong",
    "TokenPocket",
    "Torus",
];
const DEFAULT_LOCAL_STORAGE_KEY = "SOL_LOCAL_STORAGE_KEY";
const SetupModal = () => {
    var _a;
    const Modal = document.createElement("div");
    Modal.setAttribute("id", "wallet-modal-container");
    Modal.setAttribute("class", "modal");
    Modal.innerHTML = `<div class="modal-content"></div>`;
    (_a = document.querySelector("body")) === null || _a === void 0 ? void 0 : _a.appendChild(Modal);
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
const SplitWalletsBasedOnInstalled = (wallets) => {
    return {
        installed: wallets.filter((w) => w.adapter.readyState === wallet_adapter_base_1.WalletReadyState.Installed),
        otherWallets: wallets.filter((w) => w.adapter.readyState !== wallet_adapter_base_1.WalletReadyState.Installed),
    };
};
const NoWalletInstalled = `
<div class="wallet-adapter-modal-middle">
    ${WalletSvg_1.WalletSVG}
    <button
        type="button"
        id="get-started-button"
        class="wallet-adapter-modal-middle-button"
    >
        Get started
    </button>
</div>`;
const RenderWallets = (installed, otherWallets, onlyInstalled = false) => {
    let walletsI;
    if (onlyInstalled) {
        walletsI = installed;
    }
    else {
        walletsI = [...installed, ...otherWallets];
    }
    const WalletsHtml = walletsI
        .map((wallet) => {
        const isInstalled = wallet.adapter.readyState === wallet_adapter_base_1.WalletReadyState.Installed;
        return `
      <li id="${wallet.adapter.name}-id" class="wallet">
        <button class="wallet-list-item">
          <img src="${wallet.adapter.icon}" style="width: 28px; height: 28px;" />
          <p class="wallet-title">${wallet.adapter.name}</p>
          ${isInstalled ? `<span>Installed</span>` : ""}
        </button>
      </li>
    `;
    })
        .join("\n");
    return WalletsHtml;
};
class Adapter {
    constructor(config = {}) {
        this.AddModalClickHandlers = () => {
            this.wallets.forEach((wallet) => {
                const elm = document.getElementById(`${wallet.adapter.name}-id`);
                if (elm) {
                    elm.onclick = (e) => {
                        this.selectWallet(wallet.adapter.name).connect();
                    };
                }
            });
        };
        const { network = DEFAULT_NETWORK, wallets = DEFAULT_WALLETS, connectionConfig = { commitment: "confirmed" }, localStorageKey = DEFAULT_LOCAL_STORAGE_KEY, onConnect, onDisconnect, onError, autoConnect, onConnecting, } = config || {};
        this.autoConnect = autoConnect;
        this.localStorageKey = localStorageKey;
        this.onConnect = onConnect;
        this.onConnecting = onConnecting;
        this.onDisconnect = onDisconnect;
        this.onError = onError;
        this.modal = SetupModal();
        this.endpoint = Adapter.createEndpoint(network);
        this.connection = new web3_js_1.Connection(this.endpoint, connectionConfig);
        this.wallets = wallets === null || wallets === void 0 ? void 0 : wallets.map((walletName) => {
            let adapter;
            if (walletName === "Torus") {
                adapter = new WalletAdapters[walletName]();
            }
            else {
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
        this.handleReadyStateChange = (adapterC, readyState) => {
            const prevWallets = this.wallets;
            const walletIndex = prevWallets === null || prevWallets === void 0 ? void 0 : prevWallets.findIndex(({ adapter }) => adapter.name === adapterC.name);
            if (walletIndex === -1)
                return prevWallets;
            if (((adapterC === null || adapterC === void 0 ? void 0 : adapterC.name) === this.localStorageWalletName &&
                adapterC.readyState === wallet_adapter_base_1.WalletReadyState.Loadable) ||
                adapterC.readyState === wallet_adapter_base_1.WalletReadyState.Installed) {
                this.handleAutoconnect();
            }
            this.wallets = [
                ...prevWallets.slice(0, walletIndex),
                Object.assign(Object.assign({}, prevWallets[walletIndex]), { readyState }),
                ...prevWallets.slice(walletIndex + 1),
            ];
        };
        this.setupListeners();
    }
    getWalletByName(name) {
        return this.wallets.find(({ adapter }) => adapter.name === name);
    }
    showWalletModal() {
        const { installed, otherWallets } = SplitWalletsBasedOnInstalled(this.wallets);
        const walletsHtml = RenderWallets(installed, otherWallets, true);
        const GetStartedWallet = () => {
            return installed.length
                ? installed[0]
                : this.wallets.find((wallet) => wallet.adapter.name === "Torus") ||
                    this.wallets.find((wallet) => wallet.adapter.name === "Phantom") ||
                    this.wallets.find((wallet) => wallet.readyState === wallet_adapter_base_1.WalletReadyState.Loadable) ||
                    otherWallets[0];
        };
        this.modal.onclick = () => this.hideWalletModal();
        this.modal.innerHTML = `
    <div id="sol-modal-content" class="modal-content">
        <button id="sol-close-modal-button" class="wallet-adapter-modal-button-close">
          <svg width="14" height="14">
            <path d="M14 12.461 8.3 6.772l5.234-5.233L12.006 0 6.772 5.234 1.54 0 0 1.539l5.234 5.233L0 12.006l1.539 1.528L6.772 8.3l5.69 5.7L14 12.461z"></path>
          </svg>
        </button>
        <h1 class="wallet-adapter-modal-title">${(installed === null || installed === void 0 ? void 0 : installed.length)
            ? "Connect a wallet on Solana to continue"
            : "You'll need a wallet on Solana to continue"}</h1>
        ${(installed === null || installed === void 0 ? void 0 : installed.length) === 0 ? NoWalletInstalled : ""}
        ${(otherWallets === null || otherWallets === void 0 ? void 0 : otherWallets.length) && (installed === null || installed === void 0 ? void 0 : installed.length) === 0
            ? `
        <button id="sol-modal-view-more" class="wallet-adapter-modal-list-more" tabindex="0">
            ${ViewMoreNoInstalled}
        </button>`
            : ""}
        <ul id="sol-wallet-modal-body" class="wallet-modal-body">${walletsHtml}</ul>
        ${(otherWallets === null || otherWallets === void 0 ? void 0 : otherWallets.length) && (installed === null || installed === void 0 ? void 0 : installed.length) !== 0
            ? `
        <button id="sol-modal-view-more" class="wallet-adapter-modal-list-more" tabindex="0">
            ${ViewMoreHtml}
        </button>`
            : ""}
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
                var _a;
                this.selectWallet((_a = GetStartedWallet()) === null || _a === void 0 ? void 0 : _a.adapter.name).connect();
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
                    viewMoreButton.innerHTML = (installed === null || installed === void 0 ? void 0 : installed.length)
                        ? ViewMoreHtml
                        : ViewMoreNoInstalled;
                    if (solModalBody) {
                        solModalBody.innerHTML = RenderWallets(installed, otherWallets, true);
                    }
                }
                else {
                    viewMoreButton.innerHTML = (installed === null || installed === void 0 ? void 0 : installed.length)
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
    hideWalletModal() {
        this.modal.style.display = "none";
        return this;
    }
    selectWallet(name) {
        var _a;
        (_a = this.wallet) === null || _a === void 0 ? void 0 : _a.adapter.disconnect();
        this.wallet = this.getWalletByName(name);
        this.hideWalletModal();
        if (this.localStorageKey) {
            localStorage.setItem(this.localStorageKey, name);
        }
        return this;
    }
    handleAutoconnect() {
        var _a, _b, _c, _d, _e;
        const walletName = localStorage.getItem(this.localStorageKey);
        if (walletName) {
            this.selectWallet(walletName);
        }
        if (((_a = this.wallet) === null || _a === void 0 ? void 0 : _a.adapter.connecting) ||
            ((_b = this.wallet) === null || _b === void 0 ? void 0 : _b.adapter.connected) ||
            !this.autoConnect ||
            !((_c = this.wallet) === null || _c === void 0 ? void 0 : _c.adapter) ||
            !(((_d = this.wallet) === null || _d === void 0 ? void 0 : _d.adapter.readyState) === wallet_adapter_base_1.WalletReadyState.Installed ||
                ((_e = this.wallet) === null || _e === void 0 ? void 0 : _e.adapter.readyState) === wallet_adapter_base_1.WalletReadyState.Loadable))
            return;
        (() => __awaiter(this, void 0, void 0, function* () {
            var _f;
            try {
                yield ((_f = this.wallet) === null || _f === void 0 ? void 0 : _f.adapter.connect());
            }
            catch (error) {
                this.wallet = undefined;
            }
        }))();
        return this;
    }
    setupListeners() {
        this.wallets.map((_a) => {
            var { adapter } = _a, rest = __rest(_a, ["adapter"]);
            // @ts-ignore
            const handleState = (readyState) => {
                this.handleReadyStateChange(adapter, readyState);
            };
            adapter.on("readyStateChange", handleState, adapter);
            return Object.assign(Object.assign({ adapter }, rest), { toCleanUp: handleState });
        });
    }
    isConnected() {
        var _a;
        return (_a = this.wallet) === null || _a === void 0 ? void 0 : _a.adapter.connected;
    }
    getPublicKey() {
        var _a;
        return (_a = this.wallet) === null || _a === void 0 ? void 0 : _a.adapter.publicKey;
    }
    disconnect() {
        var _a;
        (_a = this.wallet) === null || _a === void 0 ? void 0 : _a.adapter.disconnect();
        this.wallet = undefined;
        if (this.onDisconnect) {
            this.onDisconnect();
        }
        localStorage.removeItem(this.localStorageKey);
        return this;
    }
    connect() {
        var _a;
        (_a = this === null || this === void 0 ? void 0 : this.wallet) === null || _a === void 0 ? void 0 : _a.adapter.connect().then(() => {
            if (this.onConnect && this.wallet && this.isConnected()) {
                this.onConnect(this.wallet);
            }
        }).catch((e) => {
            this.onError && this.onError(e, this.wallet);
        });
    }
    removeListeners() {
        this.wallets.forEach(({ adapter, toCleanUp }) => {
            // @ts-ignore
            adapter.off("readyStateChange", toCleanUp, adapter);
        });
    }
    SignMessage(message) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isConnected()) {
                return yield ((_b = (_a = this.wallet) === null || _a === void 0 ? void 0 : _a.adapter) === null || _b === void 0 ? void 0 : _b.signMessage(new TextEncoder().encode(message)).catch((e) => {
                    if (this.onError) {
                        this.onError(e, this.wallet);
                    }
                }));
            }
            else {
                if (this.onError) {
                    this.onError(new Error("Wallet not connected"), this.wallet);
                    return false;
                }
            }
        });
    }
    requestAirdrop({ onAirdropRequest, onSuccess, onError }) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isConnected() && this.wallet && ((_b = (_a = this.wallet) === null || _a === void 0 ? void 0 : _a.adapter) === null || _b === void 0 ? void 0 : _b.publicKey)) {
                let signature = "";
                try {
                    signature = yield this.connection.requestAirdrop((_c = this.wallet) === null || _c === void 0 ? void 0 : _c.adapter.publicKey, web3_js_1.LAMPORTS_PER_SOL);
                    onAirdropRequest && onAirdropRequest(signature);
                    yield this.connection.confirmTransaction(signature, "processed");
                    onSuccess && onSuccess(signature);
                }
                catch (error) {
                    onError && onError(error);
                }
            }
            else {
                onError && onError(new Error("PublicKey not connected"));
            }
        });
    }
    sendTransaction(reciever, amount, { onError, onSuccess, onTransactionSent }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!((_a = this.wallet) === null || _a === void 0 ? void 0 : _a.adapter.publicKey)) {
                onError && onError("Wallet not connected!");
                return;
            }
            let signature = "";
            try {
                const transaction = new web3_js_1.Transaction().add(web3_js_1.SystemProgram.transfer({
                    fromPubkey: this.wallet.adapter.publicKey,
                    toPubkey: new web3_js_1.PublicKey(reciever),
                    lamports: amount,
                }));
                signature = yield this.wallet.adapter.sendTransaction(transaction, this.connection);
                onTransactionSent && onTransactionSent(signature);
                yield this.connection.confirmTransaction(signature, "processed");
                onSuccess && onSuccess(signature);
                return signature;
            }
            catch (error) {
                onError && onError("Wallet not connected!");
                throw new Error("Wallet not connected!");
            }
        });
    }
    close() {
        this.removeListeners();
    }
    getWallet() {
        return this.wallet;
    }
    static createEndpoint(network) {
        return (0, web3_js_1.clusterApiUrl)(network);
    }
}
exports.default = Adapter;
//# sourceMappingURL=Adapter.js.map