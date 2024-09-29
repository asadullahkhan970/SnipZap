import { Box, Container } from "@chakra-ui/react";
import { Routes, Route, Navigate,useLocation } from 'react-router-dom';
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import Header from './component/Header';
import Comment from "./component/Comment";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./component/CreatePost";
import ChatPage from "./pages/ChatPage";
import {SettingsPage} from "./pages/SettingsPage";

function App() {
  const user = useRecoilValue(userAtom);
  const {pathname} = useLocation();
  return (
    <Box position={"relative"} w={"full"}>
    <Container maxW={pathname === "/" ? {base:"620px",md:"900px"}: '620px'}>
      <Header />
      <Routes>
        <Route path="/" element={user ? <HomePage /> : <Navigate to='/auth' />} />
        <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to='/' />} />
        <Route path="/update" element={user ? <UpdateProfilePage /> : <Navigate to='/auth' />} />

        {/* Order the routes correctly */}
        <Route path="/:username/post/:pid" element={<PostPage />} />
        <Route path="/:username" element={user ? (
          <>
            <UserPage />
            <CreatePost />
          </>
        ) : (
          <UserPage />
        )} />

        <Route path="/comment" element={user ? <Comment /> : <Navigate to='/auth' />} />
        <Route path="/chat" element={user ? <ChatPage /> : <Navigate to='/auth' />} />
        <Route path="/settings" element={user ? <SettingsPage /> : <Navigate to='/auth' />} />
      </Routes>


      {/* Logout button is only shown when user is logged in */}
    </Container>
    </Box>
  );
}

export default App;
