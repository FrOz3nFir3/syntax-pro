import { configureStore } from "@reduxjs/toolkit";
import playgroundSlicer from "./slices/playgroundSlice";
import uiSlice from "./slices/uiSlice";

const reducer = {
  playground: playgroundSlicer.reducer,
  ui: uiSlice.reducer,
};
const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});
export default store;
