#!/bin/bash

if [[ -f firebase.ts ]] ; then rm firebase.ts ; fi

## then build the file one line at a time:

echo "const firebaseConfig = {" >> firebase.ts
echo "  apiKey: \"${apiKey}\"," >> firebase.ts
echo "  authDomain: \"${authDomain}\"," >> firebase.ts
echo "  databaseURL: \"${databaseURL}\"," >> firebase.ts
echo "  projectId: \"${projectId}\"," >> firebase.ts
echo "  storageBucket: \"${storageBucket}\"," >> firebase.ts
echo "  messagingSenderId: \"${messagingSenderId}\"," >> firebase.ts
echo "  appId: \"${appId}\"," >> firebase.ts
echo "};" >> firebase.ts
echo "export default firebaseConfig" >> firebase.ts