// Client facing scripts here
let POINT_ID = 0;
$(() => {

  const loadMap = function() {
    const map = L.map('map', {
      doubleClickZoom: false}
      ).setView([49.262838, -122.781071], 16);
  
      return map;
  };
    
    const renderMap = function(map) {
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1IjoiZGtlbGw4OCIsImEiOiJjbDJ3Zm44NjMwZjVqM2RxY3gyN3J6dXJ2In0.SYE3QdtfFxH63YvUTI7FMA'
    }).addTo(map);
  
    const marker2 = L.marker([49.277, -122.78]).addTo(map);
   
    L.control.scale({
      metric: true,
      imperial: false,
      position: 'bottomright'
    }).addTo(map);
  };
  
  const map = loadMap();
  renderMap(map);

  function onMapClick(event) {
   
    if($('#pin-deets').is(":visible")){
      console.log("yes pin deeets is visible")
    } 
    if(!$('#pin-deets').is(":visible")){
      console.log("Nope pin deeets isn't visible")
      $('#pin-deets').show();
     
      const point = {
        mapId: 41,
        title: "",
        description: "",
        imageURL: "",
        latitude: event.latlng.lat,
        longitude: event.latlng.lng
      }
      // console.log(event.latlng);
      // console.log(point);

      //addPoint(point); 

       $.post('points/', point)
       .then(pointAdded => {
         console.log("point added to DB ", pointAdded)
         console.log("The pointAdded.id is: ",  pointAdded.id)
         POINT_ID = pointAdded.id;
         console.log("POINT_ID is now: ", POINT_ID)
       })
      //$.get('/points/');
    }
    
  };
  
  $('#pin-deets').submit(function(event) {
    console.log("Sumbitted");
    event.preventDefault();
    const kids = $(this).children();
    const pointToEdit = {
      title: $(kids[0]).val(),
      description: $(kids[1]).val(),
      imageURL: $(kids[2]).val()
    };


    if(!pointToEdit.title || !pointToEdit.description || !pointToEdit.imageURL) {
      return console.log("error missing a title, description, or image URL");
    }
    
    let markerPopup = `
      <section class = "pin-popus">
      <span>${pointToEdit.title}</span><br>
      <span>${pointToEdit.description}</span><br>
      <img src="${pointToEdit.imageURL}">
      </section>`
    //console.log(markerPopup);


    //$.get(`/points/${POINT_ID}`, pointToEdit)
    $.post(`/points/${POINT_ID}/edit`, pointToEdit)
    .then(point => {
      console.log("point returned after GET /points/:id: ", point)
      let marker = new L.marker([point.latitude, point.longitude]);
      marker.bindPopup(markerPopup).openPopup();
      map.addLayer(marker);
      $('#pin-deets').hide()
    })

  
  });

  map.on('click', onMapClick);

});
