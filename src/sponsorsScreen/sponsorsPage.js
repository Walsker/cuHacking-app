// React Native imports
import React, {Component} from 'react';
import {Dimensions, Image, Linking, Text, TouchableOpacity, View} from 'react-native';

// Custom imports
import {colors, containerStyle, textStyle} from 'cuHacking/src/common/appStyles';
import {Divider} from 'cuHacking/src/common';

// TODO: Make add links (contact us, logos)
export default class SponsorsPage extends Component
{
	createImage(image, dimensions, url)
	{
		var hyperlink = url ?
			() => Linking.openURL(url).catch(err => console.error('Could not open link', err))
			: () => {};

		return (
			<TouchableOpacity onPress = {hyperlink}>
				<Image
					source = {image}
					resizeMode = 'contain'
					fadeDuration = {0}
					style = {dimensions}
				/>
			</TouchableOpacity>
		);
	}

	render()
	{
		var {height, width} = Dimensions.get('window');
		var largestSize = width / 1.2;

		return (
			<View>
				<View style = {[containerStyle.screen, {backgroundColor: colors.primaryColor}]}>
					<View style = {containerStyle.textBox}>
						<Text style = {textStyle.bold(42, 'center', 'white')}>Sponsors</Text>
					</View>
				</View>
				<View style = {containerStyle.screen}>
					<View style = {containerStyle.screenSection}>
						{this.createImage(require('cuHacking/assets/images/ea.png'), {width: largestSize, height: largestSize}, 'https://www.ea.com/en-ca')}
						{this.createImage(require('cuHacking/assets/images/invision-logo.png'), {width: largestSize}, 'https://www.invisionapp.com/')}
					</View>
					<Divider color = {colors.primaryTextColor}/>
					<View style = {containerStyle.textBox}>
						<Text style = {textStyle.bold(42, 'center')}>Partners</Text>
					</View>
					<Divider color = {colors.primaryTextColor}/>
					<View style = {containerStyle.screenSection}>
						{this.createImage(require('cuHacking/assets/images/carleton_sce.png'), {width: largestSize}, 'https://carleton.ca/sce/')}
						{this.createImage(require('cuHacking/assets/images/carleton_scs.png'), {width: largestSize}, 'https://carleton.ca/scs/')}
						{this.createImage(require('cuHacking/assets/images/mlh.png'), {width: largestSize, height: largestSize / 1.8}, 'https://mlh.io/')}
					</View>
				</View>
			</View>
		);
	}
}