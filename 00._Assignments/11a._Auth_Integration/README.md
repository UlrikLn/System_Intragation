Create a Firebase Project
    - Go to https://console.firebase.google.com
    - Click "Add Project"
    - In your Firebase project dashboard, go to Build → Authentication
    - Under Sign-in method, enable what ever you want. I chose email/password
    - Remember to register a Web App
    - Go to Project Settings
    - Scroll to "Your apps", click </> (Web)
    - Register the app
    - Copy the Firebase Config object it gives you – you’ll use it in your code

Copy my code and folder layout, remember to edit the serviceAccountKey.json to your own key
    - Go to Firebase Console → Project Settings → Service Accounts
    - Generate a new private key and copy it into serviceAccountKey.json