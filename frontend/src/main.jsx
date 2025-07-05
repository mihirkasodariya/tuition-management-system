import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { Provider } from 'react-redux';
import store from './redux/store.js';
import ContextStates from './context/ContextStates.jsx';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ContextStates>
      <App />
    </ContextStates>
  </Provider>
);
