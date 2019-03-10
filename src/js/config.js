
export const INITIAL_STATE = {
  locateModalVisible: false,
  shareModalVisible: false,
  viewReady: false,
  itemInfo: {}
};

export const TEXT = {
  title: "Eden's Solution",
  subtitle: 'Leverages Material-UI Switch components and ArcGIS renderers for a custom solution'
};

export const MAP_OPTIONS = {
  // basemap: 'streets-navigation-vector'
  basemap: 'gray'
};

export const VIEW_OPTIONS = {
  ui: { components: ['logo', 'attribution'] },
  center: [-86.9931, 40.9088],
  zoom: 4.3
};

export const URLS = {
  itemInfo: appid => `//www.arcgis.com/sharing/rest/content/items/${appid}/data`
};

export const citiesRenderer = {
  type: 'simple', // autocasts as new SimpleRenderer()
  symbol: {
    type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
    size: 7,
    color: 'yellow',
    style: 'circle',
  },
  label: 'Cities'
};

    // size: 14,
    // color: {a: 1, b: 200, g: 0, r: 0},

export const statesRenderer = {
  type: 'simple', // autocasts as new SimpleRenderer()
  symbol: {
    type: 'simple-fill', // autocasts as new SimpleFillSymbol()
    style: 'solid',
    // color: 'pink',
    outline: {
      width: 2,
      color: 'black'
      // color: {a: 1, b: 0, g: 200, r: 0}
    }
  },
  label: 'State boundaries'
};

export const highwaysRenderer = {
  type: 'simple', // autocasts as new SimpleRenderer()
  symbol: {
    type: 'simple-line', // autocasts as new SimpleLineSymbol()
    style: 'solid',
    width: 1.5,
    color: {a: 1, b: 191, g: 74, r: 63}
  },
  label: 'Interstate highway'
};