import React, { useState, useEffect } from "react";
import { DollarOutlined, SwapOutlined } from "@ant-design/icons";
import { Modal, Input, InputNumber } from "antd";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { sepolia } from "@wagmi/chains";
import ABI from "../abi.json";

function RequestAndPay({ requests, getNameAndBalance }) {
  const [payModal, setPayModal] = useState(false);
  const [requestModal, setRequestModal] = useState(false);
  const [requestAmount, setRequestAmount] = useState(0);
  const [requestAddress, setRequestAddress] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [payAddressAmount, setPayAddressAmount] = useState(0);
  const [payAddress, setPayAddress] = useState("");
  const [payAddressModal, setPayAddressModal] = useState(false);
  const [payAddressMessage, setPayAddressMessage] = useState("");
  const [requstToPay, setRequstToPay] = useState(0);
  const [notifyMessage2, setNotifyMessage2] = useState(false);

  const mainRequestAmount = String(Number(requestAmount) * 1e18);

  const { config } = usePrepareContractWrite({
    chainId: sepolia.id,
    address: "0xD657D728417D27bB44344391daEc3a773125bC5C",
    abi: ABI,
    functionName: "payRequest",
    args: [0],
    overrides: {
      value: String(Number(requests["1"][requstToPay])),
    },
  });

  const { write, data } = useContractWrite(config);

  const { config: configRequest } = usePrepareContractWrite({
    chainId: sepolia.id,
    address: "0xD657D728417D27bB44344391daEc3a773125bC5C",
    abi: ABI,
    functionName: "createRequest",
    args: [requestAddress, mainRequestAmount, requestMessage],
  });

  const { write: writeRequest, data: dataRequest } =
    useContractWrite(configRequest);

  const { config: configPayAddress } = usePrepareContractWrite({
    chainId: sepolia.id,
    address: "0xD657D728417D27bB44344391daEc3a773125bC5C",
    abi: ABI,
    functionName: "payToAddress",
    args: [payAddress, payAddressMessage],
    overrides: {
      value: String(Number(payAddressAmount * 1e18)),
    },
  });

  const { write: writePayAddress, data: dataPayAddress } =
    useContractWrite(configPayAddress);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const { isLoading: isLoadingRequest, isSuccess: isSuccessRequest } =
    useWaitForTransaction({
      hash: dataRequest?.hash,
    });

  const { isLoading: isLoadingPayAddress, isSuccess: isSuccessPayAddress } =
    useWaitForTransaction({
      hash: dataPayAddress?.hash,
    });

  const showPayModal = () => {
    setPayModal(true);
  };
  const hidePayModal = () => {
    setPayModal(false);
  };

  const showRequestModal = () => {
    setRequestModal(true);
  };
  const hideRequestModal = () => {
    setRequestModal(false);
  };

  const showPayAddressModal = () => {
    setPayAddressModal(true);
  };
  const hidePayAddressModal = () => {
    setPayAddressModal(false);
  };

  useEffect(() => {
    if (isSuccess || isSuccessRequest || isSuccessPayAddress) {
      getNameAndBalance();

      setPayModal(false);
      setRequestModal(false);
      setPayAddressModal(false);
      setNotifyMessage2(true);
    }

    setTimeout(() => {
      setNotifyMessage2(false);
    }, 8000);
  }, [isSuccess, isSuccessRequest, isSuccessPayAddress]);

  const notifyMe2 = (
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
      {isSuccess || isSuccessPayAddress
        ? "Payment is Successful "
        : // `Payment of ${
          //     isSuccess ? requests["1"][requstToPay] / 1e18 : +payAddressAmount
          //   } is Successful`
          `Request for payment of ${requestAmount} is Successful`}
      <div style={{ padding: "10px" }}>
        <a
          href={`https://sepolia.etherscan.io/tx/${
            isSuccess
              ? data?.hash
              : isSuccessRequest
              ? dataRequest?.hash
              : dataPayAddress?.hash
          }`}
        >
          Etherscan
        </a>
      </div>
    </div>
  );

  return (
    <>
      <Modal
        title="Confirm Payment"
        open={payModal}
        onOk={() => {
          write?.();
          // hidePayModal();
        }}
        onCancel={hidePayModal}
        okText={isLoading ? "Paying..." : `Proceed To Pay`}
        cancelText="Cancel"
      >
        {requests && requests["0"].length > 0 && (
          <>
            <div style={{ display: "flex" }}>
              {requests["0"].map((add, index) => {
                return (
                  <div
                    style={{
                      padding: "5px 10px",
                      margin: "5px",
                      background: "#31579E",
                      fontSize: "16px",
                      color: "white",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                    key={index}
                    onClick={() => {
                      setRequstToPay(index);
                    }}
                  >
                    {index + 1}
                  </div>
                );
              })}
            </div>
            <h2>Sending payment to {requests["3"][requstToPay]}</h2>
            <h3>Value: {requests["1"][requstToPay] / 1e18} ETH</h3>
            <p>"{requests["2"][requstToPay]}"</p>
          </>
        )}
      </Modal>
      <Modal
        title="Request A Payment"
        open={requestModal}
        onOk={() => {
          writeRequest?.();
          // hideRequestModal();
        }}
        onCancel={hideRequestModal}
        okText={isLoadingRequest ? "Requesting..." : `Proceed To Request`}
        cancelText="Cancel"
      >
        <p>Amount (ETH)</p>
        <Input
          value={requestAmount}
          onChange={(val) => setRequestAmount(val.target.value)}
          placeholder="Enter ETH amount"
        />
        <p>From (address)</p>
        <Input
          placeholder="0x..."
          value={requestAddress}
          onChange={(val) => setRequestAddress(val.target.value)}
        />
        <p>Message</p>
        <Input
          placeholder="Lunch Bill..."
          value={requestMessage}
          onChange={(val) => setRequestMessage(val.target.value)}
        />
      </Modal>

      <Modal
        title="Make A Payment"
        open={payAddressModal}
        onOk={() => {
          writePayAddress?.();
          // hideRequestModal();
        }}
        onCancel={hidePayAddressModal}
        okText={isLoadingPayAddress ? "Paying..." : `Proceed To Pay`}
        cancelText="Cancel"
      >
        <p>Amount (ETH)</p>
        <Input
          value={payAddressAmount}
          onChange={(val) => setPayAddressAmount(val.target.value)}
          placeholder="Please enter ETH amount"
        />
        <p>To (address)</p>
        <Input
          placeholder="0x..."
          value={payAddress}
          onChange={(val) => setPayAddress(val.target.value)}
        />
        <p>Message</p>
        <Input
          placeholder="Payment for?..."
          value={payAddressMessage}
          onChange={(val) => setPayAddressMessage(val.target.value)}
        />
      </Modal>
      <div className="requestAndPay">
        <div
          className="quickOption"
          onClick={() => {
            showPayModal();
          }}
        >
          <DollarOutlined style={{ fontSize: "26px" }} />
          Pay Request
          {requests && requests["0"].length > 0 && (
            <div className="numReqs">{requests["0"].length}</div>
          )}
        </div>
        <div
          className="quickOption"
          onClick={() => {
            showRequestModal();
          }}
        >
          <SwapOutlined style={{ fontSize: "26px" }} />
          Request
        </div>

        <div
          className="quickOption"
          onClick={() => {
            showPayAddressModal();
          }}
        >
          <SwapOutlined style={{ fontSize: "26px" }} />
          Pay
        </div>
      </div>
      {notifyMessage2 && notifyMe2}
    </>
  );
}

export default RequestAndPay;
