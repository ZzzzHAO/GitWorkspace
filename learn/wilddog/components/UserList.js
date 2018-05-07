import React, { Component } from 'react'
import { wilddog } from '../wilddog'
import { isEmpty, forIn, assign } from 'lodash'
import { Table, thead, tr, th, tbody, td } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default class UserList extends Component {
	render() {
		const { isLoading, data = [] } = this.props.collection;
		return (
			<Table responsive>
				<thead>
					<tr>
						<th>#</th>
						<th>Full name</th>
						<th>Gender</th>
						<th></th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{
						userArr.map((user, index) => {
							return <tr key={index}>
								<td>{index}</td>
								<td>{user.fullname}</td>
								<td>{user.gender}</td>
								<td><Link to='/edit/:name'>edit</Link></td>
								<td><a>del</a></td>
							</tr>
						})
					}
					<tr>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td>{userArr.length ? <Link to='/push'>add</Link> : <Link to='/set'>add</Link>}</td>
					</tr>
				</tbody>
			</Table>
		)
	}
}
