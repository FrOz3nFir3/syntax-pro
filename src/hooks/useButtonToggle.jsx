import { useCallback, useState } from 'react';

const initial = {
  clicked:false,
  type:null
}
export const useButtonToggle = (initialState = initial) => {
  // Initialize the state
  const [state, setState] = useState(initialState);

  function changeState(newState = {}) {
    if(newState.type === undefined){
      setState(initialState)
    }else{
      setState(newState)
    }
  }

  return [state, changeState]
}