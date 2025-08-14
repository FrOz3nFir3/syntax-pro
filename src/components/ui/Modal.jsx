import React from "react";
import {
  NewFolder,
  NewPlayground,
  EditTitle,
  NewPlayGroundAndFolder,
  Load,
} from "./ModalTypes.jsx";

function Modal(props) {
  const { toggle } = props;
  const { type } = props.modal;

  // Disable body scroll when modal is open
  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={toggle}
      ></div>

      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-md transform overflow-visible rounded-2xl bg-white dark:bg-slate-900 shadow-2xl transition-all"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {type == "newPlaygroundAndFolder" && (
            <NewPlayGroundAndFolder toggle={toggle} />
          )}
          {type == "newPlayground" && (
            <NewPlayground modal={props.modal} toggle={toggle} />
          )}
          {type == "newFolder" && <NewFolder toggle={toggle} />}
          {type.includes("edit") && (
            <EditTitle modal={props.modal} toggle={toggle} />
          )}
          {type.toLowerCase().includes("code") && <Load type={type} />}
        </div>
      </div>
    </div>
  );
}

export default Modal;
