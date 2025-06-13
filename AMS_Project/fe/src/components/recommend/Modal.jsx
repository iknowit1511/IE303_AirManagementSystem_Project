import React from "react";
import "./Modal.scss";

const Modal = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        <button className="modal-close-btn" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default Modal;