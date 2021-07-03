/*************************************************************/
/*             ServiceWorker Configurations File.            */
/*   Version-1.0.0||Stable version.||Author = Arif Sardar.   */
/*************************************************************/

window.onload = e =>{
      serviceWorker.config({});
      serviceWorker.register();
      serviceWorker.addInstallButton("install");
};

const publicVapidKey = "BELxfHwSbp4tWsnsbZPJuPOa7ddi5GYoL7XAJHHPlGBiHgj6IPEdamzRzhMjsBdw-5h-EA3e6W0HqYqrjEYXJTw";

var config;
const serviceWorker = {
      // Configration
      config : function(e){
            config = {
                  log : e.log || true,
            }
      },
      // Register ServiceWorker, Push Manager
      register : async function(){
            if(!"serviceWorker" in navigator){
                  print.error('Service Worker is not suported in your browser');
                  return;
            }
            print.log('Registering Service Worker ... ');
            const register = await navigator.serviceWorker.register("/sw.js", { // Register Service Worker
                  scope: "/"
            });
            print.log("Service Worker Registered...");

            // Register Push Manager.
            // Register Push
            print.log("Registering Push...");
            const subscription = await register.pushManager.subscribe({
                  userVisibleOnly: true,
                  applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
            });
            print.log("Push Registered...");

            // Send Push Notification
            print.log("Sending Push...");
            await fetch("/subscribe", {
                  method: "POST",
                  body: JSON.stringify(subscription),
                  headers: {
                        "content-type": "application/json"
                  }
            });
            print.log("Push Sent...");
      },

      // unregister the pre-registered serviceWorker.
      unregister : function(){
            navigator.serviceWorker.getRegistrations()
            .then(registrations => {
                  registrations.forEach(registration => {
                        registration.unregister();
                  });
            }).catch(err => {
                  print.error(err);
            });
      },

      // Add Install Button.
      addInstallButton : function(buttonId){
            let deferredPrompt;
            // Get The Button
            const button = document.querySelector(`#${buttonId}`);
            // Check The Button Exists
            if(!button){
                print.error(`Id ${buttonId} is not found`);
                return;
            }
            // Initially Hide The Button
            button.style.display = 'none';
            // event executes only if app is not installed
            window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();// prevent Default Action
                deferredPrompt = e;
                button.style.display = 'block';// show the button
                button.addEventListener('click', (e) => {
                    button.style.display = 'none';
                    deferredPrompt.prompt();
                    deferredPrompt.userChoice.then((choiceResult) => {
                        if (choiceResult.outcome === 'accepted') {
                            print.log('User accepted the A2HS prompt');
                        } else {
                            print.error('User dismissed the A2HS prompt');
                        }
                        deferredPrompt = null;
                    });
                });
            });
      },
};
// Console Handeler.
const print = {
      log : function(args){
            if(config.log){
                  console.log(args);
            }
      },
      error : function(args){
            if(config.log){
                  console.error(args);
            }
      },
};

// Convert Base64 to UTF-8
function urlBase64ToUint8Array(base64String) {
      const padding = "=".repeat((4 - base64String.length % 4) % 4);
      const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");
    
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
    
      for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
}