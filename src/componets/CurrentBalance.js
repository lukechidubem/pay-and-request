import React, { useState } from "react";
import { Card, Modal } from "antd";

function CurrentBalance({ dollars }) {
  const [payModal, setPayModal] = useState(false);

  const showPayModal = () => {
    setPayModal(true);
  };
  const hidePayModal = () => {
    setPayModal(false);
  };
  return (
    <>
      <Modal
        title="Bridge & Swap"
        open={payModal}
        onOk={hidePayModal}
        onCancel={hidePayModal}
        // okText={`Soon`}
        cancelText="Cancel"
      >
        <>
          <h2>Coming Soon...</h2>
        </>
      </Modal>

      <Card title="Current Balance" style={{ width: "100%" }}>
        <div className="currentBalance">
          <div style={{ lineHeight: "70px" }}>$ {dollars}</div>
          <div style={{ fontSize: "20px" }}>Available</div>
        </div>
        <div className="balanceOptions">
          <div className="extraOption" onClick={showPayModal}>
            Swap Tokens
          </div>
          <div className="extraOption" onClick={showPayModal}>
            Bridge Tokens
          </div>
        </div>
      </Card>
    </>
  );
}

export default CurrentBalance;
