import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

import Button from './components/Button';
import ImageViewer from './components/ImageViewer';
const PlaceholderImage = require('./assets/images/background-image.png');

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAppOptions, setShowAppOptions] = useState(false);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.cancelled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      alert('You did not select any image.');
    }
  }

	return (
		<View style={styles.container}>
			<View style={styles.imageContainer}>
				<ImageViewer 
        placeholderImageSource={PlaceholderImage} 
        selectedImage={selectedImage}/>
			</View>
      {showAppOptions ? (
        <View/>
      ) : (
      <View styles={styles.footerContainer}>
        <Button theme="primary" label="Choose a photo" onPress={pickImageAsync}/>
        <Button label="Use this photo" onPress={() => setShowAppOptions(true)}/>
      </View>
      )}
			<StatusBar style='auto' />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#25292e',
		alignItems: 'center',
		justifyContent: 'center',
	},
	imageContainer: {
		flex: 1,
		paddingTop: 58,
	},
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
});
