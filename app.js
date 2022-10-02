Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzYWM1OWFiYy1kYWY0LTQzZWMtYjhlMi0xZjNhOTcyM2UzZDQiLCJpZCI6MTA5ODczLCJpYXQiOjE2NjQ2Njg2NzB9.1eB8sr4t44U6BmM4F_19IQVdVLOZEXS10gw-y47LB2I';

const viewer = new Cesium.Viewer('cesiumContainer', {
    terrainProvider: Cesium.createWorldTerrain()
});    
const buildingTileset = viewer.scene.primitives.add(Cesium.createOsmBuildings());  


function createEntity(longitude, latitude, height, name, description) {
    let pointEntity = viewer.entities.add({
        name: name,
        description: description,
        position: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
        point: { pixelSize: 2, color: Cesium.Color.BLUE }
    });
    return pointEntity;
}


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
        // height is in kilometers, so we have to convert it to meters
        iss.position = Cesium.Cartesian3.fromDegrees(longitudeDeg, latitudeDeg, position.height*1000)
        iss.description = `
            <h1>Information</h1>
            <p>Longitude: ${longitudeDeg} Degrees</p>
            <p>Latitude: ${latitudeDeg} Degrees</p>
            <p>Altitude: ${position.height} Kilometers</p>
        `
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
    iss.model = {uri: modelUri,minimumPixelSize: 50}
}
startPropagator();
loadIssModel();