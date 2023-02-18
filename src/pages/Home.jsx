import React from 'react';
import {useButtonToggle} from "../hooks/useButtonToggle.jsx";
import Modal from "../components/Modal.jsx";
import {useDispatch, useSelector} from "react-redux";
import {deleteItems, selectCurrentPlayground} from "../slices/playgroundSlice.jsx";
import {Link} from "react-router-dom";

function Home(props) {
  const[modal, toggle] = useButtonToggle();
  const folders = useSelector(selectCurrentPlayground);
  const dispatch = useDispatch();

  const deleteItem = ({type, folderId, playgroundId}) => {
   const response = window.confirm("Are You sure you want to Delete?");
   if(response){
     dispatch(deleteItems({type, folderId, playgroundId}))
   }
  }

  return (
    <>
      {modal.clicked && <Modal modal={modal} toggle={toggle}/>}

    <div className="flex flex-col items-center gap-3 p-5 bg-black font-sans text-white text-center">
      <img src="/logo.png" className="logo" alt="Vite logo" />
      <h1 className="text-5xl font-medium">Syntax Pro</h1>
      <p className="text-2xl animate-pulse ">Code. Run. Debug</p>
      <button className="btn-gold" onClick={toggle.bind(null,{clicked:true, type:"newPlaygroundAndFolder"})}>New Playground & Folder</button>
    </div>

    <div className="p-5">
      <div className="flex gap-3 flex-wrap justify-between">
        <h2 className="text-2xl">My <strong>Playground</strong></h2>
        <button className="btn-gold" onClick={toggle.bind(null,{clicked:true, type:"newFolder"})}>New Folder</button>
      </div>
      <hr className="mb-8 mt-4 bg-black" />

      {Object.entries(folders).map(renderFolders)}
    </div>
    </>
  );

  // hoisting
  function renderFolders([folderId, folder]) {

    return (
      <div key={folderId} className="flex flex-col my-8">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center">
            <h3 className="text-xl font-semibold">{folder.title}</h3>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <button className="text-lg hover:animate-bounce" onClick={toggle.bind(null, {clicked:true, type:"editFolder", title:folder.title, folderId})}>Edit Folder</button>
            <button className="text-lg hover:animate-bounce" onClick={deleteItem.bind(null, {type:"deleteFolder", folderId})}>Delete Folder</button>
            <button
              className="btn-gold"
              onClick={toggle.bind(null, {clicked:true, type:"newPlayground", folderId})}
            >
              New Playground
            </button>
          </div>
        </div>
        <hr className="mb-12 mt-4 bg-black" />
        <div className="grid gap-3 md:grid-cols-2">
          {Object.entries(folder["playgrounds"]).map(renderCards)}
        </div>
      </div>
    )

    function renderCards([playgroundId, playground]) {
      return (
        <Link key={playgroundId} to={`/playground/${folderId}/${playgroundId}`}>

        <div className="flex flex-wrap items-center justify-between gap-3 bg-black text-white p-3 hover:bg-white hover:text-black">
            <div className="flex flex-wrap items-center justify-start gap-3">
              <img width={100} height={100} src={`/${playground.language}.png`} alt="logo" />
              <div>
                <h3 className="text-2xl">Title: <strong>{playground.title}</strong></h3>
                <h3 className="text-2xl">Language: <strong>{playground.language}</strong></h3>
              </div>
            </div>

            <div className="flex flex-col self-center md:justify-center items-center gap-1">
                <button className="text-xl hover:animate-bounce" onClick={(e)=> {
                  e.preventDefault()
                  toggle({clicked:true, type:"editCard", title:playground.title, playgroundId, folderId})
                }}>Edit Card</button>
                <button className="text-xl hover:animate-bounce" onClick={(e)=> {
                  e.preventDefault()
                  deleteItem({type: "deleteCard", playgroundId, folderId})
                }}>Delete Card</button>
            </div>
          </div>
        </Link>

      )
    }

  }

}


export default Home;


