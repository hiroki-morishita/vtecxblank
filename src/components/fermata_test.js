/* @flow */
import React from 'react'

import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'

import ReactDOM from 'react-dom'


class DatePickerTest extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			startDate: moment()
		}
		moment.locale('ja')

		this.handleChange = this.handleChange.bind(this)
	}
 
	handleChange(date) {
		this.setState({
			startDate: date
		})
		console.log(date)
	}
	render() {
		return (
			<DatePicker selected={this.state.startDate} onChange={this.handleChange} />
		)	
	}
}
ReactDOM.render(<DatePickerTest />, document.getElementById('container'))

