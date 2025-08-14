import React from "react";
import {
  NewFolder,
  NewPlayground,
  EditTitle,
  NewPlayGroundAndFolder,
  Load,
} from "./ModalTypes.jsx";

const ModalWrapper = ({
  modal,
  toggle,
  playground,
  folderId,
  playgroundId,
}) => {
  const { type, clicked } = modal;

  if (!clicked) return null;

  return (
    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-black bg-opacity-50">
      <div
        className="relative w-auto my-6 mx-auto max-w-3xl"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white dark:bg-gray-800 outline-none focus:outline-none">
          {type === "newPlaygroundAndFolder" && (
            <NewPlayGroundAndFolder toggle={toggle} />
          )}
          {type === "newPlayground" && (
            <NewPlayground modal={modal} toggle={toggle} />
          )}
          {type === "newFolder" && <NewFolder toggle={toggle} />}
          {type?.includes("edit") && (
            <EditTitle modal={modal} toggle={toggle} />
          )}
          {type?.toLowerCase().includes("code") && <Load type={type} />}
        </div>
      </div>
    </div>
  );
};

export default ModalWrapper;
