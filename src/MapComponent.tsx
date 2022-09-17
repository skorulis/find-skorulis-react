
import { Component } from "react"; 
import { initializeApp } from 'firebase/app';
import { getFirestore, getDoc, doc } from "firebase/firestore";
import { Map } from "./Map";
import { Wrapper } from "@googlemaps/react-wrapper";
import { Marker } from "./Marker";
import moment from "moment";
import { Beer } from "./model/Beer";

function mapKey() {
    return "AIzaS" + "yBxpQJ4" + "7cFdtMlsbV" + "j-nYfTk9FPjusthPI";
}

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
    marker?: google.maps.LatLngLiteral
    center?: google.maps.LatLngLiteral
    zoom: number
    updated?: string
    beer?: Beer
}

export class MapComponent extends Component<{}, MapComponentState> {

    constructor(props: {}) {
        super(props);
        this.state = {zoom: 14, center: {lat: 0, lng: 0}}
        this.onIdle = this.onIdle.bind(this);
    }

    render() {
        return <Wrapper apiKey={mapKey()} >
            
        <Map
            center={this.state.center}
            onIdle={this.onIdle}
            zoom={this.state.zoom}
            style={{ flexGrow: "1", height: "100%" }}
        >
            <Marker position={this.state.marker} />
        </Map>
        <div style={{paddingLeft:16}}>
            {this.maybeUpdateTime()}
            {this.maybeCurrentBeer()}
        </div>
        </Wrapper>
    }

    maybeUpdateTime() {
        if (this.state.updated) {
            return <h2>Last updated: {this.state.updated} </h2>
        } else {
            return undefined
        }
    }

    maybeCurrentBeer() {
        let beer = this.state.beer
        if (!beer) {
            return
        }
        let current = moment();
        let time = moment(beer.date.seconds * 1000);
        let diff =  current.diff(time, "seconds")
        let maxTime = 3600 * 0.5
        if (diff > maxTime) {
            return
        }

        let pct = beer.pct.length > 0 ? `${beer.pct}%` : "";
        return <h2 >Currently drinking: {beer.name} {pct}</h2>
    }

    onIdle(m: google.maps.Map) {
        console.log("onIdle2");
        this.setState({zoom: m.getZoom(), center: m.getCenter().toJSON()})
      };

    maybeMap() {
        if (this.state.marker && this.state.center) {
            <Map
                center={this.state.center}
                onIdle={this.onIdle}
                zoom={this.state.zoom}
                style={{ flexGrow: "1", height: "100%" }}
            >
            
            </Map>
        } else {
            return <p>Finding skorulis</p>
        }
    }

    async componentDidMount() {
        this.loadLocation()
        this.loadBeer()
    }

    async loadLocation() {
        try {
            const docRef = doc(db, "location", "skorulis");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                let data = docSnap.data()
                let time = moment(data.date * 1000);
                let updated = time.fromNow()
                
                let pos: google.maps.LatLngLiteral =  {lat: data.lat, lng: data.lng}
                this.setState({center: pos, marker: pos, updated})
            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
            }
          } catch(e) {
            console.log("MAP ERROR")
            console.log(e)
          }
    }

    async loadBeer() {
        try {
            const docRef = doc(db, "beers", "skorulis");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                let data = docSnap.data();
                let beer: Beer = data as Beer
                console.log("Got a beer: ")
                console.log(beer);
                this.setState({beer})
            } else {
                console.log("No beer to find")
            }
        } catch(e) {
            console.log(e)
        }
    }
    
}