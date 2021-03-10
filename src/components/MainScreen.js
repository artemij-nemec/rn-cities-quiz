import { getDistance } from 'geolib'
import React, { useState } from 'react'
import { Alert, Dimensions, StyleSheet, Text, View } from 'react-native'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import { cities } from '../cities'
import { mapStyle } from '../mapStyle'

const MainScreen = () => {
	const startKilometerts = 1500
	const [kilometerts, setKilometerts] = useState(startKilometerts)
	const [score, setScore] = useState(0)
	const [marker, setMarker] = useState(null)
	const [correctMarker, setCorrectMarker] = useState(null)
	const [markerTitle, setMarkerTitle] = useState('')
	const [cityId, setCityId] = useState(0)
	const city = cities[cityId]
	const mapRef = React.createRef();

	const startNewGame = () => {
		setKilometerts(startKilometerts)
		setMarker(null)
		setCityId(0)
		setCorrectMarker(null)
	}
	const lose = () => {
		Alert.alert(
			'No kilometers left',
			`You score ${score}`,
			[
				{
					text: 'New game',
					onPress: () => {
						startNewGame()
					}
				}
			],
			{ cancelable: false }
		)
	}
	const win = () => {
		Alert.alert(
			'No sities left',
			`You score ${score}`,
			[
				{
					text: 'New game',
					onPress: () => {
						startNewGame()
					}
				}
			],
			{ cancelable: false }
		)
	}
	const showDistance = (dist, continueHandler) => {
		Alert.alert(
			'Distance',
			`${dist} km`,
			[
				{
					text: 'OK',
					onPress: () => {
						continueHandler()
					}
				}
			],
			{ cancelable: false }
		)
	}
	const onPressHandler = (e) => {
		const userChoise = e.nativeEvent.coordinate
		const cityCoordinates = { latitude: city.lat, longitude: city.long }
		const dist = getDistance(
			cityCoordinates,
			{ latitude: userChoise.latitude, longitude: userChoise.longitude }
		)
		setMarker(userChoise)
		setCorrectMarker(cityCoordinates)
		setMarkerTitle(city.capitalCity)
		const distance = Math.round(dist / 1000)
		if (kilometerts - distance <= 0) {
			lose()
		} else if (cityId === cities.length - 1) {
			win()
		} else {
			showDistance(
				distance,
				() => {
					setMarker(null)
					setCorrectMarker(null)
					setKilometerts(kilometerts - distance)
					setCityId(cityId + 1)
					if (distance <= 50) {
						setScore(score + 1)
					}
				}
			)
		}
	}

	return (
		<View style={styles.container}>
			<View style={styles.textWrapper}>
				<View style={styles.textBox}>
					<Text style={styles.text}>Cities placed: {cityId} of {cities.length}</Text>
				</View>
				<View style={styles.textBox}>
					<Text style={styles.text}>{kilometerts} kilometers left</Text>
				</View>
				<Text style={styles.text}>Select the location of</Text>
				<Text style={styles.text}>"{city.capitalCity}"</Text>
			</View>
			<MapView
				ref={mapRef}
				provider={PROVIDER_GOOGLE}
				style={styles.map}
				showsCompass={false}
				rotateEnabled={false}
				zoomControlEnabled={true}
				customMapStyle={mapStyle}
				onPress={onPressHandler}
			>
				{marker && <MapView.Marker
					coordinate={marker}
				/>}
				{correctMarker &&
					<MapView.Marker
						coordinate={correctMarker}
						title={markerTitle}
						pinColor={'green'}
					>
					</MapView.Marker>
				}
			</MapView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	textWrapper: {
		height: 175,
		width: '100%',
		paddingBottom: 10,
		paddingTop: 60,
		color: 'black',
		backgroundColor: 'white',
		alignItems: 'center'
	},
	text: {
		fontSize: 18
	},
	textBox: {
		width: '90%',
		backgroundColor: '#dddddd',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: 'black',
		borderRadius: 3,
		padding: 2,
		marginBottom: 2
	},
	map: {
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height - 155
	}
})

export default MainScreen