import { StyleSheet, View} from 'react-native';
import MapView, { Marker } from "react-native-maps";

export default function MapScreen({ route }) {

    const { marker, location, address } = route.params;    
  
    return (
        <View style={styles.container}>
            <MapView 
                style={styles.mapStyle}
                region={location}
            >
            <Marker 
                coordinate={location}
                title={address}
            />    
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1
    }, 
    mapStyle: {
      flex: 1, 
      height: '100%', 
      width: '100%'
    },
});