import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { configureChains, mainnet, WagmiConfig, createClient } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { sepolia } from "@wagmi/chains";

const { provider, webSocketProvider } = configureChains(
  [mainnet, sepolia],
  [publicProvider()]
);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <WagmiConfig client={client}>
      <App />
    </WagmiConfig>
  </React.StrictMode>
);

// 1st 0xd1Bd49E4b6cF0BfFCd78Cf3095819d58883eB283
// 2nd 0xaC47ED7f1837D679e8bfb5c0bE83037264A8cbe2
