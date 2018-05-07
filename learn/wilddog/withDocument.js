import React, { Component } from 'react'
import { wilddog } from './wilddog'
import { isEmpty, forIn, assign } from 'lodash'

export default function withDocument() {
	return function (wrapComponent){
		return class UserAPI extends Component {
			getInitialState() {
				return {
					isLoading: false,
					data: null,
					error: null
				}
			}
			componentWillMount() {
				this.setState({
					isLoading: true
				});
				try {
					const ref = wilddog.sync().ref('users');
					ref.on('value', snapshot => {
						const data = snapshot.val();
						console.log(data)
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
			userArr() {
				const users = this.state.data;
				const arr = [];
				forIn(users, (value, key) => {
					let user = {};
					user.fullname = key;
					user = assign(user, value);
					usersArr.push(user);
				});
				return arr;
			}
			getUser(id) {
				const useArr = userArr();
				const get = (user) => {
					user.id === id;
				}
				return useArr.find(get);
			}
			render() {
				const sharedProps = {
					Collection: {
						isLoading: this.state.isLoading,
						data: this.state.data,
						error: this.state.error,
						userArr: this.userArr.bind(this),
						getUser: this.getUser.bind(this)
					}
				};
				return (
					<wrapComponent {...sharedProps} {...this.props} />
				);
			}
		}
	}
}
