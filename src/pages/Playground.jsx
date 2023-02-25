import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentPlayground, updateCode, updateTheme} from "../slices/playgroundSlice.jsx";
import {Link, useParams} from "react-router-dom";
import Select from "react-select";

import ReactCodeMirror, {useCodeMirror} from "@uiw/react-codemirror";

// languages
import {java} from "@codemirror/lang-java";
import {javascript} from "@codemirror/lang-javascript";
import {cpp} from "@codemirror/lang-cpp";
import {python} from "@codemirror/lang-python";
import {rust} from "@codemirror/lang-rust";
import {php} from "@codemirror/lang-php"

// themes
import {abcdef, androidstudio, atomone, aura, bbedit, bespin, darcula, dracula, duotoneLight, duotoneDark, eclipse, githubDark, githubLight,
gruvboxLight, gruvboxDark, materialLight, materialDark, noctisLilac, nord, okaidia, solarizedLight, solarizedDark, sublime, tokyoNight,
tokyoNightDay, vscodeDark, xcodeLight, xcodeDark} from "@uiw/codemirror-themes-all";

import {useButtonToggle} from "../hooks/useButtonToggle.jsx";
import Modal from "../components/Modal.jsx";

const RAPID_API_KEY = import.meta.env.VITE_RAPID_API_KEY;

const languageOptions = [
  { value: 'javascript', label: 'Javascript' },
  { value: 'java', label: 'Java' },
  { value: 'python', label: 'Python' },
  { value: 'cpp', label: 'C++' },
  { value: 'rust', label: "Rust"},
  { value: 'php', label: "Php"}
];

const themesConfig = {
  abcdef,
  androidstudio,
  atomone,
  aura,
  bbedit,
  bespin,
  darcula,
  dracula,
  duotoneLight,
  duotoneDark,
  eclipse,
  githubLight,
  githubDark,
  gruvboxLight,
  gruvboxDark,
  materialLight,
  materialDark,
  noctisLilac,
  nord,
  okaidia,
  solarizedLight,
  solarizedDark,
  sublime,
  tokyoNight,
  tokyoNightDay,
  vscodeDark,
  xcodeLight,
  xcodeDark,
}

const themeOptions = Object.keys(themesConfig).map((key)=>({value:key, label:key}))

function Playground(props) {
  const [fullScreen, setFullScreen] = React.useState(false);

  const dispatch = useDispatch();

  const folder = useSelector(selectCurrentPlayground);
  const params = useParams();
  const {folderId, playgroundId} = params;
  const playground = folder[folderId].playgrounds[playgroundId]

  const code = playground.code || "";
  const title = playground.title;
  const language = playground.language;
  const theme = playground.theme;
  const id = playground.id;

  const newLanguageOptions = languageOptions.map((option)=>{
    if(option.value == language){
      return option
    }else{
      return {...option, disabled:true}
    }
  })

  const currentCodeRef = React.useRef(code);

  const onChange = React.useCallback((value) => {
    currentCodeRef.current = value;
  }, []);

  const [modal, updateModal] = useButtonToggle();

  const codeInputRef = React.useRef(null);
  const codeExportRef = React.useRef(null);

  const [codeImport, setCodeFileImport] = React.useState(null);
  const [inputImport, setInputFileImport]= React.useState(null);

  const fileInputRef = React.useRef(null);
  const fileImportRef = React.useRef(null);


  React.useEffect(()=>{
    if(codeImport != null){
      dispatch(updateCode({folderId,playgroundId, code:codeImport}));
      currentCodeRef.current = codeImport;
    }
    if(inputImport != null){
      codeInputRef.current.value = inputImport;
    }
  },[codeImport, inputImport])

  const [selectedLanguage, setLanguage] = React.useState(languageOptions.find((option => option.value == language)));
  const [selectedTheme, setTheme] = React.useState(themeOptions.find(option => option.value == theme));


  return (
    <div>
      {modal.clicked && <Modal modal={modal} toggle={updateModal}/>}

      {fullScreen == false &&
        <Link to="/" replace>
        <header className="flex flex-wrap p-2 justify-center items-center gap-2 bg-black font-sans text-white text-center">
          <img width={80} height={80} src="/logo.png" className="logo" alt="Vite logo" />
          <h2 className="text-4xl font-medium">Syntax Pro</h2>
        </header>
      </Link>
      }


      <div className={`flex  flex-col lg:flex-row ${fullScreen && "lg:flex-col"}`}>
        <div className={`${fullScreen ? "w-full" : "lg:w-[70%]"} `}>

          {fullScreen == false &&
            <div className="flex flex-wrap justify-between items-center gap-3 text-lg  p-3">
              <div className="flex flex-wrap gap-3">
                <h2 className="font-bold self-center">{title}</h2>
                <button className="hover:animate-bounce"
                        onClick={ () => updateModal({clicked:true, type:"editCard", folderId, playgroundId, title})}>Edit Title</button>
                <button onClick={saveCode} className="btn-gold">Save Code</button>
              </div>

              <div className="flex flex-wrap gap-3">
                <div style={{minWidth:"150px"}}>
                  <Select
                    menuPlacement="auto"
                    menuPosition="fixed"
                    defaultValue={selectedLanguage}
                    onChange={setLanguage}
                    isOptionDisabled={(option) => option.disabled}
                    options={newLanguageOptions}
                  />
                </div>

                <div style={{minWidth:"155px"}}>
                  <Select
                    menuPlacement="auto"
                    menuPosition="fixed"
                    defaultValue={selectedTheme}
                    onChange={(option)=>{
                      dispatch(updateTheme({folderId, playgroundId, theme:option.value}))
                      setTheme(option)
                      }
                    }
                    options={themeOptions}
                  />
                </div>
              </div>
            </div>
          }


          {/*Main Code Editor Here*/}
          <div className='text-lg'>
            <ReactCodeMirror height={`${fullScreen ? "93vh" : "71vh"}`} width="100%" theme={themesConfig[selectedTheme.value]}
                             value={currentCodeRef.current} onChange={onChange}
                             extensions={[java(), javascript(),cpp(),python(),rust(),php()]}/>
          </div>

          <div className="flex gap-2 p-[.75rem] bg-[gold] text-lg font-bold flex-wrap justify-around">
            {fullScreen == true ?
              <button className="hover:bg-black hover:text-[gold] hover:px-3" onClick={()=>setFullScreen(false)}>Minimize Screen</button>
              : <button className="hover:bg-black hover:text-[gold] hover:px-3" onClick={()=>setFullScreen(true)}>Full Screen</button>
            }
            <input
              type="file"
              ref={fileImportRef}
              style={{ display: 'none' }}
              onChange={(event) => readFileContents(event, setCodeFileImport)}
            />
            <button className="hover:bg-black hover:text-[gold] hover:px-3" onClick={handleCodeImport}>Import Code</button>
            <button className="hover:bg-black hover:text-[gold] hover:px-3" onClick={()=>{
              exportCodeFile(currentCodeRef.current, title)
            }}>Export Code</button>
            <button className="hover:bg-black hover:text-[gold] hover:px-3" onClick={runCode}>Run Code</button>
          </div>
        </div>

        {/* Input and Output Section*/}
        <div className={`flex flex-col h-[80vh]  ${fullScreen ? "lg:w-[100%] lg:h-[80vh" : "lg:w-[30%] lg:h-auto"}`}>
          <div className="h-full">
            <div className="flex justify-between gap-3 bg-slate-100 p-4">
              <h2 className="font-bold text-xl">Input</h2>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={(event) => readFileContents(event, setInputFileImport)}
              />
              <button className="hover:bg-black hover:text-white" onClick={handleInputImport}>Import Input</button>
            </div>
            <textarea className="w-full h-[260px]  p-2" name="input" id="input-code" ref={codeInputRef}></textarea>
          </div>

          <div className="h-full">
            <div className="flex justify-between gap-3 bg-slate-100 p-4">
              <h2 className="font-bold text-xl">Output</h2>
              <button className="hover:bg-black hover:text-white" onClick={(e) => exportCodeFile(codeExportRef.current.innerText, title + '-output')}>Export Output</button>
            </div>
            <div style={{overflow:"auto"}} className="w-full h-[260px] p-2" ref={codeExportRef}></div>
          </div>
        </div>
      </div>
    </div>
  );

  // hoisting

  async function runCode() {
    updateModal({clicked:true, type:"Running Code"})

    var code = currentCodeRef.current;
    var input = codeInputRef.current.value;

    var body = {
      language_id:id,
      source_code:code,
      stdin:input
    }

    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': RAPID_API_KEY,
        'X-RapidAPI-Host': 'coderunner3.p.rapidapi.com'
      },
      body: JSON.stringify(body)
    };

    try{
      var response = await fetch(`https://coderunner3.p.rapidapi.com/submissions/?base64_encoded=false&wait=true`, options);
      // sample response
      // {
      //   "stdout": "Hello World!",
      //   "time": "0.004",
      //   "memory": 1416,
      //   "stderr": null,
      //   "token": "8dd9cb9c-aee4-4fe4-9388-cc5889de3fd3",
      //   "compile_output": null,
      //   "message": null,
      //   "status": {
      //   "id": 3,
      //     "description": "Accepted"
      // }
      // }

      var details = await response.json();

      //contains error
      if(details.message){
        throw details;
      }
      var {
        stdout,
        stderr,
        compile_output,
        status:{
          description
        }
      } = details;

      // error
      if(stdout == null){
        if(stderr){
          codeExportRef.current.innerText = stderr;
        }else{
          codeExportRef.current.innerText = compile_output;
        }
      }else{
        codeExportRef.current.innerText = stdout;
      }
    }catch(e){
      codeExportRef.current.innerText = `Error from API / Network Request:
      Message: ${e.message}
      `
    }

    // closing the modal
    updateModal()
  }

  function readFileContents(event, updateState){
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      updateState(reader.result);
    };
    reader.readAsText(file);
  };

  function handleCodeImport() {
    fileImportRef.current.click();
  }

  function handleInputImport() {
    fileInputRef.current.click();
  }

  function saveCode(){
    updateModal({clicked:true, type:"Saving Code"})
    const code = currentCodeRef.current;
    dispatch(updateCode({playgroundId, folderId, code}))
    // mocking saving of code
    setTimeout(()=>{
      updateModal()
    },600)
  }
}



function exportCodeFile(fileData, name) {
  const blob = new Blob([fileData], { type: "text/plain" });
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a");
  link.download = `${name}.txt`;
  link.href = url;
  link.click();
}


export default Playground;
