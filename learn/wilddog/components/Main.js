import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Push from './Push'
import Set from './Set'
import SetPriority from './SetPriority'
import UserList from './UserList'
import Edit from './Edit'
import withDocument from '../withDocument'

const Main = () => {
	return(
			<main>
				<Switch>
					<Route exact path='/' component={withDocument()(UserList)} />
					<Route path='/edit/:id' component={Edit} />
					<Route path='/set' component={Set} />
					<Route path='/push' component={Push} />
					<Route path='/setPriority' component={SetPriority} />
				</Switch>
			</main>
)}
export default Main
