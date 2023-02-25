import { createSlice } from "@reduxjs/toolkit";

const languageMap = {
  cpp: {
    id: 54,
    defaultCode:
      "#include <iostream>\n" +
      "using namespace std;\n\n" +
      "int main() {\n" +
      '\tcout << "Hello from C++!";\n' +
      "\treturn 0;\n" +
      "}",
  },
  java: {
    id: 62,
    defaultCode: `public class Main {
      public static void main(String[] args) {
        System.out.println("Hello from Java!");
      }
}`,
  },
  javascript: {
    id: 63,
    defaultCode: `console.log("Hello from Javascript!")`,
  },
  php:{
    id:68,
    defaultCode: `<?php echo 'Hello from PHP!'; ?>`
  },
  python: {
    id: 71,
    defaultCode: `print("Hello from Python")`,
  },
  rust:{
    id:73,
    defaultCode:`fn main() {
      println!("Hello from Rust!");
}`
  }
};

const initialState = {
  [crypto.randomUUID()]: {
    title: "DSA",
    playgrounds: {
      [crypto.randomUUID()]: {
        id: 54,
        title: "Queue",
        language: "cpp",
        code: languageMap["cpp"].defaultCode,
        theme:"tokyoNight"
      },
      [crypto.randomUUID()]: {
        id: 63,
        title: "Array",
        language: "javascript",
        code: languageMap["javascript"].defaultCode,
        theme:"tokyoNight"
      },
      [crypto.randomUUID()]: {
        id: 71,
        title: "Stack ",
        language: "python",
        code: languageMap["python"].defaultCode,
        theme:"tokyoNight"
      },
      [crypto.randomUUID()]: {
        id: 62,
        title: "Fizzbuzz",
        language: "java",
        code: languageMap["java"].defaultCode,
        theme:"tokyoNight"
      },
    },
  },
};

const localPlayground = localStorage.getItem("playground") || "{}";

if(localPlayground == "{}"){
  // website doesn't have any playgrounds or folders
  localStorage.setItem('playground', JSON.stringify(initialState))
}

const playgroundSlicer = createSlice({
  name: "playground",
  initialState:JSON.parse(localStorage.getItem('playground')),
  reducers: {
    addFolder(state, action){
      const newFolder = action.payload;
      state[crypto.randomUUID()] = newFolder;
      localStorage.setItem('playground', JSON.stringify(state))
    },

    addPlayground(state, action){
      const {folderId, title, language} = action.payload;
      state[folderId].playgrounds[crypto.randomUUID()] = {
        id:languageMap[language].id,
        title,
        language,
        code:languageMap[language].defaultCode,
        theme:"tokyoNight"
      }
      localStorage.setItem('playground', JSON.stringify(state))
    },

    addPlaygroundAndFolder(state, action){
      const{
        folderTitle,
        cardTitle,
        language
      } = action.payload;

      state[crypto.randomUUID()] = {
        title:folderTitle,
        playgrounds:{
          [crypto.randomUUID()]:{
            id:languageMap[language].id,
            title:cardTitle,
            language,
            code: languageMap[language].defaultCode,
            theme:"tokyoNight"
          }
        }
      }
      localStorage.setItem('playground', JSON.stringify(state))

    },

    editTitles(state, action){
      const{
        type,
        title,
        folderId,
        playgroundId
      } = action.payload;


      if(type == "editFolder"){
        state[folderId].title = title;
      }else if(type == "editCard"){
        state[folderId].playgrounds[playgroundId].title = title;
      }
      localStorage.setItem('playground', JSON.stringify(state))
    },
    updateTheme(state, action){
      const{
        theme,
        folderId,
        playgroundId
      } = action.payload;
      state[folderId].playgrounds[playgroundId].theme = theme;
      localStorage.setItem('playground', JSON.stringify(state))

    },

    updateCode(state, action){
      const{
        code,
        folderId,
        playgroundId
      } = action.payload;
      state[folderId].playgrounds[playgroundId].code = code;
      localStorage.setItem('playground', JSON.stringify(state))
    },

    deleteItems(state, action){
      const{
        type,
        folderId,
        playgroundId
      } = action.payload;

      if(type == "deleteFolder"){
        delete state[folderId];
      }else if(type == "deleteCard"){
        delete state[folderId].playgrounds[playgroundId];
      }
      localStorage.setItem('playground', JSON.stringify(state))
    },
  },
})
export const { addFolder, addPlayground, addPlaygroundAndFolder,editTitles,deleteItems,updateTheme,updateCode } = playgroundSlicer.actions

export const selectCurrentPlayground = (state) => state.playground;

export default playgroundSlicer;