import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
const MapScreen = () => {
 const initialRegion = {
   latitude: 37.78825, // Initial latitude
   longitude: -122.4324, // Initial longitude
   latitudeDelta: 0.0922, // Zoom level
   longitudeDelta: 0.0421,
 };
 return (
   <View style={styles.container}>
     <MapView style={styles.map} initialRegion={initialRegion}>
       <Marker
         coordinate={{
           latitude: initialRegion.latitude,
           longitude: initialRegion.longitude,
         }}
         title="Your Location"
         description="This is your current location"
       />
     </MapView>
   </View>
 );
};
const styles = StyleSheet.create({
 container: {
   ...StyleSheet.absoluteFillObject,
 },
 map: {
   ...StyleSheet.absoluteFillObject,
 },
});
export default MapScreen;