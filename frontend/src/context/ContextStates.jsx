import { memo } from 'react';
import Context from './context';
import useCombineState from './combineStates';

const ContextStates = (props) => {
  const combineStates = useCombineState();
  return <Context.Provider value={combineStates}>{props.children}</Context.Provider>;
};

export default memo(ContextStates);
