import "bootstrap/dist/css/bootstrap.min.css";
import styled from 'styled-components'

import {BrowserRouter, Routes, Route} from 'react-router-dom'


import Header from "./common/Header";
import Login from "./pages/Login";
import Main from "./pages/Main";

import Posts from "./pages/Posts/Posts";
import Technologies from "./pages/Technologies/Technologies";
import Projects from "./pages/Projects/Projects";

export const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export const ContentWrapper = styled.main`\
  margin-top: 60px;
  flex: 1;
`;

export default function App() {
  return (
    <BrowserRouter>
      <AppContainer>
        <Header />
        <ContentWrapper>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/technologies" element={<Technologies />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </ContentWrapper>
      </AppContainer>
    </BrowserRouter>
  );
}

