import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";

const Home = React.lazy(() => import('./pages/Home') );
const Playground = React.lazy(()=> import('./pages/Playground'))
const Notfound = React.lazy(()=> import('./pages/Notfound'));

function App() {
  return (
    <BrowserRouter>
      <React.Suspense fallback={<p>loading....</p>}>
       <Routes>
         <Route path="/" element={<Home/>}/>
         <Route path="/playground/:folderID/:playgroundID" element={<Playground/>}/>
         <Route path="*" element={<Notfound/>}/>
       </Routes>
     </React.Suspense>
    </BrowserRouter>
  )
}

export default App
