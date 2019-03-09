export const INITIAL_STATE = {
  locateModalVisible: false,
  shareModalVisible: false,
  viewReady: false,
  itemInfo: {}
};

export const TEXT = {
  title: "Eden's Solution",
  subtitle: 'Example with Redux, React, Esri, Sass, and more.'
};

export const MAP_OPTIONS = {
  basemap: 'streets-navigation-vector'
};

export const VIEW_OPTIONS = {
  ui: { components: ['logo', 'attribution'] },
  center: [-77.3031, 38.6088],
  zoom: 6
};

export const URLS = {
  itemInfo: appid => `//www.arcgis.com/sharing/rest/content/items/${appid}/data`
};
