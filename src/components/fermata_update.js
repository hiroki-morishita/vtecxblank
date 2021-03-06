/* @flow */
import axios from 'axios'
import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import {
	Grid,
	Row,
	Form,
	Col,
	FormGroup,
	Button,
	ControlLabel,
	PageHeader,
	Glyphicon,
	FormControl,
	Radio
} from 'react-bootstrap'
import type {
	State,
	Props,
	InputEvent
} from 'demo2.types'

import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'

export default class ItemUpdate extends React.Component {
	state: State
	entrykey: string
	
	constructor(props:Props) {
		super(props)
		this.state = {
							 feed: {},
			
				  	 date_of_rent: '',		//貸出日
			        	   lender: '',		//貸出先	
					   lender_tel: '',		//貸出先連絡
					   
						     type: '',
			        other_notices: '',
					
			       publisher_name: '',		//局名・出版社名
					 program_name: '',		//番組名・雑誌名
					 release_date: moment(),//放送日
					    creditUse: '',	
				 prospective_user: '',		//着用者
				 
			    return_date_part: moment(),
			   return_date_final: moment(),
				
					  creditPaid: '',	    //クレジット済
			   return_completion: moment(), //返却完了日
					   	 notices: '',		//備考
			  responsible_person: '',		//担当者

				   	 isCompleted: false,
					   isDeleted: false,
					     isError: false,
			              errmsg: '',
				     isForbidden: false
		}
		moment.locale('ja')
		this.setReturn_date = []
		this.setReturn_date[0] = function(date) {
			this.setState({ return_date1: date })
		}.bind(this)
		this.entrykey
	}

	DatehandleChange_date_of_rent(date) {
		this.setState({ date_of_rent: date })
	}
	DatehandleChange_release_date(date) {
		this.setState({ release_date: date } )
	}
	DatehandleChange_return_date_part(date) {
		this.setState({ return_date_part: date })
	}
	DatehandleChange_return_date_final(date) {
		this.setState({ return_date_final: date })
	}
	DatehandleChange_return_completion(date) {
		this.setState({ return_completion: date })
	}

	RadiohandleChange_type(e: InputEvent) {
		this.setState({ type:e.target.id })
	}

	RadiohandleChange_creditUse(e: InputEvent) {
		this.setState({ creditUse: e.target.id })
	}

	RadiohandleChange_creditPaid(e: InputEvent) {
		this.setState({ creditPaid:e.target.id })
	}

	static propTypes = {
		hideSidemenu: PropTypes.func
	}

	initValue() {
		this.setState({
				   date_of_rent: this.state.feed.entry ? moment(Date.parse(this.state.feed.entry[0].bill.date_of_rent)) : moment(),
					 	 lender: this.state.feed.entry ? this.state.feed.entry[0].bill.lender : '',
					 lender_tel: this.state.feed.entry ? this.state.feed.entry[0].bill.lender_tel : '',
					
					       type: this.state.feed.entry ? this.state.feed.entry[0].bill.publication.type : '',
				  other_notices:(this.state.feed.entry &&this.state.feed.entry[0].bill.publication.type === 'other' ) ? this.state.feed.entry[0].bill.publication.other_notices : '',
			
				 publisher_name: this.state.feed.entry ? this.state.feed.entry[0].bill.publication.publisher_name : '',
				   program_name: this.state.feed.entry ? this.state.feed.entry[0].bill.publication.program_name : '',
				   
				   release_date: this.state.feed.entry ? moment(Date.parse(this.state.feed.entry[0].bill.publication.release_date)) : moment(),
				   
				   	  creditUse: this.state.feed.entry ? this.state.feed.entry[0].bill.publication.is_credit : '',
			  
			   prospective_user: this.state.feed.entry ? this.state.feed.entry[0].bill.publication.prospective_user : '',
			
			   return_date_part: this.state.feed.entry ? moment(Date.parse(this.state.feed.entry[0].bill.publication.return_date.part)) : moment(),
			  return_date_final: this.state.feed.entry ? moment(Date.parse(this.state.feed.entry[0].bill.publication.return_date.final)) : moment(),
			
					 creditPaid: this.state.feed.entry ? this.state.feed.entry[0].bill.credit_paid : '',
					
			  return_completion: this.state.feed.entry ? moment(Date.parse(this.state.feed.entry[0].bill.return_completion)) : moment(),
			 			notices: this.state.feed.entry ? this.state.feed.entry[0].bill.notices : '',
			 responsible_person: this.state.feed.entry ? this.state.feed.entry[0].bill.responsible_person : ''
		})
		
		this.state.feed.entry[0].bill.items.map(
			(items, i) => {
				const 	   brand_name = 'brand_name' + i
				const 		  item_no = 'item_no' + i
				const 	    item_name = 'item_name' + i
				const usage_situation = 'usage_situation' + i
				const 	  return_date = 'return_date' + i

				
				this.setState({
					                    [brand_name]: items.brand_name,
										   [item_no]: items.item_no,
										 [item_name]: items.item_name,
								   [usage_situation]: items.usage_situation,
									   [return_date]: items.return_date ? moment(Date.parse(items.return_date)) : moment()	
				})
				
				this.setReturn_date[i] = function (date) {
					this.setState({ [return_date]: date })
				}.bind(this)

			}
		)
	}

	
	componentWillMount() {

		this.entrykey = location.search.substring(1)
		
		axios({
			url: '/d/registration/'+this.entrykey+'?e',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
			this.setState({feed:response.data.feed})
			this.initValue()
		}).catch((error) => {
			if (error.response) {
				this.setState({ isError: true, errmsg: error.message })
			}
		})   
	}

	handleDelete(e: InputEvent) {
		e.preventDefault()
		axios({
			// 削除の場合、エントリーキー?r=エントリーID
			url: '/d/registration/' + this.entrykey,
			method: 'delete',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}

		}).then( () => {
			this.setState({ isDeleted: true })
			alert('成功')
		}).catch((error) => {
			if (error.response&&error.response.status===401) {
				this.setState({isForbidden: true})
			} else if (error.response.status === 403) {
				alert('実行権限がありません。ログインからやり直してください。')
				location.href = 'login.html'
			} else {
				this.setState({isError: true,errmsg:error.response.data.feed.title})
			} 
		})
		
	}


	handleSubmit(e: InputEvent) {
	
		e.preventDefault()
		let reqdata = {'feed': {'entry': [] } }
		let entry = {}
		// 更新の際に必要となるキー
		entry.link = this.state.feed.entry ? this.state.feed.entry[0].link : ''
		// idを指定すると楽観的排他チェックができる。,の右の数字がリビジョン(更新回数)
		//		entry.id = this.state.feed.entry[0].id
		entry.bill = {
			  	    	date_of_rent: e.target.date_of_rent.value,
			            	  lender: e.target.lender.value,
			          	  lender_tel: e.target.lender_tel.value,	  
					 	 publication: {
						 			 				    type: this.state.type,
							   				   other_notices: e.target.other_notices.value,
								    		  publisher_name: e.target.publisher_name.value,
								      			program_name: e.target.program_name.value,
								  	  			release_date: e.target.release_date.value,
				     			   		 		   is_credit: this.state.creditUse,
								  			prospective_user: e.target.prospective_user.value,	
						  			   			 return_date: {
							  									 		part: e.target.return_date_part.value,
					                                   		   		   final: e.target.return_date_final.value,
				                                 },
							  },   
						   'items': [],
						 
					 credit_paid: this.state.creditPaid,
					 
			   return_completion: e.target.return_completion.value,
					     notices: e.target.notices.value,
			  responsible_person: e.target.responsible_person.value,
		}
		
		this.state.feed.entry[0].bill.items.map((row,key) => 
			entry.bill.items.push({
				    'brand_name': e.target[     'brand_name' + key].value,
					   'item_no': e.target[        'item_no' + key].value,
					 'item_name': e.target[      'item_name' + key].value,
			   'usage_situation': e.target['usage_situation' + key].value,
				   'return_date': e.target[    'return_date' + key].value,
			})
		)

		reqdata.feed.entry.push(entry)

		/*  for pagination test
		for (let i = 1; i < 100; i++) {
			let entry2 = {}
			entry2.userinfo = { id : i, email : e.target.email.value }
			entry2.favorite = { food : e.target.food.value, music : e.target.music.value }
			reqdata.feed.entry.push(entry2)
		}
		*/
    
		
		axios({
			url: '/d/registration',
			method: 'put',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			},
			data : reqdata

		}).then( () => {
			this.setState({isCompleted: true})
		}).catch((error) => {
			if (error.response&&error.response.status===401) {
				this.setState({isForbidden: true})
			} else if (error.response.status === 403) {
				alert('実行権限がありません。ログインからやり直してください。')
				location.href = 'login.html'
			} else {
				this.setState({isError: true,errmsg:error.response.data.feed.title})
			} 
		})
	}

	addRow() {
		this.setState(
			(prevState) =>
				({feed: ((prevState) => { 
					if (!prevState.feed.entry[0].bill.items) {
						prevState.feed.entry[0].bill.items = []
					
					}
					prevState.feed.entry[0].bill.items.push({
						        brand_name: '',
								   item_no: '',
								 item_name: '',
						   usage_situation: '',
							   return_date: moment(),
					})
					return prevState.feed
				})(prevState)
				})
		)
		

		const return_date = 'return_date' + (this.state.feed.entry[0].bill.items.length)
		this.setReturn_date[this.state.feed.entry[0].bill.items.length] = function (date) {
			this.setState({ [return_date]: date })
		}.bind(this)

	}

	HobbyForm(key: number) {
		const 	   brand_name = 'brand_name'+key
		const 	 	  item_no = 'item_no'+key
		const 	    item_name = 'item_name'+key
		const usage_situation = 'usage_situation'+key
		const     return_date = 'return_date' + key
		return(
			<tbody key={key.toString()}>
				<td>
					<Col sm={12}>
						<FormGroup controlId={brand_name}>
							<FormControl type="text" placeholder="ブランド名"
										 value={this.state[brand_name]}
										 name={brand_name}
										 onChange={(e) => this.handleChange(e)} />
						</FormGroup>
					</Col>
				</td>

				<td>
					<Col sm={12}>
						<FormGroup controlId={item_no}>
							<FormControl type="text" placeholder="品番"
										 value={this.state[item_no]}
										 name={item_no}
										 onChange={(e) => this.handleChange(e)} />
						</FormGroup>
					</Col>
				</td>

				<td>
					<Col sm={12}>
						<FormGroup controlId={item_name}>
							<FormControl type="text"
										 placeholder="アイテム名"
										 value={this.state[item_name]}
										 name={item_name} onChange={(e) => this.handleChange(e)} />
						</FormGroup>
					</Col>
				</td>

				<td>
					<Col sm={12}>
						<FormGroup controlId={usage_situation}>
							<FormControl type="text"
										 placeholder="着用・使用状況"
										 value={this.state[usage_situation]}
										 name={usage_situation}
										 onChange={(e) => this.handleChange(e)} />
						</FormGroup>
					</Col>
				</td>

				<td>
					<Col sm={12}>
						<FormGroup controlId={return_date}>							
							<DatePicker selected={this.state[return_date]}
								        name={return_date}
								        value={this.state[return_date]}
								        onChange={(e) => this.setReturn_date[key](e)} />
						</FormGroup>
					</Col>
					
				</td>
			</tbody>
		)
				
	}
  
	handleChange(e: InputEvent) {
		this.setState({ [e.target.name]: e.target.value })	
	}

	render() {
	
		return (
			<Grid>
				<Row>
		    		<a href="#menu-toggle" className="btn btn-default" id="menu-toggle" onClick={this.props.hideSidemenu}><i className="glyphicon glyphicon-menu-hamburger"></i></a>        
				</Row>
				<Row>
					<br/>
				</Row>
				<Row>
					<Col sm={8} >					
						<Form horizontal onSubmit={(e)=>this.handleSubmit(e)}>
							<PageHeader>貸出伝票</PageHeader>

							<FormGroup controlId="date_of_rent">
								<Col xsOffset={8}
									 smOffset={8}
									 mdOffset={8}
									 lgOffset={8}
									 xlOffset={8}
									 xs={4}sm={4}md={4}lg={4}xl={4}>
									<ControlLabel>お貸出日</ControlLabel>
									<DatePicker selected={this.state.date_of_rent}
										        name="date_of_rent"
										        value={this.state.date_of_rent}
										        onChange={(e) => this.DatehandleChange_date_of_rent(e)} />
								</Col>
							</FormGroup>

						
							<FormGroup controlId="lender">
								<Col xs={10}sm={10} md={10} lg={10} xl={10}>
									<ControlLabel>貸出先</ControlLabel>
									<FormControl type="text"
												 placeholder="貸出先"
												 name="lender"
												 value={this.state.lender}
												 onChange={(e) => this.handleChange(e)} />
								</Col>
							</FormGroup>


							<FormGroup controlId="lender_tel">
								<Col xs={10}sm={10} md={10} lg={10} xl={10}>
									<ControlLabel>連絡先</ControlLabel>
									<FormControl type="text"
												 placeholder="連絡先"
												 name="lender_tel"
												 value={this.state.lender_tel}
												 onChange={(e) => this.handleChange(e)} />
								</Col>
							</FormGroup>

							<h3>使用媒体</h3>
							<FormGroup controlId="publication">
								<Col xs={10}sm={10}md={10}lg={10}xl={10}>
									<Radio id="drama_series" name="media" checked={this.state.type === 'drama_series'} onChange={(e) => this.RadiohandleChange_type(e)} inline>ドラマ(連続)</Radio>
									<Radio id="drama_short"  name="media" checked={this.state.type === 'drama_short'}  onChange={(e) => this.RadiohandleChange_type(e)} inline>ドラマ(単発)</Radio>
									<Radio id="web" 		 name="media" checked={this.state.type === 'web'} 		   onChange={(e) => this.RadiohandleChange_type(e)} inline>WEB</Radio>
									<Radio id="variety" 	 name="media" checked={this.state.type === 'variety'} 	   onChange={(e) => this.RadiohandleChange_type(e)} inline>バラエティー</Radio>
									<br />
									<Radio id="movie" 		 name="media" checked={this.state.type === 'movie'} 	   onChange={(e) => this.RadiohandleChange_type(e)} inline>映画</Radio>
									<Radio id="newsprogram"  name="media" checked={this.state.type === 'newsprogram'}  onChange={(e) => this.RadiohandleChange_type(e)} inline>情報・報道番組</Radio>
									<Radio id="magazine" 	 name="media" checked={this.state.type === 'magazine'} 	   onChange={(e) => this.RadiohandleChange_type(e)} inline>雑誌</Radio>
									<Radio id="cm" 			 name="media" checked={this.state.type === 'cm'} 		   onChange={(e) => this.RadiohandleChange_type(e)} inline>CM</Radio>
									<br />
									<Radio id="other" 		 name="media" checked={this.state.type === 'other'} 	   onChange={(e) => this.RadiohandleChange_type(e)} inline>その他</Radio>
								</Col>
							</FormGroup>

							<FormGroup controlId="other_notices">
								<Col xs={10}sm={10}md={10}lg={10}xl={10}>
									<FormControl type="text"
												 placeholder="その他記入欄"
												 name="other_notices"
												 value={this.state.other_notices}
												 onChange={(e) => this.handleChange(e)} />
								</Col>
							</FormGroup>	
									
							<FormGroup controlId="publisher_name">
								<Col xs={10}sm={10} md={10} lg={10} xl={10}>
									<ControlLabel>局名・出版社名</ControlLabel>
									<FormControl type="text"
											 	 placeholder="局名・出版社名"
												 name="publisher_name"
												 value={this.state.publisher_name}
												 onChange={(e) => this.handleChange(e)} />
								</Col>
							</FormGroup>

							<FormGroup controlId="program_name">
								<Col xs={10}sm={10} md={10} lg={10} xl={10}>
									<ControlLabel>番組名・雑誌名</ControlLabel>
									<FormControl type="text"
												 placeholder="番組名・雑誌名"
												 name="program_name"
												 value={this.state.program_name}
												 onChange={(e) => this.handleChange(e)} />
								</Col>
							</FormGroup>

							<FormGroup controlId="release_date">
								<Col xs={10}sm={10}md={10}lg={10}xl={10}>
									<ControlLabel>放送日・発売日</ControlLabel>
									<br/>
									<DatePicker selected={this.state.release_date}
										        name="release_date"
										        value={this.state.release_date}
										        onChange={(e) => this.DatehandleChange_release_date(e)} />
								</Col>
							</FormGroup>

							<FormGroup cotrolId="is_credit">
								<Col xs={10}sm={10}md={10}lg={10}xl={10}>
									<ControlLabel>クレジット</ControlLabel>
									<br/>
									<Radio id="credit_Use" name="is_credit" checked={this.state.creditUse === 'credit_Use'}
										   onChange={(e) => this.RadiohandleChange_creditUse(e)} inline>有</Radio>
									<Radio id="credit_unUsed" name="is_credit" checked={this.state.creditUse === 'credit_unUsed'}
										   onChange={(e) => this.RadiohandleChange_creditUse(e)} inline>無</Radio>
								</Col>
							</FormGroup>

							<FormGroup controlId="prospective_user">
								<Col xs={10}sm={10} md={10} lg={10} xl={10}>
									<ControlLabel>着用・使用予定者</ControlLabel>
									<FormControl type="text" placeholder="着用・使用予定者" name="prospective_user"
												 value={this.state.prospective_user} onChange={(e) => this.handleChange(e)} />
								</Col>
							</FormGroup>


							<h3>返却日</h3>
							<FormGroup controlId="return_date_part">
								<Col xs={10}sm={10} md={10} lg={10} xl={10}>
									<ControlLabel>一部返却日</ControlLabel>
									<br/>
									<DatePicker selected={this.state.return_date_part}
											    name="return_date_part"
											    value={this.state.return_date_part}
											    onChange={(e) => this.DatehandleChange_return_date_part(e)} />
								</Col>
							</FormGroup>

							<FormGroup controlId="return_date_final">
								<Col xs={10}sm={10} md={10} lg={10} xl={10}>
									<ControlLabel>最終返却日</ControlLabel>
									<br/>
									<DatePicker selected={this.state.return_date_final}
										        name="return_date_final"
										        value={this.state.return_date_final}
										        onChange={(e) => this.DatehandleChange_return_date_final(e)} />
								</Col>
							</FormGroup>


							
							<table className="table">
								<thead>
									<tr>
										<th>ブランド名</th>
										<th>品番</th>
										<th>アイテム名</th>
										<th>着用・使用状況</th>
										<th>返却日</th>
									</tr>
								</thead>
								{this.state.feed.entry && this.state.feed.entry[0].bill.items &&
								 this.state.feed.entry[0].bill.items.map((row, key) => this.HobbyForm(key))
								}
							</table>
							
							<FormGroup>
								<Button className="btn btn-default" onClick={() => this.addRow() }>
									<Glyphicon glyph="plus" />
								</Button>
							</FormGroup>
							
							<FormGroup cotrolId="is_credit">
								<Col xs={10}sm={10}md={10}lg={10}xl={10}>
									<ControlLabel>クレジット払</ControlLabel>
									<br/>
									<Radio id="credit_Paid" name="creditP" checked={this.state.creditPaid === 'credit_Paid'}
										   onChange={(e) => this.RadiohandleChange_creditPaid(e)} inline >有</Radio>
									<Radio id="credit_unPaid" name="creditP" checked={this.state.creditPaid === 'credit_unPaid'}
										   onChange={(e) => this.RadiohandleChange_creditPaid(e)} inline >無</Radio>
								</Col>
							</FormGroup>
							

							<FormGroup controlId="return_completion">
								<Col xs={10}sm={10} md={10} lg={10} xl={10}>
									<ControlLabel>返却完了日</ControlLabel>
									<br/>
									<DatePicker selected={this.state.return_completion}
										        name="return_completion"
										        value={this.state.return_completion}
										        onChange={(e) => this.DatehandleChange_return_completion(e)} />
								</Col>
							</FormGroup>

							<FormGroup controlId="notices">
								<Col xs={10}sm={10} md={10} lg={10} xl={10}>
									<ControlLabel>特記事項</ControlLabel>
									<FormControl componentClass="textarea" placeholder="特記事項" name="notices"
												 value={this.state.notices} onChange={(e) => this.handleChange(e)}/>
												 
								</Col>
							</FormGroup>

							<FormGroup controlId="responsible_person">
								<Col xs={10}sm={10} md={10} lg={10} xl={10}>
									<ControlLabel>担当者名</ControlLabel>
									<FormControl type="text" placeholder="担当者名" name="responsible_person"
												 value={this.state.responsible_person} onChange={(e) => this.handleChange(e)}/>
								</Col>
							</FormGroup>
							
							<br/>
							{ this.state.isForbidden &&
								<FormGroup>
									<div className="alert alert-danger">
										<a href="login.html">ログイン</a>を行ってから実行してください。
									</div>
								</FormGroup>
							}

							{this.state.isError &&
								<FormGroup>
									<div className="alert alert-danger">
              						データ更新に失敗しました。<br/>
										{this.state.errmsg}
									</div>
								</FormGroup>
							}

							{ this.state.isCompleted &&
								<FormGroup>
									<div>
      								データを更新しました。
									</div>
								</FormGroup>
							}

							{ this.state.isDeleted &&
								<FormGroup>
									<div>
      								データを削除しました。
									</div>
								</FormGroup>
							}
							
							<FormGroup>
								<Col smOffset={2} sm={4}>
									<Button type="submit" className="btn btn-primary">
              						更新
									</Button>
								</Col>
								<Col smOffset={2} sm={4}>
									<Button type="button" className="btn btn-primary"
										onClick={(e) => this.handleDelete(e)}>
              						削除
									</Button>
								</Col>
							</FormGroup>
						</Form>
					</Col>  
					<Col sm={4} >
					</Col>  
				</Row>				
			</Grid>
		)
	}
}

ReactDOM.render(<ItemUpdate />, document.getElementById('container'))

