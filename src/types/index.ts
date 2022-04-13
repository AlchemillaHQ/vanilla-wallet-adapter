import Adapter from "../Adapter/Adapter";

export {};

declare global {
  interface Window {
    SolanaAdapter: typeof Adapter;
  }
}
