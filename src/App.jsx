import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import PageTransition from "./components/ui/PageTransition";
import createLazyPage from "./components/ui/LazyPageWrapper";

// Lazy loaded pages with custom skeletons
const Landing = createLazyPage(() => import("./pages/Landing"), "landing");
const Playgrounds = createLazyPage(
  () => import("./pages/Playgrounds"),
  "playgrounds"
);
const EnhancedPlayground = createLazyPage(
  () => import("./pages/EnhancedPlayground"),
  "playground"
);
const Notfound = createLazyPage(() => import("./pages/Notfound"), "notfound");

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <PageTransition transitionType="FADE">
                <Landing />
              </PageTransition>
            }
          />
          <Route
            path="/playgrounds"
            element={
              <PageTransition transitionType="FADE">
                <Playgrounds />
              </PageTransition>
            }
          />
          <Route
            path="/playground/:folderId/:playgroundId"
            element={
              <PageTransition transitionType="SLIDE">
                <EnhancedPlayground />
              </PageTransition>
            }
          />
          <Route
            path="*"
            element={
              <PageTransition transitionType="SCALE">
                <Notfound />
              </PageTransition>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
