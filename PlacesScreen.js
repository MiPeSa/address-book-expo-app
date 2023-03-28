import { StyleSheet, View, FlatList, Alert } from 'react-native';
import { initializeApp } from 'firebase/app'
import { getDatabase, push, ref, onValue, remove } from 'firebase/database';
import { useEffect, useState } from 'react';
import { Input, Button, ListItem, Text, Icon } from '@rneui/themed';
import { API_KEY } from '@env';

const firebaseConfig = {
    apiKey: "AIzaSyAj5waN8hqf29CCG6bMSilCOvYEkD2dH3I",
    authDomain: "address-book-6e0d4.firebaseapp.com",
    databaseURL: "https://address-book-6e0d4-default-rtdb.firebaseio.com", 
    projectId: "address-book-6e0d4",
    storageBucket: "address-book-6e0d4.appspot.com",  
    messagingSenderId: "112049986720",
    appId: "1:112049986720:web:fe5f2423d918c4b533bdc5"
  };
  
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const key = API_KEY;
export default function PlacesScreen({ navigation }) {

    const [location, setLocation] = useState(null);
    const [marker, setMarker] = useState(null);
    const [address, setAddress] = useState('');
    const [places, setPlaces] = useState([]);
    
    useEffect(() => {
        const itemsRef = ref(database, 'places/');
        onValue(itemsRef, (snapshot) => {
        const data = snapshot.val();
        const items = data ? Object.keys(data).map(key => ({key, ...data[key]})) : [];
        setPlaces(items);
        })
    }, []);
  
    const saveAddress = () => {
        console.log('saveAddress', { address })
        push(
        ref(database, 'places/'),
        { 'address': address }
        );
    }

    const handleNavigation = (location, marker, address) => {
        navigation.navigate('Map', { marker: marker, location: location, address: address })
    }

    const showAddress = async (item) => {
        try {  
            const response = await fetch(`https://www.mapquestapi.com/geocoding/v1/address?key=${key}&location=${item}`);
            const data = await response.json();
            const lat = data.results[0].locations[0].latLng.lat;
            const lng = data.results[0].locations[0].latLng.lng;
            const newLocation = {latitude: lat, longitude: lng, latitudeDelta: 0.0322, longitudeDelta: 0.0221};
            setLocation(newLocation);
            setMarker(newLocation.latitude, newLocation.longitude);
            handleNavigation(newLocation, marker, item);
        }
        catch(error) {
            Alert.alert('Error', error);
        }
    };

    const deleteItem = (key) => {
      remove(ref(database, '/places/' + key))  
    };
  
    const renderItem = ({item}) => (
      <View>
        <ListItem.Swipeable 
            leftContent={() => (
              <Button 
                title="Delete"
                onPress={() => deleteItem(item.key)}
                icon={{ name: 'delete', color: 'white' }}
                buttonStyle={{minHeight: '100%', backgroundColor: 'red' }}
              />
            )}
          >
          <ListItem.Content>
            <ListItem.Title>{item.address}</ListItem.Title>
          </ListItem.Content>
          <Text onPress={() => showAddress(item.address)}>show on map</Text>
          <Icon type="material" name="map"></Icon>       
        </ListItem.Swipeable>
      </View>
    ); 
    
  
    return (
      <View style={styles.container}>
        <Input 
          placeholder='Type in address here' label='PLACEFINDER'
          onChangeText={(address) => setAddress(address)}
          value={address}
        />    
        <View style={styles.saveButton}>
          <Button raised icon={{name: 'save'}} onPress={saveAddress} title="SAVE" /> 
        </View>   
        <FlatList 
          keyExtractor={item => item.key} 
          renderItem={renderItem} 
          data={places} 
        />       
      </View>
    );
  }

  const styles = StyleSheet.create({

    container: {
        flex: 1
    },
    saveButton: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        width: '100%',
        height: '10%',
    },
    textinput: {
        width: '100%'
    },
  });
