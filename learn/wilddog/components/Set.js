import React, {Component} from 'react';
import {wilddog} from '../wilddog'

class Set extends Component{
	handleSumbit(){
		let name = this.refs.name.value;
		let fullname = this.refs.fullname.value;
		let gender = this.refs.gender.value;
		const ref = wilddog.sync().ref('users');
		ref.child(name).set({
			"name": name,
			"fullname": fullname,
			"gender": gender
		},function(error){
			if(error == null){
				console.log('set成功!')
			}else {
				console.log('set失败!')
			}
		})
	}
	render(){
		return (
			<form name="push" noValidate >
				<input type="text" ref="name" name="name" placeholder="plz input name" /><br/>
				<input type="text" ref="fullname" name="fullname" placeholder="plz input full name" /><br/>
				<input type="text" ref="gender" name="gender" placeholder="plz input gender" /><br/>
				<input type="button" name="btn" value="Set" onClick={this.handleSumbit.bind(this)} />
			</form>
		)
	};
}
//make this component available to the app
export default Set;
