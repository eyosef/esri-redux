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

  componentDidMount() {
    // Subscribe to the store for updates
    this.unsubscribe = appStore.subscribe(this.storeDidUpdate);

    const map = new EsriMap(MAP_OPTIONS);

    var layer = new MapImageLayer({
      url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer",
      sublayers: [
        {
          // counties
          id: 3,
          visible: false
        },
        { // state borders
          id: 2,
          visible: false
        },
        { 
          // highways
          id: 1,
          visible: true,
          popupEnabled: true
        },
        {
          //  cities
          id: 0,
          visible: true,
          popupEnabled: true
        }
      ]
    });
    
    // var layer = new MapImageLayer({
    //   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer",
    //   sublayers: [  // autocasts as a Collection of Sublayers
    //     { // sets a definition expression on sublayer 0
    //       id: 0,
    //       definitionExpression: "pop2000 > 40000000"
    //     },
    //     {  // creates a dynamic data layer
    //       source: {
    //         type: dynamic-layer,
    //         dataSource: {
    //           type: "table",
    //           workspaceId: "MyDatabaseWorkspaceIDSSR2",
    //           dataSourceName: "ss6.gdb.Railroads"
    //         }
    //       }
    //     }
    //   ]
    // });

    map.add(layer);

    // Create our map view
    const promise = new MapView({
      container: this.refs.mapView,
      map: map,
      ...VIEW_OPTIONS
    });

    promise.then(view => {
      this.view = view;
      appStore.dispatch(viewCreated());
      //- Webmap from https://developers.arcgis.com/javascript/latest/api-reference/esri-WebMap.html
      // appStore.dispatch(getItemInfo('e691172598f04ea8881cd2a4adaa45ba'));
    });
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
      <div ref='mapView' className='map-view'>
        <Controls view={this.view} />
        <Spinner active={!this.view.ready} />
        <ShareModal visible={shareModalVisible} />
        <LocateModal visible={locateModalVisible} />
      </div>
    );
  }
}
