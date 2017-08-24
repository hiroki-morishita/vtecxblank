/* @flow */
import React from 'react'
import PropTypes from 'prop-types'
import {
	Form,
	Col,
	FormGroup,
	Button,
	ControlLabel,
	FormControl
} from 'react-bootstrap'

import type {
	Props,
	InputEvent
} from 'demo2.types'

import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'


export default class ConditionInputForm extends React.Component {
	
	constructor(props:Props) {
		super(props)
		this.state = {
			date_of_rent: '',
			type:'',
		}
		moment.locale('ja')
	}
 
	static propTypes = {
		search: PropTypes.func
	}

	DatehandleChange_date_of_rent(date) {
		this.setState({ date_of_rent: date })
	}

	handleChange_type(e:InputEvent) {
		this.setState({ type: e.target.value })

	}
	handleSubmit(e:InputEvent){
		e.preventDefault()
		//e.target.email.value
		let condition = ''
		if (this.state.date_of_rent) {
			condition += '&bill.date_of_rent=' + e.target.date_of_rent.value

		}

		if (e.target.lender.value) {
			condition += '&bill.lender='+e.target.lender.value 
		}
		if (e.target.type.value) {
			if (this.state.type === 'other' && e.target.other_notices.value) {
				condition += '&bill.publication.other_notices=' + e.target.other_notices.value
			} else { 
				condition += '&bill.publication.type=' + e.target.type.value
			}

		}
		if (e.target.publisher_name.value) {
			condition += '&bill.publication.publisher_name='+e.target.publisher_name.value 
		}
		if (e.target.program_name.value) {
			condition += '&bill.publication.program_name='+e.target.program_name.value 
		}
		if (e.target.responsible_person.value) {
			condition += '&bill.responsible_person='+e.target.responsible_person.value 
		}
		this.props.search(condition)
	}

	render() {
	
		return (
			<Form horizontal onSubmit={(e)=>this.handleSubmit(e)}>
				
				<Col smOffset={1} sm={3}>
					<FormGroup controlId="date_of_rent">
						<ControlLabel>お貸出日指定</ControlLabel>
						<DatePicker selected={this.state.date_of_rent}
							        name="date_of_rent"
							        value={this.state.date_of_rent}
							        placeholder="お貸出日"
							        onChange={(e) => this.DatehandleChange_date_of_rent(e)} />
					</FormGroup>
				</Col>

				<Col smOffset={1} sm={3}>
					<FormGroup controlId="lender">
						<ControlLabel>貸出先</ControlLabel>
						<FormControl type="text" placeholder="貸出先" />
					</FormGroup>
				</Col>

				<Col smOffset={1} sm={3}>
					<FormGroup controlId='type' onChange={(e) => this.handleChange_type(e)}>
						<ControlLabel>使用媒体指定</ControlLabel>
						<FormControl componentClass="select" placeholder="使用媒体">
									 <option value="">使用媒体</option>
									 <option value="drama_series">連続ドラマ</option>
									 <option value="drama_short">単発ドラマ</option>
									 <option value="web">WEB</option>
									 <option value="variety">バラエティー</option>
									 <option value="movie">映画</option>
									 <option value="newsprogram">情報・報道番組</option>
									 <option value="magazine">雑誌</option>
									 <option value="cm">CM</option>
									 <option value="other" >その他</option>
						</FormControl>
					</FormGroup>
				</Col>
				
				{	this.state.type === 'other' &&
					<Col smOffset={1} sm={3}>
						<FormGroup controlId="other_notices">
							<FormControl type="text" placeholder='その他入力欄' />
						</FormGroup>
					</Col>
				}



				<Col smOffset={1} sm={3}>
					<FormGroup controlId="publisher_name">
						<ControlLabel>局名・出版社名指定</ControlLabel>
						<FormControl type="text" placeholder="局名・出版社名" />
					</FormGroup>
				</Col>  
				<Col smOffset={1} sm={3}>
					<FormGroup controlId="program_name">
						<ControlLabel>番組・雑誌名指定</ControlLabel>
						<FormControl type="text" placeholder="番組名・雑誌名" />
					</FormGroup>
				</Col>
				<Col smOffset={1} sm={3}>
					<FormGroup controlId="responsible_person">
						<ControlLabel>担当者指定</ControlLabel>
						<FormControl type="text" placeholder="担当者" />
					</FormGroup>
				</Col>
				<Col smOffset={10} sm={1}>
					<FormGroup>
						<Button type="submit" className="btn btn-primary">
                  		検索
						</Button>
					</FormGroup>
				</Col>                
			</Form>
		)
	}
}

