import { useEffect } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import allRoutesMapper from './routes';
import { Toaster } from 'react-hot-toast';
import MetaData from './utils/MetaData';
import ChatComponent from './views/features/chats/ChatComponent';
import moment from 'moment-timezone';
import useSocket from './hooks/useSocket';
import { useSelector } from 'react-redux';
import { ADMIN } from './constants/roles.constants';

const OtherComponents = () => {
  const mode = import.meta.env.VITE_DEVELOPMENT_MODE || 'development';
  return (
    <>
      <Toaster />
      <ChatComponent />
    </>
  );
};

function App() {
  const { profileDetails } = useSelector((state) => state.userProfileState);
  const { isConnected, socketRef } = useSocket({
    dependencies: [profileDetails?.role],
    isAdmin: profileDetails?.role === ADMIN ? true : false,
    profileDetails,
  });
  useEffect(() => {
    moment.tz.setDefault('Asia/Kolkata');
  }, []);
  return (
    <div className="app">
      <MetaData />
      <BrowserRouter>
        <Routes>
          {allRoutesMapper?.map((singleRoute, index) => (
            <Route key={index} path={singleRoute?.path} element={singleRoute?.component} />
          ))}
        </Routes>
      </BrowserRouter>

      <OtherComponents />
    </div>
  );
}

export default App;
