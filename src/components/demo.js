/* @flow */
import '../styles/demo.css'
import '../styles/simple-sidebar.css'
import axios from 'axios'
import React from 'react'
import ReactDOM from 'react-dom'

//import ListItems from './demo_listitems'
//import ItemInput from './demo_iteminput'
//import ItemUpdate from './demo_itemupdate'

//import ListItems from './fermata_listitems'
//import ItemInput from './fermata_input'
//import ItemUpdate from './fermata_update'

import ListItems from './oics_customerList'
import CustomerInput from './oics_customerinput'
import ItemUpdate from './oics_customerupdate'

//import ListItems from './oics_orderList'
//import CustomerInput from './oics_orderInput'
//import ItemUpdate from './oics_orderUpdate'

//import ListItems from './oics_itemsList'
//import CustomerInput from './oics_itemsInput'
//import ItemUpdate from './oics_itemsUpdate'

import {
	BrowserRouter as Router,
	Route,
	Link,
	Switch,
	Redirect
} from 'react-router-dom'
import type {
	InputEvent
} from 'demo.types'



class DemoContainer extends React.Component {
	constructor(props) {
		super(props)
		this.state = { condition: 'toggled', search: null }    
	}

	hideSidemenu(e:InputEvent){
		e.preventDefault()
		this.setState( { condition : !this.state.condition } )
	} 

	listitems = (props) => {
		return (
			<ListItems 
				hideSidemenu={(e)=>this.hideSidemenu(e)} 
				history={props.history}
			/>
		)
	}
	
	
	customerinput = () => {
		return (
			<CustomerInput 
				hideSidemenu={(e)=>this.hideSidemenu(e)} 
			/>
		)
	}

	customerupdate = () => {
		return (
			<ItemUpdate 
				hideSidemenu={(e)=>this.hideSidemenu(e)} 
			/>
		)
	}
	



	logout() {
		axios({
			url: '/d/?_logout',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then( () => {
			location.href = 'login.html'
		}).catch(() => {
			location.href = 'login.html'
		})
	}


	


	

	render() {
		return (
			<Router>
				<div id="wrapper" className={this.state.condition ? 'toggled' :''}>

					<div id="sidebar-wrapper">
						<ul className="sidebar-nav">
							<li><Link to="/customerinput">入力</Link></li>
							<li><Link to="/listitems">一覧</Link></li>
							<li><a onClick={ () => this.logout() }>logout</a></li>
						</ul>
					</div>
                        
					<div id="page-content-wrapper">
						<Switch>
							<Route path="/customerinput" component={this.customerinput} />
							<Route path="/listitems" component={this.listitems} />
							<Route path="/customerupdate" component={this.customerupdate} />
						</Switch>	
					</div>    
					<Redirect to='/customerinput' />
				</div>      
			</Router>            
		)
	}
}

ReactDOM.render(<DemoContainer />, document.getElementById('container'))

