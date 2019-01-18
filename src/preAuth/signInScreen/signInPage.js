// React Native imports
import React, {Component} from 'react';
import {ActivityIndicator, Alert, StyleSheet, Text, View} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';

// Redux imports
import {connect} from 'react-redux';
import {setCredentials} from './actions';

// Custom imports
import {colors, textStyle} from 'cuHacking/src/common/appStyles';
import AUTH_KEY from 'cuHacking/authKey';

class SignInPage extends Component
{
	constructor(props)
	{
		super(props);
		this.state = {useCamera: true};
	}

	processCode(code)
	{
		this.setState({useCamera: false});

		var data = code.data.split("|");
		
		if (data[0] != AUTH_KEY)
		{
			Alert.alert(
				"Invalid QR Code",
				"Please scan your personal code provided via email.",
				[{text: 'OK', onPress: () => this.setState({useCamera: true})}],
				{cancelable: false}
			);
		}
		else
		{
			this.props.setCredentials(data);
			this.props.navigation.navigate("Loading");
		}

	}//Zs2UtedQrvfJzDpXQ7WR6aeEBi33|walskerw@gmail.com|uidCod

	renderCamera()
	{
		if (this.state.useCamera)
		{
			return (
				<QRCodeScanner
					ref = {(node) => {this.scanner = node}}
					fadeIn = {false}
					onRead = {this.processCode.bind(this)}
					showMarker
					markerStyle = {styles.cameraMarker}
					cameraStyle = {styles.camera}
				/>
			);
		}
		else return <ActivityIndicator color = {colors.primaryColor} size = 'large'/>;
	}

	render()
	{
		return (
			<View style = {styles.default}>
				<View style = {styles.cameraSpace}>
					{this.renderCamera()}
				</View>
				<View style = {styles.prompt}>
					<Text style = {textStyle.light(24, 'center', 'white')}>Please scan your QR ID code.</Text>
				</View>
			</View>
		);
	}
}

export default connect(null, {setCredentials})(SignInPage);


const styles = StyleSheet.create(
{
	default: {flex: 1},
	prompt:
	{
		flex: 0.1,
		backgroundColor: colors.primaryColor,
		justifyContent: 'center',
		alignItems: 'center'
	},
	cameraSpace:
	{
		flex: 0.9,
		justifyContent: 'center',
		backgroundColor: colors.primarySpaceColor
	},
	camera: {height: '100%'},
	cameraMarker: {borderColor: 'white'}
});