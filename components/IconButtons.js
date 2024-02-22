import { Pressable, StyleSheet, Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function IconButtons({ icon, label, onPress }) {
	return (
		<Pressable
			style={styles.iconButton}
			onPress={onPress}>
			<MaterialIcons
				name={icon}
				size={24}
				color='white'
			/>
			<Text style={styles.iconButtonLabel}>{label}</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	iconButton: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	iconButtonLabel: {
		color: 'white',
		marginTop: 12,
	},
});
