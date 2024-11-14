	mapboxgl.accessToken = mapToken;

    // const map = new mapboxgl.Map({
    //     container: 'map', // container ID
    //     center: maplisting.geometry.coordinates , // starting position [lng, lat]. Note that lat must be set between -90 and 90
    //     zoom: 9 // starting zoom
    // });
    console.log('Coordinates:', maplisting.geometry.coordinates);

    if (Array.isArray(maplisting.geometry.coordinates) && maplisting.geometry.coordinates.length === 2) {
        const [lng, lat] = maplisting.geometry.coordinates;
    
        if (lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90) {
            // Proceed if coordinates are valid
            const map = new mapboxgl.Map({
                container: 'map', // container ID
                center: [lng, lat], // Ensure correct [lng, lat] format
                zoom: 9 // starting zoom
            });

            // Create a default Marker and add it to the map.
            const marker1 = new mapboxgl.Marker({color: "red"})
                .setLngLat(maplisting.geometry.coordinates)
                .setPopup(new mapboxgl.Popup({offset: 25})
                    .setHTML(
                        `<h4>${maplisting.location}</h4><p>Exact Location for booking</p>`
                    )
                )
            .addTo(map);
            } else {
        console.error('Invalid coordinates: longitude or latitude out of bounds');
    }
} else {
    console.error('Invalid coordinates: maplisting.geometry.coordinates should be [lng, lat]');
}
