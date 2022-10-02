// import logo from './logo.svg';
import './App.css';
import { Viewer, Entity, Scene, Camera, Globe } from "resium";
import {useState, useEffect, Component} from 'react';
import { Cartesian3, Cartesian2, Cartesian4, GeographicProjection, WebMercatorProjection, Ellipsoid, Cartographic } from "cesium";

// let position = GeographicProjection.project(
//     WebMercatorProjection(
//       Ellipsoid.fromCartesian3(Cartesian3.fromDegrees(6.5286646892254225, 3.3577360143854906, 100))
//     ).unproject()
//   );
// let position = new WebMercatorProjection()
// this is wrong
// position = Cartographic.toCartesian(position.unproject(Cartesian3.fromDegrees(33.983629529227144, -117.74824130104183, 0)));
let position = Cartesian3.fromDegrees(6.5286646892254225, 3.3577360143854906, 100)

console.log(position)
// let test = GeographicProjection.project(position)
const pointGraphics = { pixelSize: 10 };

// function App() {
//   const [issPos, setIssPos] = useEffect({});
//   const getCurrentIssPosition = async () => {
//     try {
//       const response = await fetch(
//         'http://api.open-notify.org/iss-now.json'
//       );
//       const json = await response.json();
//       setIssPos(json["iss_position"]);
//     } catch (error) {
//       console.error(error);
//     }
//   };
  
  

//   getCurrentIssPosition()
//   // console.log(issPos)

//   return (
//     <Viewer full>
//       <Entity position={Cartesian3.fromDegrees(issPos.latitude, issPos.longitude, 100)} point={pointGraphics} name="International Space Station" description={"hi"} />
//     </Viewer>
//   )


// }

class App extends Component {
  constructor() {
    super();
    this.state = {issPos: {latitude: 0, longitude: 0}};
    this.last_updated = 0;
  }

  
  getCurrentIssPosition = async () => {
    try {
      // console.log("CURRENT TIME:", Date.now(), "PREVIOUS TIME:",this.last_updated)
      if (Date.now() - this.last_updated >1000) {
        const response = await fetch(
          'http://api.open-notify.org/iss-now.json'
        );
        const json = await response.json();
        
        this.setState({issPos: json["iss_position"]});
        this.last_updated = Date.now();
        // console.log(this.last_updated, json["iss_position"])
      }
    } catch (error) {
      console.error(error);
    }

    setTimeout(this.getCurrentIssPosition, 1)
  };
  
  render() {
    this.getCurrentIssPosition();

    const { issPos } = this.state;
    let lat = Number(issPos.latitude)
    let long = Number(issPos.longitude)
    console.log(lat, long)
    return (
      <Viewer full>
        <Scene />
        <Globe />
        <Camera />
        <Entity position={Cartesian3.fromDegrees(long, lat, 418000)} point={pointGraphics} name="International Space Station" description={"hi"} />
        {/* <Entity position={Cartesian3.fromDegrees(long, lat, 0)} point={pointGraphics} name="Ground Position" description={"hi"} /> */}

      </Viewer>
    );
  }
}


console.log(Math.floor(Date.now()/1000))
export default App;
