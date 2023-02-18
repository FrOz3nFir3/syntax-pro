import { configureStore } from "@reduxjs/toolkit";
import playgroundSlicer from "./slices/playgroundSlice";

const reducer = {
  playground:playgroundSlicer.reducer,
};
const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(),
});
export default store;