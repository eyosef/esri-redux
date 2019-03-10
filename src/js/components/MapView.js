import { viewCreated } from 'js/actions/mapActions';
import { MAP_OPTIONS, VIEW_OPTIONS, citiesRenderer, statesRenderer, highwaysRenderer } from 'js/config';

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
          {
            //https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/2
            id: 2,
            title: 'States',
            visible: true,
            renderer: statesRenderer,
            popupTemplate: {
              title: 'Welcome to {state_name}',
              content: 'Population per square mile: {pop00_sqmi}'
            }
          },
          {
            // https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/1
            id: 1,
            title: 'Highways',
            visible: true,
            renderer: highwaysRenderer,
            popupTemplate: {
              title: '{route}',
              content: '{route} is {length} miles long'
            }
          },
          {
            // https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0
            id: 0,
            title: 'Cities',
            visible: true,
            renderer: citiesRenderer,
            definitionExpression: 'pop2000 > 100000',
            popupTemplate: {
              title: '{areaname}',
              content: '{pop2000} people call the city of {areaname}, {st} home'
            }
          }
        ]
      }),
    };
  }

  componentDidMount() {
    // Subscribe to the store for updates
    this.unsubscribe = appStore.subscribe(this.storeDidUpdate);

    // const layer_0 = new FeatureLayer({
    //   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0",
    //   title: "Cities"
    // });
    // const layer_1 = new FeatureLayer({
    //   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/1",
    //   title: "Highways"
    // });
    // const layer_2 = new FeatureLayer({
    //   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/2",
    //   title: "States"
    // });
    // const layer_3 = new FeatureLayer({
    //   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/3",
    //   title: "Counties"
    // });

    const map = new EsriMap(MAP_OPTIONS);

    map.add(this.state.layer);
    // map.addMany([layer_2, layer_3, layer_1, layer_0]);

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
      <div ref='mapView' className='map-view' onClick={this.popUpData}>
        <Controls view={this.view}/>
        <Spinner active={!this.view.ready} />
        <ShareModal visible={shareModalVisible} />
        <LocateModal visible={locateModalVisible} />
      </div>
    );
  }
}