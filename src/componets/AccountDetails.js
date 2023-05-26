import React, { useEffect, useState } from "react";
import { Card, Input, Modal } from "antd";
import { UserOutlined } from "@ant-design/icons";
import matic from "../matic.png";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { sepolia } from "@wagmi/chains";
import ABI from "../abi.json";
function AccountDetails({ address, name, balance, getNameAndBalance }) {
  const [addName, setAddName] = useState("");
  const [addNameModal, setAddNameModal] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState(false);

  const { config } = usePrepareContractWrite({
    chainId: sepolia.id,
    address: "0xD657D728417D27bB44344391daEc3a773125bC5C",
    abi: ABI,
    functionName: "addName",
    args: [addName],
  });

  const { write, data } = useContractWrite(config);

  const { isLoading, isSuccess, error } = useWaitForTransaction({
    hash: data?.hash,
  });

  const showAddNameModal = () => {
    setAddNameModal(true);
  };
  const hideAddNameModal = () => {
    setAddNameModal(false);
  };

  useEffect(() => {
    if (isSuccess) {
      getNameAndBalance();

      setAddNameModal(false);
      setNotifyMessage(true);
    }

    setTimeout(() => {
      setNotifyMessage(false);
    }, 10000);
  }, [isSuccess, error]);

  const notifyMe = isSuccess ? (
    <div
      style={{
        backgroundColor: "black",
        color: "white",
        padding: "10px",
        borderRadius: "8px",
        textAlign: "center",
        position: "absolute",
        top: 6,
        fontSize: "16px",
        // left: 0,
        right: 200,
      }}
    >
      Name Successfully Updated to {addName}
      <div style={{ padding: "10px" }}>
        <a href={`https://sepolia.etherscan.io/tx/${data?.hash}`}>Etherscan</a>
      </div>
    </div>
  ) : (
    <div
      style={{
        backgroundColor: "red",
        color: "white",
        padding: "10px",
        borderRadius: "8px",
        textAlign: "center",
        position: "absolute",
        top: 6,
        fontSize: "16px",
        // left: 0,
        right: 200,
      }}
    >
      Error Updating name, Please refresh and try again
    </div>
  );

  const switchAccounts2 = async () => {
    try {
      await window.ethereum.enable();
      // Refresh the page or update the state to reflect the switched account
    } catch (error) {
      console.log("Failed to switch accounts:", error);
    }
  };

  const switchAccounts = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      // Handle the switched account - e.g., refresh the page or update the state
      getNameAndBalance();
      console.log("Switched to account:", accounts);
    } catch (error) {
      console.log("Failed to switch accounts:", error);
    }
  };

  return (
    <>
      <Modal
        title="Update Your Username"
        open={addNameModal}
        onOk={() => {
          write?.();
          // isSuccess && hideAddNameModal();
        }}
        onCancel={hideAddNameModal}
        okText={isLoading ? "Updating..." : `Proceed To Update`}
        cancelText="Cancel"
      >
        <p>New Name</p>
        <Input
          placeholder="Dubem Luke..."
          value={addName}
          onChange={(val) => setAddName(val.target.value)}
        />
      </Modal>
      <Card title="Account Details" style={{ width: "100%" }}>
        <div className="accountDetailRow">
          <UserOutlined style={{ color: "#767676", fontSize: "25px" }} />
          <div>
            <div className="accountDetailHead"> {name} </div>
            <div className="accountDetailBody">
              {" "}
              Address: {address.slice(0, 4)}...{address.slice(38)}
            </div>
          </div>
        </div>
        <div className="accountDetailRow">
          <img src={matic} alt="maticLogo" width={25} />
          <div>
            <div className="accountDetailHead"> Native Sepolia ETH Tokens</div>
            <div className="accountDetailBody">{balance} ETH</div>
          </div>
        </div>
        <div className="balanceOptions">
          <div className="extraOption" onClick={() => showAddNameModal()}>
            Set Username
          </div>
          <div className="extraOption" onClick={switchAccounts}>
            Switch Accounts
          </div>
        </div>
      </Card>
      {notifyMessage && notifyMe}
    </>
  );
}

export default AccountDetails;
