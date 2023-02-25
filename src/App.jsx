import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import {Code} from 'react-content-loader'

const Home = React.lazy(() => import('./pages/Home') );
const Playground = React.lazy(()=> import('./pages/Playground'))
const Notfound = React.lazy(()=> import('./pages/Notfound'));

function App() {
  return (
    <BrowserRouter>
      <React.Suspense fallback={
        <div className="p-3">
          <Code/>
          <Code/>
          <Code/>
          <Code/>
        </div>
        }>
       <Routes>
         <Route path="/" element={<Home/>}/>
         <Route path="/playground/:folderId/:playgroundId" element={<Playground/>}/>
         <Route path="*" element={<Notfound/>}/>
       </Routes>
     </React.Suspense>
    </BrowserRouter>
  )
}

export default App
