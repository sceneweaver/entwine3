
import React, { Component } from 'react';
import ReactMapboxGl, { Layer, Feature, Marker } from 'react-mapbox-gl';
import secrets from '../../secrets.json';

let googleMapsClient = require('@google/maps').createClient({
  key: secrets.googlemaps
});

// googleMapsClient.geocode({ // this is for testing and demo purposes - shows how the geocode method works
//   address: 'Los Angeles'
// }, function(err, response) {
//   if (!err) {
//     console.log(response.json.results[0]);
//     console.log(response.json.results[0].geometry.location);
//   }
// });

/* ----- COMPONENT ----- */

class Map extends Component {
  constructor(props) {
    super(props)
    this.state = {
      coords: [],
      locationTypes: [],
      locationAddress: '',
      mapboxStyle: 'light',
      mapboxZoom: 13,
      mapboxPitch: 30,
      mapboxInteractivity: true,
      mapboxAnimationMethod: 'flyTo',
    }
    this.onFindCoordsClick = this.onFindCoordsClick.bind(this);
    this.findCoordinates = this.findCoordinates.bind(this);
    this.changeMapboxStyle = this.changeMapboxStyle.bind(this);
    this.changeMapboxZoom = this.changeMapboxZoom.bind(this);
  }

  // componentDidMount() {
  //    var reactMapString = "<ReactMapboxGl style={`mapbox://styles/mapbox/$style-v9`} accessToken='pk.eyJ1IjoiZm91cmVzdGZpcmUiLCJhIjoiY2oyY2VnbTN2MDJrYTMzbzgxNGV0OWFvdyJ9.whTLmuoah_lfoQhC_abI5w' zoom=$zoom center=$coords containerStyle={{ height: '500px', width: 'auto' }}> <div> <Layer type='symbol' id='marker' layout={{ 'icon-image': 'marker-15' }}> <Feature coordinate $coords /> </Layer>  <Marker coordinates=$coords anchor='bottom' </Marker> </div>  </ReactMapboxGl>"
  // }


  findCoordinates(location) {
    googleMapsClient.geocode({
      address: location
    }, (err, response) => {
      if (!err) {
        let results = response.json.results[0]
          , coords = results.geometry.location
          , style, zoom;

        // if location type includes park or natural_feature, use 'outdoors' map
        // https://developers.google.com/places/supported_types
        if (results.types.includes('natural_feature') || results.types.includes('park')) {
          style = 'outdoors';
          zoom = 5;
        } else {
          style = 'light';
        }

        // if location type includes
        if (results.types.includes('country')) zoom = 3;
        else if (results.types.includes('administrative_area_level_1')) zoom = 5;
        else if (results.types.includes('administrative_area_level_2')) zoom = 7;
        else if (results.types.includes('administrative_area_level_3')) zoom = 8;
        else zoom = 13;

        // google gives an object {lat: x, lng: y} -> reactmapboxgl takes it in the form of [lng, lat]
        this.setState({
          coords: [coords.lng, coords.lat],
          locationAddress: results.formatted_address,
          locationTypes: results.types,
          mapboxStyle: style,
          mapboxZoom: zoom,
        });
      }
    });
  }

  onFindCoordsClick(event) {
    event.preventDefault();
    this.findCoordinates(event.target.location.value);
  }

  changeMapboxStyle(event) {
    event.preventDefault();
    this.setState({ mapboxStyle: event.target.value })
  }

  changeMapboxZoom(event) {
    event.preventDefault();
    this.setState({ mapboxZoom: event.target.value })
  }


  render() {
     var reactMapString = "<ReactMapboxGl style={`mapbox://styles/mapbox/replaceStyle-v9`} accessToken='pk.eyJ1IjoiZm91cmVzdGZpcmUiLCJhIjoiY2oyY2VnbTN2MDJrYTMzbzgxNGV0OWFvdyJ9.whTLmuoah_lfoQhC_abI5w' zoom=replaceZoom center=replaceCoords containerStyle={{ height: '500px', width: 'auto' }}> <div> <Layer type='symbol' id='marker' layout={{ 'icon-image': 'marker-15' }}> <Feature coordinates=replaceCoords /> </Layer>  <Marker coordinates=replaceCoords anchor='bottom' </Marker> </div>  </ReactMapboxGl>"
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h2> Map Creator </h2>

            <b> Map Style: &nbsp; </b>
            <select value={this.state.mapboxStyle} onChange={this.changeMapboxStyle}>
              <option value="basic">Basic</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="outdoors">Outdoors</option>
              <option value="satellite">Satellite</option>
            </select>

            <b> Map Zoom: &nbsp; </b>
            <select value={this.state.mapboxZoom} onChange={this.changeMapboxZoom}>
              <option value="1">1</option>
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="7">7</option>
              <option value="9">9</option>
              <option value="11">11</option>
              <option value="13">13</option>
              <option value="15">15</option>
              <option value="17">17</option>
              <option value="19">19</option>
            </select>


          </div>
          <div className="col-md-8">
          {
                this.props.locations[0] ?
            <div>
                <ReactMapboxGl
              style={`mapbox://styles/mapbox/${this.state.mapboxStyle}-v9`}
              accessToken="pk.eyJ1IjoiZm91cmVzdGZpcmUiLCJhIjoiY2oyY2VnbTN2MDJrYTMzbzgxNGV0OWFvdyJ9.whTLmuoah_lfoQhC_abI5w"
              zoom={[this.state.mapboxZoom]}
              pitch={this.state.mapboxPitch}
              center={this.props.locations[0].coords}
              movingMethod={this.state.mapboxAnimationMethod} // animation style; default 'flyTo'
              interactive="true" // if false, map cannot be manipulated
              containerStyle={{
                height: "500px",
                width: "auto"
              }}>

                    <div>
                        <Layer
                          type="symbol"
                          id="marker"
                          layout={{ "icon-image": "marker-15" }}>
                        <Feature coordinates={this.props.locations[0].coords} />
                        </Layer>
                        <Marker
                          coordinates={this.props.locations[0].coords}
                          anchor="bottom">
                        </Marker>
                      </div>
                      </ReactMapboxGl>
                      <button onClick={this.props.onSaveMap.bind(this, this.props.position, reactMapString, this.state.mapboxStyle, this.props.locations[0].coords, this.state.mapboxZoom)}>Save Map</button>
                      </div>
                      : <h2> nothing here</h2>

              }



          </div>
        </div>
      </div>
    );
  }
}

/* ----- CONTAINER ----- */
import {setMap} from '../reducers/editor';

const mapStateToProps = (state, ownProps) => ({
  locations: state.editor.scenes[ownProps.position].locations,
  position: ownProps.position,
  maps: state.editor.scenes[ownProps.position].maps
});

const mapDispatchToProps = (dispatch) => ({
  onSaveMap(position, reactMapString, style, coords, zoom) {
    coords = '[' + coords.join(', ') + ']'
    let string = reactMapString.replace(/replaceStyle/g, style).replace(/replaceCoords/g, coords).replace(/replaceZoom/g, zoom);
    dispatch(setMap(position, string));
  }
})


import { connect } from 'react-redux';

export default connect(mapStateToProps, mapDispatchToProps)(Map);



              // {
              //   (this.props.locations.length > 0) ?
              //     (this.props.locations.map(location => {
              //       console.log(this.props.locations.length, " NAME ", location.coords)
              //       return (
              //         <div key={location.coords[0]}>
              //           <Layer
              //             type="symbol"
              //             id="marker"
              //             layout={{ "icon-image": "marker-15" }}>
              //           <Feature coordinates={location.coords} />
              //           </Layer>
              //           <Marker
              //             coordinates={location.coords}
              //             anchor="bottom">
              //           </Marker>
              //         </div>
              //       );
              //     }))
              //     : <div style={{ backgroundColor: 'lightgrey', height: 500, width: 'auto', justifyContent: 'center', alignItems: 'center', display: 'flex', fontSize: 20 }}> <span>Waiting for location input...</span> </div>
              // }
