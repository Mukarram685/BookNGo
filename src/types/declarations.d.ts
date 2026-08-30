declare module '@env' {
  export const ONESIGNAL_APP_ID: string;
  export const STRIPE_PUBLISHABLE_KEY: string;
  export const API_URL: string;
}

declare module 'react-native-maps' {
  import * as React from 'react';
  import { ViewProps } from 'react-native';

  export interface Region {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }

  export interface LatLng {
    latitude: number;
    longitude: number;
  }

  export interface MapViewProps extends ViewProps {
    initialRegion?: Region;
    region?: Region;
    onRegionChange?: (region: Region) => void;
    onRegionChangeComplete?: (region: Region) => void;
    children?: React.ReactNode;
  }

  export interface MarkerProps extends ViewProps {
    coordinate: LatLng;
    title?: string;
    description?: string;
    children?: React.ReactNode;
  }

  export default class MapView extends React.Component<MapViewProps, any> {}
  export class Marker extends React.Component<MarkerProps, any> {}
}
