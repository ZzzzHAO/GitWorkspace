import React, {Component} from 'react';
import {wilddog} from '../wilddog'

class SetPriority extends Component{
	constructor(props){
		super(props);
	}
	handleSumbit(){
		let name = this.refs.name.value;
		let priority = this.refs.priority.value;
		const ref = wilddog.sync().ref('users');
		ref.child(name).setPriority(priority)
    .then(function(){
        console.log('set priority success.')
    })
    .catch(function(err){
        console.log('set priority failed', err.code, err);
    });
	}
	render(){
		return (
			<form name="push" noValidate >
				<input type="text" ref="name" name="name" placeholder="plz input name" /><br/>
				<input type="text" ref="priority" name="priority" placeholder="plz input setPriority" /><br/>
				<input type="button" name="btn" value="提交" onClick={this.handleSumbit.bind(this)} />
			</form>
		)
	};
}
//make this component available to the app
export default SetPriority;
