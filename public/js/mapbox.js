/* eslint-disable */

const locations = JSON.parse(document.getElementById("map").dataset.locations);
mapboxgl.accessToken =
  "pk.eyJ1Ijoic2hqbmVldm4iLCJhIjoiY2w4MzdjdnlhMDNmaTN3azBqZTI1eHgwZiJ9.hq3n1akmQ218pON_NAv8DQ";
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/shjneevn/cl837glbg001p16s8hhl7f82d", // style URL
  scrollZoom: true,
  //   center: [-118, 34], // starting position [lng, lat]
  //   zoom: 4, // starting zoom
  //   interactive: false, // display scroll and zoom
  //   projection: "globe", // display the map as a 3D globe
});

const bounds = new mapboxgl.LngLatBounds();
locations.forEach((location) => {
  //Create maker
  const el = document.createElement("div");
  el.className = "marker";
  // Add marker
  new mapboxgl.Marker({
    element: el,
    anchor: "bottom",
  })
    .setLngLat(location.coordinates)
    .addTo(map);
  // Add Popup
  new mapboxgl.Popup({ offset: 30 })
    .setLngLat(location.coordinates)
    .setHTML(`<p>Day ${location.day} : ${location.description}</p>`)
    .addTo(map);
  //Extend map bounds to include current location
  bounds.extend(location.coordinates);
});
map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 200,
    left: 100,
    right: 100,
  },
});
map.on("style.load", () => {
  map.setFog({}); // Set the default atmosphere style
});
