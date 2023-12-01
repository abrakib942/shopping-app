/* eslint-disable react/prop-types */
import { Modal } from "antd";

const CustomModal = ({
  isOpen,
  closeModal,
  title,
  children,
  handleOk,
  showCancelButton = true,
  showOkButton = true,
}) => {
  return (
    <Modal
      title={title}
      open={isOpen}
      onOk={handleOk}
      onCancel={closeModal}
      cancelButtonProps={{
        style: { display: showCancelButton ? "inline" : "none" },
      }}
      okButtonProps={{ style: { display: showOkButton ? "inline" : "none" } }}
    >
      {children}
    </Modal>
  );
};

export default CustomModal;
