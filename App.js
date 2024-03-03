import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import domtoimage from 'dom-to-image';

import Button from './components/Button';
import ImageViewer from './components/ImageViewer';
import CircleButton from './components/CircleButton';
import IconButtons from './components/IconButtons';
import EmojiPicker from './components/EmojiPicker';
import EmojiList from './components/EmojiList';
import EmojiSticker from './components/EmojiSticker';

const PlaceholderImage = require('./assets/images/background-image.png');

export default function App() {
	const [selectedImage, setSelectedImage] = useState(null);
	const [showAppOptions, setShowAppOptions] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [pickedEmoji, setPickedEmoji] = useState(null);
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const imageRef = useRef();

	const onReset = () => {
		setShowAppOptions(false);
	};

	const onAddSticker = () => {
		setIsModalVisible(true);
	};

	const onModalClose = () => {
		setIsModalVisible(false);
	};

  const onSaveImageAsync = async () => {
    if (Platform.OS !== 'web') {
      try {
        const localUri = await captureRef(imageRef, {
          height: 440,
          quality: 1,
        });
        await MediaLibrary.saveToLibraryAsync(localUri);
        if (localUri) {
          alert('Saved!');
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        const dataUrl = await domtoimage.toJpeg(imageRef.current, {
          quality: 0.95,
          width: 320,
          height: 440,
        });
  
        let link = document.createElement('a');
        link.download = 'sticker-smash.jpeg';
        link.href = dataUrl;
        link.click();
      } catch (e) {
        console.log(e);
      }
    }
  };

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
	};

  if (status === null) {
    requestPermission();
  }

  <StatusBar style="light" />

	return (
		<GestureHandlerRootView style={styles.container}>
				<View style={styles.imageContainer}>
          <View ref={imageRef} collapsable={false}>
					<ImageViewer
						placeholderImageSource={PlaceholderImage}
						selectedImage={selectedImage}
					/>
					{pickedEmoji && (
						<EmojiSticker
							imageSize={40}
							stickerSource={pickedEmoji}
						/>
					)}
          </View>
				</View>
				{showAppOptions ? (
					<View style={styles.optionsContainer}>
						<View style={styles.optionsRow}>
							<IconButtons
								icon='refresh'
								label='Reset'
								onPress={onReset}
							/>
							<CircleButton onPress={onAddSticker} />
							<IconButtons
								icon='save-alt'
								label='Save'
								onPress={onSaveImageAsync}
							/>
						</View>
					</View>
				) : (
					<View styles={styles.footerContainer}>
						<Button
							theme='primary'
							label='Choose a photo'
							onPress={pickImageAsync}
						/>
						<Button
							label='Use this photo'
							onPress={() => setShowAppOptions(true)}
						/>
					</View>
				)}
				<EmojiPicker
					isVisible={isModalVisible}
					onClose={onModalClose}>
					<EmojiList
						onSelect={setPickedEmoji}
						onCloseModal={onModalClose}
					/>
				</EmojiPicker>
				<StatusBar style='auto' />
		</GestureHandlerRootView>
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
	optionsContainer: {
		position: 'absolute',
		bottom: 80,
	},
	optionsRow: {
		alignItems: 'center',
		flexDirection: 'row',
	},
});
