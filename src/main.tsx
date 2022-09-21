import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import firebaseConfig from "../firebase.js";
import firebase from "firebase/compat/app"
import "firebase/compat/database"
import './index.css'

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.database();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
