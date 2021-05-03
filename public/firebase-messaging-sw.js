importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
    apiKey: "AIzaSyAF7BXTU6n2A8-J33Cdu9KNPx2VPKg5loU",
    authDomain: "fpc-mobile-49e3b.firebaseapp.com",
    projectId: "fpc-mobile-49e3b",
    storageBucket: "fpc-mobile-49e3b.appspot.com",
    messagingSenderId: "380655983645",
    appId: "1:380655983645:web:6f681a4a992284bffefaf4",
    measurementId: "G-K0NX4H1ZZH"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
    const promiseChain = clients
        .matchAll({
            type: "window",
            includeUncontrolled: true,
        })
        .then((windowClients) => {
            for (let i = 0; i < windowClients.length; i++) {
                const windowClient = windowClients[i];
                windowClient.postMessage(payload);
            }
        })
        .then(() => {
            return registration.showNotification("my notification title");
        });
    return promiseChain;
});
self.addEventListener("notificationclick", function (event) {
    console.log(event);
});