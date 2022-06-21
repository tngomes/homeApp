import React, { Component, Fragment } from "react";
import { View, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Geocoder from "react-native-geocoding";

import { getPixelSize } from "../../utils";

import Search from "../Search";
import Directions from "../Directions";
import Details from "../Details";

import markerImage from "../../assets/marker.png";
import backImage from "../../assets/back.png";

import {
  Back,
  LocationBox,
  LocationText,
  LocationTimeBox,
  LocationTimeText,
  LocationTimeTextSmall
} from "./styles";



export default class Map extends Component {
  state = {
    region:{
      latitude : 0,
      longitude: 0,
      latitudeDelta: 0,
      longitudeDelta: 0
    },
    destination: {
      latitude: 0,
      longitude: 0,
      title: 'dsadasdas'
    },
    duration: 0,
    location: [],
    selectedDestination: false,
  };

  async componentDidMount() {
  

    Geocoder.init("AIzaSyChjzTzy5kumIuCEz5O3gaCUmMwiMG3JnI");
    
    navigator.geolocation.getCurrentPosition(
      async ({ coords: {latitude, longitude } }) => {
        const response = await Geocoder.from({ latitude, longitude });
        const address = response.results[0].formatted_address;
        const location = address.substring(0, address.indexOf(","));

        this.setState({
          location,
          region: {
            latitude : latitude,
            longitude: longitude,
            latitudeDelta: 0.0143,
            longitudeDelta: 0.0134
          }
        });
      }, //sucesso
      (e) => {
      //  alert(e);
      //  alert("ERRO");
      }, //erro
      {
        timeout: 5000,
     //   enableHighAccuracy: true,
        maximumAge: 1000
      }
    );
  }

  handleLocationSelected = (data, { geometry }) => {
    
    const {
      location: { lat: latitude, lng: longitude }
    } = geometry;

    this.setState({
      destination: {
        latitude,
        longitude,
        title: data.structured_formatting.main_text
      },
      selectedDestination : true
    });

  };

  handleBack = () => {
    this.setState({ 
      destination: {
        latitude : 0,
        longitude : 0,
        title: data.structured_formatting.main_text
      },
     });
  };

  render() {
    const { region, destination, duration, location } = this.state;
    let opened =  destination.latitude ? true :false;
    console.log(region.latitude);
    console.log(destination.latitude);
    return (
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          region={region}
          showsUserLocation
          loadingEnabled
          ref={el => (this.mapView = el)}
        >
          {this.state.selectedDestination ? (
            <Fragment>
              <Directions
                origin={region}
                destination={destination}
                onReady={result => {
                  this.setState({ duration: Math.floor(result.duration) });

                  this.mapView.fitToCoordinates(result.coordinates, {
                    edgePadding: {
                      right: getPixelSize(50),
                      left: getPixelSize(50),
                      top: getPixelSize(50),
                      bottom: getPixelSize(350)
                    }
                  });
                }}
              />
              <Marker
                coordinate={destination}
                anchor={{ x: 0, y: 0 }}
                image={markerImage}
              >
                <LocationBox>
                  <LocationText>{destination.title}</LocationText>
                </LocationBox>
              </Marker>

              <Marker coordinate={region} anchor={{ x: 0, y: 0 }}>
                <LocationBox>
                  <LocationTimeBox>
                    <LocationTimeText>{duration}</LocationTimeText>
                    <LocationTimeTextSmall>MIN</LocationTimeTextSmall>
                  </LocationTimeBox>
                  <LocationText>{location}</LocationText>
                </LocationBox>
              </Marker>
            </Fragment>
          ): console.log("oi")}
        </MapView>

        {opened ? (
          <Fragment>
            <Back onPress={this.handleBack}>
              <Image source={backImage} />
            </Back>
           {this.state.selectedDestination ?  <Details /> : console.log('sem destino') } 
          </Fragment>
        ) : (
          <Search onLocationSelected={this.handleLocationSelected} />
        )}
      </View>
    );
  }
}
