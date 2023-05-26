import { useState, useEffect } from "react";
import "./App.css";
import logo from "./My-logo.png";
import { Layout, Button } from "antd";
import CurrentBalance from "./componets/CurrentBalance";
import RequestAndPay from "./componets/RequestAndPay";
import AccountDetails from "./componets/AccountDetails";
import RecentActivity from "./componets/RecentActivity";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import axios from "axios";

const { Header, Content } = Layout;

function App() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  });

  const [name, setName] = useState("...");
  const [balance, setBalance] = useState("...");
  const [dollars, setDollars] = useState("...");
  const [history, setHistory] = useState(null);
  const [requests, setRequests] = useState({ 1: [0], 0: [] });

  function disconnectAndSetNull() {
    disconnect();
    setName("...");
    setBalance("...");
    setDollars("...");
    setHistory(null);
    setRequests({ 1: [0], 0: [] });
  }

  async function getNameAndBalance() {
    const res = await axios.get(
      `https://mo-backend-kr0d.onrender.com/getNameAndBalance`,
      {
        params: { userAddress: address },
      }
    );

    const response = res.data;
    // console.log(response.requests);
    if (response.name[1]) {
      setName(response.name[0]);
    }
    setBalance(String(response.balance));
    setDollars(String(response.dollars));
    setHistory(response.history);
    setRequests(response.requests);
  }

  useEffect(() => {
    if (!isConnected) return;
    getNameAndBalance();
  }, [isConnected]);

  return (
    <div className="App">
      <Layout className="layout">
        <header className="header">
          <div className="headerLeft">
            <img src={logo} alt="logo" className="logo" />
            {isConnected && (
              <>
                <div
                  className="menuOption"
                  style={{ borderBottom: "1.5px solid #fff" }}
                >
                  Summary
                </div>
                <div className="menuOption">Activity</div>
                <div className="menuOption">{`Pay & Request`}</div>
                {/* <div className="menuOption">Wallet</div> */}
                <div className="menuOption">Help</div>
              </>
            )}
          </div>
          {isConnected ? (
            <Button
              className="connect-btn"
              // type={"primary"}
              onClick={disconnectAndSetNull}
            >
              Disconnect Wallet
            </Button>
          ) : (
            <Button
              className="connect-btn"
              type={"primary"}
              onClick={() => {
                console.log(requests);
                connect();
              }}
            >
              Connect Wallet
            </Button>
          )}
        </header>
        <Content className="content">
          {isConnected ? (
            <>
              <div className="firstColumn">
                <CurrentBalance dollars={dollars} />
                <RequestAndPay
                  requests={requests}
                  getNameAndBalance={getNameAndBalance}
                />
                <AccountDetails
                  address={address}
                  name={name}
                  balance={balance}
                  getNameAndBalance={getNameAndBalance}
                />
              </div>
              <div className="secondColumn">
                <RecentActivity history={history} />
              </div>
            </>
          ) : (
            <div
              style={{
                minHeight: "80vh",
                minWidth: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 102, 255)",
                color: "#fff",
                fontSize: "20px",
                // flexDirection: "column",
                // position: "absolute",
                // left: "0",
                // right: "0",
              }}
            >
              Please Connect Your Wallet
            </div>
          )}
        </Content>
      </Layout>
    </div>
  );
}

export default App;
