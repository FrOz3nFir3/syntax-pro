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
      <div
        className="fixed inset-0 bg-ink/60 dark:bg-ink-900/70 backdrop-blur-sm transition-opacity"
        onClick={toggle}
      ></div>

      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-md transform overflow-visible rounded-2xl bg-paper dark:bg-ink-700 border border-ink/10 dark:border-paper/10 shadow-lift transition-all"
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
