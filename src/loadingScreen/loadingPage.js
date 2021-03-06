// React Native imports
import React, {Component} from 'react';
import {ActivityIndicator, Alert, StatusBar, StyleSheet, View} from 'react-native';

// Redux imports
import {connect} from 'react-redux';
import {saveHackerInfo} from './actions';
import {signOut} from 'cuHacking/src/preAuth/signInScreen/actions';
import {updateSchedule} from 'cuHacking/src/postAuth/scheduleScreen/actions';

// Firebase imports
import firebase from 'react-native-firebase';

// Custom imports
import {colors} from 'cuHacking/src/common/appStyles';
import {Button} from 'cuHacking/src/common';
import NULL_CREDENTIALS from 'cuHacking/src/preAuth/signInScreen/nullCredentials';

class LoadingPage extends Component
{
	constructor(props)
	{
		super(props);
		this.state = 
		{
			firestore: firebase.firestore(),
			waitingForConnection: false
		}
	}

	displayError(type)
	{
		switch (type)
		{
			case "Auth Failure":
				this.props.signOut();
				Alert.alert(
					"Authentication Failed",
					"Scan your QR ID code again.\n\nIf this persists, please contact an organizer for help",
					[{text: 'OK', onPress: () => this.props.navigation.navigate("Landing")}],
					{cancelable: false}
				);
				return;
			
			case "Fetch Failure":
				this.props.signOut();
				Alert.alert(
					"Could Not Retrieve Data",
					"Scan your QR ID code again.\n\nIf this persists, please contact an organizer for help",
					[{text: 'OK', onPress: () => this.props.navigation.navigate("Landing")}],
					{cancelable: false}
				);
				return;

			case "Profile Undefined":
				this.props.signOut();
				Alert.alert(
					"Profile Not Found",
					"Scan your QR ID code again.\n\nIf this persists, please contact an organizer for help",
					[{text: 'OK', onPress: () => this.props.navigation.navigate("Landing")}],
					{cancelable: false}
				);
				return;

			case "No Connection":
				Alert.alert(
					"No Connection",
					"Please connect to the internet to continue",
					[{text: 'OK', onPress: () => this.setState({waitingForConnection: true})}],
					{cancelable: false}
				);
				return;
		}
	}

	authFailure(error)
	{
		if (error.code == 'auth/network-request-failed')
			this.displayError("No Connection");
		else
			this.displayError("Auth Failure");
	}

	authSuccess()
	{
		// Creating a reference to the user's profile
		const profileRef = this.state.firestore.collection("hackers").doc(this.props.credentials.email);

		const toMainApp = (hackerObject, schedule) =>
		{
			this.props.saveHackerInfo(hackerObject);
			this.props.updateSchedule(schedule);
			this.props.navigation.navigate("Main");
		};

		const retrieveSchedule = (hackerObject) =>
		{
			// Retrieving the schedule from firebaes
			this.state.firestore.collection("events").get().then(snapshot => 
			{
				let events = [];
				snapshot.forEach(document => events.push(document.data()));
				toMainApp(hackerObject, events);
			}).catch(error =>
			{
				console.log("Tried to get schedule", error);
				this.displayError("Fetch Failure");
			});
		};

		// Retrieving account information from firebase
		profileRef.get().then(document => {
			if (document.exists)
				retrieveSchedule(document.data());
				// toMainApp(document.data(), {});
			else
				this.displayError("Profile Undefined");
		}).catch(error =>
		{
			console.log("Tried to get account info", error);
			this.displayError("Fetch Failure");
		});
	}

	authenticate()
	{
		// No longer waiting for a connection
		this.setState({waitingForConnection: false});

		// Retrieving the credentials from state
		let {email, password} = this.props.credentials;

		// Sending the authentication request to firebase
		firebase.auth().signInWithEmailAndPassword(email, password).then(this.authSuccess.bind(this)).catch((error) => this.authFailure(error));
	}

	componentDidMount()
	{
		// Signing out just to be sure
		firebase.auth().signOut();

		// Retrieving the credentials from state
		let {email, password} = this.props.credentials;

		// Checking if credentials have been saved to the device
		if (email == NULL_CREDENTIALS.email || password == NULL_CREDENTIALS.password)
			this.props.navigation.navigate("PreAuth");
		else this.authenticate();	
	}

	render()
	{
		return (
			<View style = {localStyle.default}>
				<StatusBar barStyle = 'light-content'/>
				{this.state.waitingForConnection ? 
					<Button
						label = "Try again"
						color = 'white'
						inverted = {true}
						action = {this.authenticate.bind(this)}
					/>
					:
					<ActivityIndicator
						size = 'large'
						color = 'white'
					/>
				}
			</View>
		);
	}
}

const mapStateToProps = (state) =>
{	
	return {
		credentials: state.credentials
	};
};
export default connect(mapStateToProps, {saveHackerInfo, signOut, updateSchedule})(LoadingPage);


const localStyle = StyleSheet.create(
{
	default:
	{
		flex: 1,
		backgroundColor: colors.primaryColor,
		justifyContent: 'center',
		alignItems: 'center'
	},
});