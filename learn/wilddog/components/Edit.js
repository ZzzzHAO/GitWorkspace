import React, {Component} from 'react';
import {wilddog} from '../wilddog'

class Set extends Component{
	componentWillMount() {
		this.setState({
			isLoading: true
		});
		try {
			const id = this.props.match.params.id;
			const ref = wilddog.sync().ref('users').child(id);
			ref.on('value', snapshot => {
				const data = snapshot.val();
				this.setState({
					data,
					isLoading: false
				});
			});
		} catch (e) {
			this.setState({
				isLoading: false,
				error: e
			});
		}
	}
	handleSumbit(){
		let name = this.refs.name.value;
		let fullname = this.refs.fullname.value;
		let gender = this.refs.gender.value;
		const ref = wilddog.sync().ref('users');
		ref.child(name).set({
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
				<input type="text" ref="full_name" name="fullname" placeholder="plz input full name" value ={data.fullname} /><br/>
				<input type="text" ref="gender" name="gender" placeholder="plz input gender" value ={data.gender} /><br/>
				<input type="button" name="btn" value="Set" onClick={this.handleSumbit.bind(this)} />
			</form>
		)
	};
}
//make this component available to the app
export default Set;
