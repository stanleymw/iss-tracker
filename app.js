// Your access token can be found at: https://cesium.com/ion/tokens.
// Replace `your_access_token` with your Cesium ion access token.
console.log("we love fotnite")
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzYWM1OWFiYy1kYWY0LTQzZWMtYjhlMi0xZjNhOTcyM2UzZDQiLCJpZCI6MTA5ODczLCJpYXQiOjE2NjQ2Njg2NzB9.1eB8sr4t44U6BmM4F_19IQVdVLOZEXS10gw-y47LB2I';

// Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
const viewer = new Cesium.Viewer('cesiumContainer', {
    terrainProvider: Cesium.createWorldTerrain()
});    
// Add Cesium OSM Buildings, a global 3D buildings layer.
const buildingTileset = viewer.scene.primitives.add(Cesium.createOsmBuildings());  
// Fly the camera to San Francisco at the given longitude, latitude, and height.
viewer.camera.flyTo({
    destination : Cesium.Cartesian3.fromDegrees(-122.4175, 37.655, 400),
    orientation : {
    heading : Cesium.Math.toRadians(0.0),
    pitch : Cesium.Math.toRadians(-15.0),
    }
});

// const dataPoint = { longitude: -122.38985, latitude: 37.61864, height: -27.32 };
// Mark this location with a red point.

function createEntity(longitude, latitude, height, name, description) {
    let pointEntity = viewer.entities.add({
        name: name,
        description: description,
        position: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
        point: { pixelSize: 10, color: Cesium.Color.RED }
    });
    return pointEntity;
}
// Fly the camera to this point.


const tleLine1 = '1 25544U 98067A   22274.89635759 -.00065216  00000-0 -11607-2 0  9998',
    tleLine2 = '2 25544  51.6407 167.9021 0003213 257.6590 179.5260 15.49594169361737';    
let satrec = satellite.twoline2satrec(tleLine1, tleLine2);
// const current_unix_time = Date.now()
// let now = new Date(current_unix_time)

// //  Propagate satellite using time since epoch (in minutes).
// var positionAndVelocity = satellite.propagate(satrec, now);
// // The position_velocity result is a key-value pair of ECI coordinates.
// const gmst = satellite.gstime(now);
// const position = satellite.eciToGeodetic(positionAndVelocity.position, gmst);
// // These are the base results from which all other coordinates are derived.
// var longitudeDeg = satellite.degreesLong(position.longitude),
//     latitudeDeg  = satellite.degreesLat(position.latitude);
// console.log(longitudeDeg, latitudeDeg, position.height, position)
let iss = createEntity(0, 0, 0, "International Space Station", `Space Station`)
// let iss = viewer.entities.add({
//         name: 'asdasdsad',
//         description: 'test2',
//         position: Cesium.Cartesian3.fromDegrees(longitudeDeg, latitudeDeg, position.height),
//         point: { pixelSize: 10, color: Cesium.Color.RED }
//     });

let set = false;

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function startPropagator() {
    while (true) {
        let now = new Date(Date.now());
        let i_gmst = satellite.gstime(now);
        var positionAndVelocity = satellite.propagate(satrec, now);
        // The position_velocity result is a key-value pair of ECI coordinates.
        const position = satellite.eciToGeodetic(positionAndVelocity.position, i_gmst);
        // We need to convert to degrees in order to display it on the globe. 
        let longitudeDeg = satellite.degreesLong(position.longitude),
            latitudeDeg  = satellite.degreesLat(position.latitude);
        // console.log(longitudeDeg, latitudeDeg, position.height, position)
        iss.position = Cesium.Cartesian3.fromDegrees(longitudeDeg, latitudeDeg, position.height)
        if (!set) {
            viewer.flyTo(iss)
            set = true;
        }
        
        // console.log("MODIFIED ENTITY",iss)
        await sleep(1)
    }
}

async function loadIssModel() {
    const modelUri = await Cesium.IonResource.fromAssetId("1340387");
    iss.model = {uri: modelUri,minimumPixelSize: 100}
}
startPropagator();
loadIssModel();