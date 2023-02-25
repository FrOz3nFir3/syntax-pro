import React from 'react';
import {NewFolder, NewPlayground, EditTitle, NewPlayGroundAndFolder, Load} from "./ModalTypes.jsx";

function Modal(props) {
  const {toggle} = props;
  const {type} = props.modal;

  return (
    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
      <div
        className="relative w-auto my-6 mx-auto max-w-3xl"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
          {type == "newPlaygroundAndFolder" && <NewPlayGroundAndFolder  toggle={toggle}/>}
          {type == "newPlayground" && <NewPlayground modal={props.modal} toggle={toggle}/> }
          {type == "newFolder" && <NewFolder toggle={toggle}/> }
          {type.includes("edit") && <EditTitle modal={props.modal} toggle={toggle}/>}
          {type.toLowerCase().includes("code") && <Load type={type}/>}
        </div>
      </div>
    </div>
  );
}

export default Modal;