import React, {Component} from 'react';
import {wilddog} from '../wilddog'

class Push extends Component{
	constructor(props){
		super(props);
	}
	handleSumbit(){
		let fullname = this.refs.fullname.value;
		let gender = this.refs.gender.value;
		const ref = wilddog.sync().ref();
		ref.child('users').push({
			"fullname":fullname,
			"gender":gender
		})
	}
	render(){
		return (
			<form name="push" noValidate >
				<input type="text" ref="fullname" name="full_name" placeholder="plz input full name" /><br/>
				<input type="text" ref="gender" name="gender" placeholder="plz input gender" /><br/>
				<input type="button" name="btn" value="Set" onClick={this.handleSumbit.bind(this)} />
			</form>
		)
	};
}
//make this component available to the app
export default Push;
