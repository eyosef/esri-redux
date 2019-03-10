import { viewCreated } from 'js/actions/mapActions';
import { MAP_OPTIONS, VIEW_OPTIONS, citiesRenderer, statesRenderer, highwaysRenderer } from 'js/config';

import LocateModal from 'js/components/modals/Locate';
import ShareModal from 'js/components/modals/Share';
import Spinner from 'js/components/shared/Spinner';
import Controls from 'js/components/Controls';

// import Popup from 'esri/widgets/Popup';
// import Locator from 'esri/tasks/Locator';
import MapView from 'esri/views/MapView';
import React, { Component } from 'react';
import appStore from 'js/appStore';
import EsriMap from 'esri/Map';
import MapImageLayer from 'esri/layers/MapImageLayer';
import Slider from '@material-ui/lab/Slider';

export default class Map extends Component {
  // displayName: 'Map';
  state = appStore.getState();
  view = {};

  constructor(props) {
    super(props);
    this.state = {
      popValue: 1,
      highWayValue: 50,
      popSquareMile: 1,
      layer: new MapImageLayer({
        url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer',
        sublayers: [
          {
            // https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/2
            id: 2,
            title: 'States',
            visible: true,
            renderer: statesRenderer,
            definitionExpression: 'pop00_sqmi > 100',
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
            definitionExpression: 'length > 50',
            popupTemplate: {
              title: '{route}',
              content: 'This {type} highway is {length} miles long'
            }
          },
          {
            // https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0
            id: 0,
            title: 'Cities',
            visible: true,
            renderer: citiesRenderer,
            definitionExpression: `pop2000 > 1`,
            popupTemplate: {
              title: '{areaname}',
              content: '{pop2000} people live in {areaname}, {st}'
            }
          }
        ]
      }),
    };
  }

  componentDidMount() {
    // Subscribe to the store for updates
    this.unsubscribe = appStore.subscribe(this.storeDidUpdate);

    const map = new EsriMap(MAP_OPTIONS);

    map.add(this.state.layer);

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

  handlePopChange = (event, value) => {
    this.setState({ popValue: value });
    // console.log(this.state.popValue);
  }

  handleHighWayChange = (event, value) => {
    this.setState({ highWayValue: value });
    // console.log(this.state.highWayValue);
  }

  handlePopSqMileChange = (event, value) => {
    this.setState({ popSquareMile: value });
    console.log(this.state.popSquareMile);
  }

  componentDidUpdate = () => {
    if (this.state.popValue) {
      this.state.layer.findSublayerById(0).definitionExpression = "pop2000 > " + this.state.popValue;
    }
    if (this.state.highWayValue) {
      this.state.layer.findSublayerById(1).definitionExpression = "length > " + this.state.highWayValue;
      // debugger;
    }
    if (this.state.popSquareMile) {
      this.state.layer.findSublayerById(2).definitionExpression = "pop00_sqmi > " + this.state.popSquareMile;
      // debugger;
    }
  }

  render () {
    const {shareModalVisible, locateModalVisible} = this.state;

    var slider = {
      padding: '22px 0px',
      height: '35px',
    };

    return (
      <div>
        <div ref='mapView' className='map-view' onClick={this.popUpData}>
          <Controls view={this.view}/>
          <Spinner active={!this.view.ready} />
          <ShareModal visible={shareModalVisible} />
          <LocateModal visible={locateModalVisible} />
        </div>

        <div className='sqmi-footer'>
          <h4>States with > {this.state.popSquareMile} people per square mile</h4>
          <Slider
            classes={{ slider }}
            value={this.state.popSquareMile}
            min={100}
            max={300}
            step={1}
            onChange={this.handlePopSqMileChange}
          />
        </div>

        <div className='footer'>
          <h4>City populations > {this.state.popValue} people</h4>
          <Slider
            classes={{ slider }}
            value={this.state.popValue}
            min={2}
            max={500000}
            step={1}
            onChange={this.handlePopChange}
          />
        </div>

        <div className='highway-footer'>
          <h4>Highways greater than {this.state.highWayValue} miles</h4>
          <Slider
            classes={{ slider }}
            value={this.state.highWayValue}
            min={1}
            max={300}
            step={1}
            onChange={this.handleHighWayChange}
          />
        </div>
      </div>
    );
  }
}

// <h4>Cities with Population greater than <span className="total">100,000</span></h4>
// <input className="population-slider" type="range" min="1000" max="1000000" step="100"
// value="100000"></input>
// <div className='highway-footer'>
// </div>