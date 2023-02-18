import { createSlice } from "@reduxjs/toolkit";

const languageMap = {
  cpp: {
    id: 54,
    defaultCode:
      "#include <iostream>\n" +
      "using namespace std;\n\n" +
      "int main() {\n" +
      '\tcout << "Hello World!";\n' +
      "\treturn 0;\n" +
      "}",
  },
  java: {
    id: 62,
    defaultCode: `public class Main {
            public static void main(String[] args) {
                System.out.println("Hello World!");
            }
    }`,
  },
  python: {
    id: 71,
    defaultCode: `print("Hello World")`,
  },
  javascript: {
    id: 63,
    defaultCode: `console.log("Hello World!")`,
  },
};

const initialState = {
  [crypto.randomUUID()]: {
    title: "DSA",
    playgrounds: {
      [crypto.randomUUID()]: {
        title: "Queue",
        language: "cpp",
        code: languageMap["cpp"].defaultCode,
      },
      [crypto.randomUUID()]: {
        title: "Array",
        language: "javascript",
        code: languageMap["javascript"].defaultCode,
      },
      [crypto.randomUUID()]: {
        title: "Stack ",
        language: "python",
        code: languageMap["python"].defaultCode,
      },
      [crypto.randomUUID()]: {
        title: "Fizzbuzz",
        language: "java",
        code: languageMap["java"].defaultCode,
      },
    },
  },
};

const playgroundSlicer = createSlice({
  name: "playground",
  initialState,
  reducers: {
    addFolder(state, action){
      const newFolder = action.payload;
      state[crypto.randomUUID()] = newFolder;
    },

    addPlayground(state, action){
      const {folderId, ...newPlayground} = action.payload;
      state[folderId].playgrounds[crypto.randomUUID()] = {
        ...newPlayground,
        code:languageMap[newPlayground.language].defaultCode
      }
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
            title:cardTitle,
            language,
            code: languageMap[language].defaultCode,
          }
        }
      }
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
    },
  },
})
export const { addFolder, addPlayground, addPlaygroundAndFolder,editTitles,deleteItems } = playgroundSlicer.actions

export const selectCurrentPlayground = (state) => state.playground;

export default playgroundSlicer;