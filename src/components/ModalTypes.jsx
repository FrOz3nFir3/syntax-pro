import React from "react";
import Select from 'react-select';
import {useDispatch} from "react-redux";
import {addFolder, addPlayground,addPlaygroundAndFolder,editTitles} from "../slices/playgroundSlice.jsx";


const languageOptions = [
  { value: 'javascript', label: 'Javascript' },
  { value: 'java', label: 'Java' },
  { value: 'python', label: 'Python' },
  { value: 'cpp', label: 'C++' },
  { value: 'rust', label: "Rust"},
  { value: 'php', label: "Php"}
];

export function NewPlayGroundAndFolder(props) {
  const [selectedOption, setSelectedOption] = React.useState(languageOptions[0]);

  const dispatch = useDispatch();
  const folderRef = React.createRef();
  const cardRef = React.createRef()

  const createPlaygroundAndFolder = ()=>{
    const folderTitle = folderRef.current.value;
    const cardTitle = cardRef.current.value;
    const language = selectedOption.value;

    if(folderTitle.trim().length && cardTitle.trim().length){
      dispatch(addPlaygroundAndFolder({folderTitle, cardTitle, language}));
      toggle();
    }
  }
  const {
    toggle
  } = props;
  return <div className="p-4">
    <div className="flex flex-wrap gap-2 justify-around">
      <h2 className="text-2xl font-bold">New Playground & Folder</h2>
      <button className="bg-red-600 hover:bg-red-400 text-white px-3" onClick={toggle}>CLOSE</button>
    </div>

    <div className="flex flex-wrap gap-3 mt-4">
      <p>Folder Name</p>
      <input className="input-primary" type="text" ref={folderRef}/>
    </div>

    <div className="flex flex-wrap gap-3 mt-4">
      <p>Card Name</p>
      <input className="input-primary" type="text" ref={cardRef}/>
    </div>

    <div className="flex flex-wrap justify-between gap-3 mt-4">
      <div style={{minWidth:"150px"}}>
        <Select
          defaultValue={selectedOption}
          onChange={setSelectedOption}
          options={languageOptions}
        />
      </div>
      <button onClick={createPlaygroundAndFolder} className="btn-gold">Create Playground</button>
    </div>
  </div>
}
export function NewPlayground(props) {
  const [selectedOption, setSelectedOption] = React.useState(languageOptions[0]);

  const {
    toggle
  } = props;
  const {
    folderId
  } = props.modal;

  const dispatch = useDispatch();
  const inputRef = React.createRef();

  const createPlayground = ()=>{
    const title = inputRef.current.value;
    const language = selectedOption.value;

    if(title.trim().length){
      dispatch(addPlayground({title, language, folderId}));
      toggle();
    }
  }


  return <div className="p-4">
    <div className="flex flex-wrap gap-2 justify-around">
       <h2 className="text-2xl font-bold">New Playground </h2>
       <button className="bg-red-600 hover:bg-red-400 text-white px-3" onClick={toggle}>CLOSE</button>
    </div>
    <div className="flex flex-wrap gap-3 mt-4">
      <input className="border border-indigo-600" type="text" ref={inputRef}/>
      <div style={{minWidth:"150px"}}>
        <Select
          defaultValue={selectedOption}
          onChange={setSelectedOption}
          options={languageOptions}
        />
      </div>
    </div>
    <button onClick={createPlayground} className="btn-gold mt-4">Create Playground</button>

  </div>
}
export  function NewFolder(props) {
  const {
    toggle
  } = props;
  const dispatch = useDispatch();
  const inputRef = React.createRef();

  const createFolder = ()=>{
    const title = inputRef.current.value;
    if(title.trim().length){
      dispatch(addFolder({title, playgrounds:{}}));
      toggle();
    }
  }

  return <div className="p-4">
    <div className="flex flex-wrap gap-2 justify-around">
      <h2 className="text-2xl font-bold">New Folder</h2>
      <button className="bg-red-600 hover:bg-red-400 text-white px-3" onClick={toggle}>CLOSE</button>
    </div>

    <div className="flex flex-wrap gap-3 mt-4">
      <input className="input-primary" type="text" ref={inputRef}/>
      <button className="btn-gold" onClick={createFolder}>Create Folder</button>
    </div>
  </div>
}

export function EditTitle(props) {
  const {
    toggle,
  } = props;

  let {
    type,
    title="",
    playgroundId,
    folderId
  } = props.modal;

  const [currentTitle, setTitle] = React.useState(title)
  const dispatch = useDispatch();
  const updateTitle = ()=>{
    const title = currentTitle;
    if(title.trim().length){
      dispatch(editTitles({type, title, playgroundId, folderId}));
      toggle();
    }
  }

  const editTitle =(e)=>{
    e.preventDefault();
    setTitle(e.target.value);
  }

  let newTitle = ""
  if(type == "editFolder"){
    newTitle = "Edit Folder"
  }else if(type == "editCard"){
    newTitle = "Edit Card"
  }

  return <div className="p-4">
    <div className="flex flex-wrap gap-2 justify-around">
      <h2 className="text-2xl font-bold">{newTitle}</h2>
      <button className="bg-red-600 hover:bg-red-400 text-white px-3" onClick={toggle}>CLOSE</button>
    </div>

    <div className="flex flex-wrap gap-3 mt-4">
      <input className="input-primary" type="text" value={currentTitle} onChange={editTitle}/>
      <button onClick={updateTitle} className="btn-gold">Update Title</button>
    </div>
  </div>
}

export function Load(props) {
  const {
    type
  } = props;

  return <div className="p-4">
    <h2 className="text-lg">{type}...</h2>
  </div>
}