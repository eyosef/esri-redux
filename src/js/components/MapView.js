import { viewCreated } from 'js/actions/mapActions';
import { MAP_OPTIONS, VIEW_OPTIONS } from 'js/config';

import LocateModal from 'js/components/modals/Locate';
import ShareModal from 'js/components/modals/Share';
import Spinner from 'js/components/shared/Spinner';
import Controls from 'js/components/Controls';

// import Popup from 'esri/widgets/Popup';
import Locator from 'esri/tasks/Locator';
import MapView from 'esri/views/MapView';
import React, { Component } from 'react';
import appStore from 'js/appStore';
import EsriMap from 'esri/Map';
import MapImageLayer from 'esri/layers/MapImageLayer';

export default class Map extends Component {
  // displayName: 'Map';
  state = appStore.getState();
  view = {};

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      content: '',
      latitude: '',
      longitude: '',
      mapPoint: '',
      layer: new MapImageLayer({
        basemap: 'dark-gray',
        url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer',
        sublayers: [
          { // counties
            id: 3,
            visible: false
          },
          { // state borders
            id: 2,
            visible: true
          },
          { // highways
            id: 1,
            visible: true,
            popupEnabled: true
          },
          { //  cities
            id: 0,
            visible: true,
            popupEnabled: false,
            autoOpenEnabled: false,
            definitionExpression: 'pop2000 > 50000',
            // popupTemplate: {
            //   title: `${this.state.mapPoint}`,
            //   content: `Latitude is: ${this.state.latitude} and longitude is: ${this.state.longitude}`
            // }
          }
        ]
      }),
    };

    this.popUpData = this.popUpData.bind(this);
  }

  componentDidMount() {
    // Subscribe to the store for updates
    this.unsubscribe = appStore.subscribe(this.storeDidUpdate);

    const map = new EsriMap(MAP_OPTIONS);

    map.add(this.state.layer);
    // map.on('click', this.popUpData);

    // Create our map view
    const promise = new MapView({
      container: this.refs.mapView,
      map: map,
      ...VIEW_OPTIONS
    });

    promise.then(view => {
      this.view = view;
      this.view.popup.autoOpenEnabled = false;
      this.view.on('click', this.popUpData);
      appStore.dispatch(viewCreated());
      //- Webmap from https://developers.arcgis.com/javascript/latest/api-reference/esri-WebMap.html
      // appStore.dispatch(getItemInfo('e691172598f04ea8881cd2a4adaa45ba'));
    });
  }

  popUpData(event) {
    var locatorTask = new Locator({
      url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
    });
    this.setState({
      latitude: event.mapPoint.latitude,
      longitude: event.mapPoint.longitude,
      mapPoint: event.mapPoint,
      layer: {
          popupTemplate: {
          title: 'Lat and Lon',
          content: `Latitude is: ${this.state.latitude} and longitude is: ${this.state.longitude}`
        },
      }
    });
    var lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
    var lon = Math.round(event.mapPoint.longitude * 1000) / 1000;

    this.view.popup.open({
      title: `Latitude is: ${lat} and longitude is: ${lon}`,
      content: `${event.mapPoint}`,
      location: event.mapPoint
    }).then(
      locatorTask.locationToAddress(event.mapPoint).then(function(response) {
        // If an address is successfully found, show it in the popup's content
        this.view.popup.content = response.address;
        console.log(`response.address = ${response.address}`);
      }).catch(function(error) {
        // If the promise fails and no result is found, show a generic message
        this.view.popup.content =
          `No address was found for this location due to ${error}`;
      })
    );

    console.log(locatorTask.locationToAddress(this.state.mapPoint));

    // debugger;
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  storeDidUpdate = () => {
    this.setState(appStore.getState());
  };

  render () {
    const {shareModalVisible, locateModalVisible} = this.state;

    return (
      <div ref='mapView' className='map-view' onClick={this.popUpData}>
        <Controls view={this.view}/>
        <Spinner active={!this.view.ready} />
        <ShareModal visible={shareModalVisible} />
        <LocateModal visible={locateModalVisible} />
      </div>
    );
  }
}
