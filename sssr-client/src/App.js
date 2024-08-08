import logo from './logo.svg';
import './App.css';
import React, { Suspense } from 'react';
import { lazy } from 'react';

const HomeComponent = lazy(() => import("./home"));

const LoadingScreen = () => <div>...Loading Screen</div>;

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <div>Home Content</div>
      <HomeComponent />
    </Suspense>
  );
}

export default App;
