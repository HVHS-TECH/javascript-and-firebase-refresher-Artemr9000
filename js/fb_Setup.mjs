

/**************************************************************/
// fb_io.mjs
// Firebase I/O operations for 13COMP 2025 project
// Written by Artem Rakhimov, Term 1 2025
//
// All letiables & functions begin with fb_, all const with FB_
// Diagnostic code lines have a comment appended to them //DIAG
/**************************************************************/
const COL_C = 'white';      // Console log text color
const COL_B = '#CD7F32';    // Console log background color
console.log('%c fb_io.mjs', 'color: blue; background-color: white;');

// Global variables
let fb_gamedb;              // Firebase Realtime Database instance
let userdetails = {         // User info object
    displayName: 'n/a',
    email: 'n/a',
    photo: 'n/a',
    uid: 'n/a'
};

let fb_dataArray = [,]
/**************************************************************/
// Import all external constants & functions required
/**************************************************************/
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, get, update} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
/**************************************************************/
// INITIALISE FUNCTION
// Initializes Firebase using the given config and connects to 
// the Realtime Database. Logs the database object to the console.
/**************************************************************/
export function fb_initialise() {
    console.log('%c fb_initialise(): ', 'color: ' + COL_C + '; background-color: ' + COL_B + ';');

  const FB_GAMECONFIG = {
  apiKey: "AIzaSyCJJ8-ZerBC53qhRMzinJiPty2vk9tSsKc",
  authDomain: "artem-rakhimov-13comp-c7551.firebaseapp.com",
  databaseURL: "https://artem-rakhimov-13comp-c7551-default-rtdb.firebaseio.com",
  projectId: "artem-rakhimov-13comp-c7551",
  storageBucket: "artem-rakhimov-13comp-c7551.firebasestorage.app",
  messagingSenderId: "902104968011",
  appId: "1:902104968011:web:2cf4178eeb8c04428796ce"
  };


    const FB_GAMEAPP = initializeApp(FB_GAMECONFIG);
    fb_gamedb = getDatabase(FB_GAMEAPP);
    console.info('Firebase initialized:', fb_gamedb); //DIAG
}

/**************************************************************/
// fb_login()
// Called by html LOGIN button
// Login to Firebase via Google authentication
// Input:  n/a
// Return: n/a
/**************************************************************/
export function fb_login() {
    console.log('%c fb_login(): ', 'color: ' + COL_C + '; background-color: ' + COL_B + ';');

    const AUTH = getAuth();
    const PROVIDER = new GoogleAuthProvider();

    PROVIDER.setCustomParameters({
        prompt: 'select_account'
    });

    signInWithPopup(AUTH, PROVIDER)
        .then((result) => {
            // Update userdetails
            userdetails.displayName = result.user.displayName;
            userdetails.email = result.user.email;
            userdetails.photo = result.user.photoURL;
            userdetails.uid = result.user.uid;
            console.log('Logged in user:', userdetails); //DIAG
            fb_initialise();
            fb_write();
        })
        .catch((error) => {
            console.log(error); //DIAG
           
        });
}

/**************************************************************/
// fb_onAuthStateChanged()
// Called by html AUTH STATE button
// Detects changes in Firebase authentication state
// Input:  n/a
// Return: n/a
/**************************************************************/
export function fb_onAuthStateChanged() {
    console.log('%c fb_onAuthStateChanged(): ', 'color: ' + COL_C + '; background-color: ' + COL_B + ';');

    const AUTH = getAuth();
    onAuthStateChanged(AUTH, (user) => {
        const statusElement = document.getElementById('p_fbLogin');
        if (user) {
            // User is logged in
            userdetails.displayName = user.displayName || 'n/a';
            userdetails.email = user.email || 'n/a';
            userdetails.photo = user.photoURL || 'n/a';
            userdetails.uid = user.uid || 'n/a';
            statusElement.textContent = `Logged in as: ${user.email} (UID: ${user.uid})`;
            console.log('Auth state: Logged in', userdetails); //DIAG
        } else {
            // User is logged out
            userdetails = { displayName: 'n/a', email: 'n/a', photo: 'n/a', uid: 'n/a' };
            statusElement.textContent = 'No user is logged in';
            console.log('Auth state: Logged out'); //DIAG
        }
    }, (error) => {
        console.log(error); //DIAG
        document.getElementById('p_fbLogin').textContent = `Auth state error: ${error.message}`; //DIAG
    });
}

/**************************************************************/
// fb_logout()
// Called by html LOGOUT button
// Logs out the current user from Firebase
// Input:  n/a
// Return: n/a
/**************************************************************/
export function fb_logout() {
    console.log('%c fb_logout(): ', 'color: ' + COL_C + '; background-color: ' + COL_B + ';');

    const AUTH = getAuth();
    signOut(AUTH)
        .then(() => {
            // Reset userdetails
            userdetails = { displayName: 'n/a', email: 'n/a', photo: 'n/a', uid: 'n/a' };
            document.getElementById('p_fbLogin').textContent = 'Logged out successfully'; //DIAG
            console.log('User logged out successfully'); //DIAG
        })
        .catch((error) => {
            console.log(error); //DIAG
            document.getElementById('p_fbLogin').textContent = `Logout error: ${error.message}`; //DIAG
        });
}

/**************************************************************/
// fb_write()
// Called by html WRITE RECORD button
// Writes a record to Firebase Realtime Database
// Input:  n/a
// Return: n/a
/**************************************************************/
export function fb_write() {
    console.log('%c fb_write(): ',
        'color: ' + COL_C + '; background-color: ' + COL_B + ';');

    const path = 'userdetails/' + userdetails.uid;
    console.log('Database path:', path); //DIAG
    const dbRef = ref(fb_gamedb, path);
    set(dbRef, userdetails)
    .then(() => {
       
        console.log('%c fb_write(): OK',
        'color: ' + COL_C + '; background-color: ' + COL_B + ';');
    })
    .catch((error) => {
        console.log(error); //DIAG
       //DIAG
    });
}       

/**************************************************************/
// fb_read()
// Called by html READ RECORD button
// Read a record to Firebase Realtime Database
// Input:  n/a
// Return: n/a
/**************************************************************/
export function fb_read(){
    const path = 'userdetails/' + userdetails.uid;
    console.log(userdetails);
    console.log(fb_gamedb);
    const dbRef= ref(fb_gamedb, path);
    console.log(dbRef);
    get(dbRef).then((snapshot) => {

        let fb_data = snapshot.val();
if (fb_data != null) {
console.log(fb_data)
        } else {
        console.log("✅ Code for no record found goes here")   
        }

    }).catch((error) => {
console.log(error)
    });
}


//work either on start up or click of a button\\ 
fb_initialise();
window.fb_login = fb_login
window.fb_read = fb_read
