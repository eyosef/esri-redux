import { viewCreated, getItemInfo } from 'js/actions/mapActions';
import { MAP_OPTIONS, VIEW_OPTIONS } from 'js/config';

import LocateModal from 'js/components/modals/Locate';
import ShareModal from 'js/components/modals/Share';
import Spinner from 'js/components/shared/Spinner';
import Controls from 'js/components/Controls';

import MapView from 'esri/views/MapView';
import React, { Component } from 'react';
import appStore from 'js/appStore';
import EsriMap from 'esri/Map';
import MapImageLayer from "esri/layers/MapImageLayer";

export default class Map extends Component {
  displayName: 'Map';
  state = appStore.getState();
  view = {};

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      content: ''
    };

    // this.popUpData = this.popUpData.bind(this);
  }

  componentDidMount() {
    // Subscribe to the store for updates
    this.unsubscribe = appStore.subscribe(this.storeDidUpdate);

    const map = new EsriMap(MAP_OPTIONS);

    var layer = new MapImageLayer({
      url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer",
      sublayers: [
        { // counties
          id: 3,
          visible: false
        },
        { // state borders
          id: 2,
          visible: false
        },
        { // highways
          id: 1,
          visible: true,
          popupEnabled: true
        },
        { //  cities
          id: 0,
          visible: true,
          popupEnabled: true,
          autoOpenEnabled: false
          // popupTemplate: {
          //   title: 'Zip Code: {ZIP}',
          //   content: '{POP2007} people lived in this county in 2007'
          // }
        }
      ]
    });

    map.add(layer);
    map.on('click', this.popUpData);

    // Create our map view
    const promise = new MapView({
      container: this.refs.mapView,
      map: map,
      ...VIEW_OPTIONS
    });

    promise.then(view => {
      this.view = view;
      appStore.dispatch(viewCreated());
      console.log(this.view);
      //- Webmap from https://developers.arcgis.com/javascript/latest/api-reference/esri-WebMap.html
      // appStore.dispatch(getItemInfo('e691172598f04ea8881cd2a4adaa45ba'));
    });

  }


  popUpData(event) {
    event.preventDefault();
    alert('I was clicked');
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
      <div ref='mapView' className='map-view' >
        <Controls view={this.view}/>
        <Spinner active={!this.view.ready} />
        <ShareModal visible={shareModalVisible} />
        <LocateModal visible={locateModalVisible} />
      </div>
    );
  }
}
