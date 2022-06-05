import { Component } from "react"; 
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDoc, doc } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyADJj5Zx2HR1AZp_ZxojVASXRva0Kmxdmc",
    authDomain: "find-skorulis.firebaseapp.com",
    projectId: "find-skorulis",
    storageBucket: "find-skorulis.appspot.com",
    messagingSenderId: "1030629674057",
    appId: "1:1030629674057:web:b47ddef5714cd22fa88398"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);



type MapComponentState = {
    lat?: number
    lng?: number
}

export class MapComponent extends Component<{}, MapComponentState> {

    constructor(props: {}) {
        super(props);
        this.state = {}

    }

    render() {
        return <div>
            <p>No location</p>
        </div>
    }

    async componentDidMount() {
        try {
            const docRef = doc(db, "location", "skorulis");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              console.log("Document data:", docSnap.data());
            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
            }
          } catch(e) {
            console.log("MAP ERROR")
            console.log(e)
          }
    }
    
}