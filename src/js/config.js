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
  center: [-76.9931, 38.9088],
  zoom: 8
};

export const URLS = {
  itemInfo: appid => `//www.arcgis.com/sharing/rest/content/items/${appid}/data`
};
