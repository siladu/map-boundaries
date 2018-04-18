import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  KmlLayer
} from "react-google-maps";
import { KEY } from "./secrets/google.key.js";

const MyMapComponent = withScriptjs(
  withGoogleMap(props => (
    <GoogleMap defaultZoom={8} defaultCenter={{ lat: 50.684, lng: -1.287 }}>
      {props.isMarkerShown && (
        <Marker position={{ lat: Number(props.lat), lng: Number(props.lng) }} />
      )}
      <KmlLayer
        // {/* url="https://www.dropbox.com/s/0hvdfa8fd634mqr/local-councils.kml" */}
        // {/* url="https://gist.githubusercontent.com/siladu/d6ce8587ce0066c39e7237b0c23adb36/raw/f732b55307cd6447eca7051ffccfe48200478618/local-councils.kml" */}
        url="https://gist.githubusercontent.com/siladu/767fef2b2ecd0dbe9caafdbe40c749e1/raw/7cf7d088161ee6fcd880d27749d569a50fcf5209/os-polling-districts-sample.kml"
        url="https://gist.githubusercontent.com/siladu/73f5f1ea0a08b9d7418cfa892631b9b2/raw/c5ab9eb9370d848a8e3840210f543df7f4860b1d/gb_10km.kml"
        url="https://gist.githubusercontent.com/siladu/8fee0a7eccd8ec3ca17348a6d956732d/raw/2ab26a5c1dc6400a113ef734cb5d378935afac07/iow-parish-boundaries.kml"
        options={{ preserveViewport: true }}
      />
    </GoogleMap>
  ))
);

class App extends Component {
  state = {
    timer: null,
    counter: 0,
    lat: "loading...",
    lng: "loading..."
  };

  componentDidMount() {
    let timer = setInterval(this.tick, 30000);
    this.setState({ timer });
    this.geoLocate();
  }

  componentWillUnmount() {
    this.clearInterval(this.state.timer);
  }

  tick = () => {
    this.setState({ counter: this.state.counter + 1 });
    this.geoLocate();
  };

  geoLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position =>
          this.setState({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }),
        () => console.error("GeoLocation error"),
        { timeout: 30000, enableHighAccuracy: true, maximumAge: 75000 }
      );
    } else {
      // Browser doesn't support Geolocation
      this.setState({ lat: "GeoLocation not supported" });
    }
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">
            Welcome to Simon's Isle of Wight Parish Boundary Tracker
          </h1>
        </header>
        <MyMapComponent
          lat={this.state.lat}
          lng={this.state.lng}
          isMarkerShown
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${KEY}&v=3.exp&libraries=geometry,drawing,places`}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `400px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
        <h1>{`${this.state.lat}, ${this.state.lng}`}</h1>
        <h2>{this.state.counter}</h2>
      </div>
    );
  }
}

export default App;
