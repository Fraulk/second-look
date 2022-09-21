#!/bin/bash

if [[ -f firebase.js ]] ; then rm firebase.js ; fi

## then build the file one line at a time:

echo "const firebaseConfig = {" >> firebase.js
echo "  apiKey: \"${apiKey}\"," >> firebase.js
echo "  authDomain: \"${authDomain}\"," >> firebase.js
echo "  databaseURL: \"${databaseURL}\"," >> firebase.js
echo "  projectId: \"${projectId}\"," >> firebase.js
echo "  storageBucket: \"${storageBucket}\"," >> firebase.js
echo "  messagingSenderId: \"${messagingSenderId}\"," >> firebase.js
echo "  appId: \"${appId}\"," >> firebase.js
echo "};" >> firebase.js
echo "export default firebaseConfig" >> firebase.js