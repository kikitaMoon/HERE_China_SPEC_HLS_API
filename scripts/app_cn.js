// credentials for China Spec HLS
app_id = 'eiiOSpnkukjatKeR2912'
app_code = 'dophzZtVT2m0KYqyk3uZag'

// ### BASIC MAP SETUP
// Get Map Container Element
var mapContainer = document.getElementById('map-container')

// Your China Spec APPID & APPCODE applied 
var platform_cn = new H.service.Platform({
  app_id: app_id ,
  app_code: app_code
})

// Displaying a Basic Map, Create Defaulr Layer
var defaultLayers = platform_cn.createDefaultLayers()

// Instantiate a map with Map Center and Zoom Level 
var map = new H.Map(
  mapContainer,
  defaultLayers.normal.map, {
    zoom: 10,
    center: { // position of Berlin
      lat: 52.5,
      lng: 13.4
    }
  }
)

var ui = H.ui.UI.createDefault(map, defaultLayers)

// Interacting with the map, at least move around and zoom in / out
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map))

// Set Event Listener to Make Map React Properly
window.addEventListener('resize', function () {
  map.getViewPort().resize()
})

// ----------------------------------------------------------------
// ### POSITIONING
// function HLS REST API
var wlanList = {
  'wlan': [{
    'mac': '0a-69-6c-0c-08-c2'
  },
    {
      'mac': '06-69-6c-0c-08-c2'
    },
    {
      'mac': '18-31-bf-ab-10-b4'
    },
    {
      'mac': '30-b4-9e-5c-38-3d'
    },
    {
      'mac': '94-d9-b3-e2-ce-c6'
    },
    {
      'mac': '98-e7-f4-7b-05-ec'
    },
    {
      'mac': '2a-9c-67-b8-da-ad'
    },
    {
      'mac': '94-d9-b3-e2-cf-a0'
    },
    {
      'mac': 'c8-d7-19-de-5b-e3'
    },
    {
      'mac': '10-62-e5-bd-15-27'
    },
    {
      'mac': '02-18-1a-79-31-a9'
    },
    {
      'mac': '0c-d8-6c-9f-1e-80'
    },
    {
      'mac': 'a8-6b-ad-48-c3-2e'
    },
    {
      'mac': '2a-9c-67-b8-de-37'
    },
    {
      'mac': '18-31-bf-ab-10-b0'
    },
    {
      'mac': '88-75-56-6f-73-a0'
    }

  ]
}

function WifiPositioning (wlanList) {
  var pURL = 'https://pos.api.here.com/positioning/v1/locate?app_id='+app_id+'&app_code='+app_code
  $.ajax({
    type: 'POST',
    url: pURL,
    contentType: 'application/json',
    data: JSON.stringify(wlanList),
    success: function (data, status) {
      console.log(data)
      console.log(data.location.lat)
      console.log(data.location.lng)

      var coordinates = {
        lat: data.location.lat,
        lng: data.location.lng
      }
      var iconUrl = './images/positioning.png'
      var iconOptions = {
        size: new H.math.Size(15, 15),
        anchor: new H.math.Point(0, 0)
      }
      var markerOptions = {
        icon: new H.map.Icon(iconUrl, iconOptions)
      }
      var marker = new H.map.Marker(coordinates, markerOptions)
      map.addObject(marker)
      map.setCenter(coordinates)
    }

  })
}

WifiPositioning(wlanList)

// ----------------------------------------------------------
// ### GEOLOCAION
// Acquire a user's location once via Browser
var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
}

function success (pos) {
  var crd = pos.coords
  console.log('Your current position is:')
  console.log(`Latitude : ${crd.latitude}`)
  console.log(`Longitude: ${crd.longitude}`)
  console.log(`More or less ${crd.accuracy} meters.`)
}

function error (err) {
  console.warn(`ERROR(${err.code}): ${err.message}`)
}
// get Current Position
navigator.geolocation.getCurrentPosition(success, error, options)

// WatchPosition call every time the position of the device changes
function updatePosition (event) {
  var coordinates = {
    lat: event.coords.latitude,
    lng: event.coords.longitude
  }
  var iconUrl = './images/location.png'
  var iconOptions = {
    size: new H.math.Size(15, 15),
    anchor: new H.math.Point(0, 0)
  }
  var markerOptions = {
    icon: new H.map.Icon(iconUrl, iconOptions)
  }
  var marker = new H.map.Marker(coordinates, markerOptions)
  map.addObject(marker)
  map.setCenter(coordinates)
}

watchID = navigator.geolocation.watchPosition(updatePosition)

// clearWatch to stop watching for location updates 
// navigator.geolocation.clearWatch(watchID)
