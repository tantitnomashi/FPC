import firebase from 'firebase/app';
import 'firebase/messaging';

var firebaseConfig = {
    apiKey: "AIzaSyAF7BXTU6n2A8-J33Cdu9KNPx2VPKg5loU",
    authDomain: "fpc-mobile-49e3b.firebaseapp.com",
    projectId: "fpc-mobile-49e3b",
    storageBucket: "fpc-mobile-49e3b.appspot.com",
    messagingSenderId: "380655983645",
    appId: "1:380655983645:web:6f681a4a992284bffefaf4",
    measurementId: "G-K0NX4H1ZZH"
};
const vapidKey = "BFWlbGm_VwrXhzYo3cFjNVRhySHd8Xj4_Kh71F26elUrlUv3ltySv97h3v8V3ofai0USrrYABGPYsvcpRY3m780"
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
const messaging = firebase.messaging(); messaging.getToken({ vapidKey: vapidKey }).then((currentToken) => {
    if (currentToken) {
        console.log('current token for client: ', currentToken);
        // setTokenFound(true);
        // Track the token -> client mapping, by sending to backend server
        // show on the UI that permission is secured
    } else {
        console.log('No registration token available. Request permission to generate one.');
        // setTokenFound(false);
        // shows on the UI that permission is required 
    }
}).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // catch error while creating client token
});
// export const getToken = (setTokenFound) => {
//     return 
// }
export const onMessageListener = () =>
    new Promise((resolve) => {
        messaging.onMessage((payload) => {
            resolve(payload);
        });
    });