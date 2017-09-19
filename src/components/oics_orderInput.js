/* @flow */
import axios from 'axios'
import React from 'react'
import PropTypes from 'prop-types'
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
	Radio,
	PanelGroup,
	Panel,
} from 'react-bootstrap'
import type {
	Props,
	InputEvent	
} from 'demo3.types'



import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'

type State = {
		order_comments_rows: Array<number>,
		contact_method_rows: Array<number>,
				isCompleted: boolean,
					isError: boolean,
					 errmsg: string,
				isForbidden: boolean,
}


export default class ItemInput extends React.Component {
	state: State
	
	constructor(props:Props) {
		super(props)
		this.state = {
			                order_date: moment(),	//受注日付 DatePicker
						   order_class: '',			//受注区分 ラジオボタン管理
			                    status: '',			//ステータス ラジオボタン管理
				   order_comments_rows:[1],
				   contact_method_rows:[1],
				           isCompleted: false,
				               isError: false,
				                errmsg: '',
				           isForbidden: false
		}
		moment.locale('ja')

		this.setComment_date = []
		this.setComment_date[0] = function (date) {
			this.setState({ comment_date1: date })
		}.bind(this)

		this.setContact_to = []
		this.setContact_to[0] = function (e: InputEvent) {
			this.setState({ contact_to1 : e.target.id })
		}.bind(this)

		this.setMethod = []
		this.setMethod[0] = function (e: InputEvent) {
			this.setState({ method1 : e.target.id })
		}.bind(this)

	}
 
	RadiohandleChange_order_class(e: InputEvent) {
		this.setState({ order_class:e.target.id })
	}
	RadiohandleChange_status(e: InputEvent) {
		this.setState({ status: e.target.id })
	}
	DatehandleChange_billing_closing_date(date) {
		this.setState({ order_date:date })
	}

	static propTypes = {
		hideSidemenu: PropTypes.func
	}

	handleSubmit(e:InputEvent){
		e.preventDefault()
		let reqdata = {'feed': {'entry': [] } }
		let entry = {}
		entry.order = {
			order_date: this.state.order_date ? this.state.order_date : moment(),			//顧客区分




			'order_comments': [],
			//'contact_method': [],
		}
		

		this.state.order_comments_rows.map(row => 
			entry.order.order_comments.push({
					 'comment': e.target[ 'comment' + row].value,
				'comment_date': e.target[ 'comment_date' + row].value,
			})
		)

		
		this.state.contact_method_rows.map(row => 
			entry.order.contact_method.push({
				'contact_to': e.target[ 'contact_to' + row].value,
				'method': e.target[ 'method' + row].value,
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
			url: '/d/order?_addids=1',
			method: 'put',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			},
			data: {}
		}).then((response) => {
			reqdata.feed.entry[0].order.order_number = ('000000' + response.data.feed.title).slice(-7)
			reqdata.feed.entry[0].link = [{ '___href': '/order/'+reqdata.feed.entry[0].order.order_number, '___rel': 'self' }]
			
			axios({
				url: '/d/order',
				method: 'post',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				},
				data: reqdata

			}).then(() => {
				this.setState({ isCompleted: true })
				alert('成功')

			}).catch((error) => {
				if (error.response && error.response.status === 401) {
					this.setState({ isForbidden: true })
				} else if (error.response && error.response.status === 403) {
					alert('実行権限がありません。ログインからやり直してください。')
					location.href = 'login.html'
				} else {
					this.setState({ isError: true, errmsg: error.response.status })
				}
			})
		})
	}
  
	order_comments_addRow() {
		this.setState(
			(prevState) => ({
				order_comments_rows: prevState.order_comments_rows.concat([prevState.order_comments_rows.length + 1])
			})
		)
		
		const comment_date = 'comment_date' + (this.state.order_comments_rows.length + 1)
		this.setComment_date[this.state.order_comments_rows.length] = function (date) {
			this.setState({ [comment_date]: date })
		}.bind(this)

	}

	OrderCommentsForms(row: number) {
		const comment = 'comment' + row
		const comment_date = 'comment_date' + row
		return(
			<tbody key={row.toString()}>

				<td>
					<Col sm={12}>              
						<FormGroup controlId={comment_date}>							
							<DatePicker selected={this.state[comment_date]}
								        name={comment_date}
								        value={this.state[comment_date]}
								        onChange={(e) => this.setComment_date[row-1](e)} />
						</FormGroup>
					</Col>
				</td>

				<br />
				
				<td>
					<Col sm={12}>              
						<FormGroup controlId={comment}>
							<FormControl componentClass="textarea" placeholder="特記事項" />
						</FormGroup>
					</Col>
				</td>
			</tbody>
		)
	}

	contact_method_addRow() {
		this.setState(
			(prevState) => ({
				contact_method_rows: prevState.contact_method_rows.concat([prevState.contact_method_rows.length + 1])
			})
		)
		
		const contact_to = 'contact_to' + (this.state.contact_method_rows.length + 1)
		this.setContact_to[this.state.contact_method_rows.length] = function (e: InputEvent) {
			this.setState({ [contact_to]: e.target.id })
		}.bind(this)


		const method = 'method' + (this.state.contact_method_rows.length + 1)
		this.setMethod[this.state.contact_method_rows.length] = function (e: InputEvent) {
			this.setState({ [method]: e.target.id })
		}.bind(this)
	}


	ContactMethodForms(row: number) {
		const contact_to = 'contact_to' + row
		const     method = 'method' + row
		return(
			<tbody key={row.toString()}>

				<td>
					<Col sm={12}>              
						<FormGroup controlId={contact_to}>							
							<Radio id="1" name="contact_to" checked={this.state[contact_to] === '1'}
								   onChange={(e) => this.setContact_to[row-1](e)} inline>注文顧客</Radio>             
							<Radio id="2" name="contact_to" checked={this.state[contact_to] === '2'}
								   onChange={(e) => this.setContact_to[row-1](e)} inline>請求</Radio>
						</FormGroup>
					</Col>
				</td>

				<br />
				
				<td>
					<Col sm={12}>              
						<FormGroup controlId={method}>
							<Radio id="1" name="method" checked={this.state[method] === '1'}
								   onChange={(e) => this.setMethod[row-1](e)} inline>メール</Radio>             
							<Radio id="2" name="method" checked={this.state[method] === '2'}
								   onChange={(e) => this.setMethod[row-1](e)} inline>メール２</Radio>
						</FormGroup>
					</Col>
				</td>
			</tbody>
		)
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
					<Col xs={12} sm={12} md={12} lg={12} xl={12} >					
						<Form horizontal onSubmit={(e)=>this.handleSubmit(e)}>
							<PageHeader>顧客情報</PageHeader>
							

							<PanelGroup defaultActiveKey="1">
								<Panel collapsible header="顧客情報" eventKey="1" bsStyle="info">
                                            
									<FormGroup>
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel class="text-right">受注日</ControlLabel>
										</Col>
										<Col xs={4}sm={4}md={4}lg={4}xl={4}>
											<DatePicker selected={this.state.order_date}
                                                		name="order_date"
                                                		value={this.state.order_date}
                                                		onChange={(e) => this.DatehandleChange_order_date(e)} />
										</Col>
									</FormGroup>
                                                                            
									<FormGroup controlId="order_class">
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>受注区分</ControlLabel>
										</Col>
										<Col xs={4}sm={4}md={4}lg={4}xl={4}>
											<FormControl componentClass="select" placeholder="受注区分">
												<option value="1">WEB</option>
												<option value="2">TEL</option>
												<option value="3">営業</option>
												<option value="9">その他</option>
											</FormControl>
										</Col>
									</FormGroup>
                                    
									<FormGroup>
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>売上支店</ControlLabel>
										</Col>
										<Col xs={3} sm={3} md={3} lg={3} xl={3}>        
											<FormControl id="sales_branch" type="text" placeholder="売上視点" />
										</Col>  
									</FormGroup>
                                    
									<FormGroup>
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>売上社員</ControlLabel>
										</Col>
										<Col xs={3} sm={3} md={3} lg={3} xl={3}>        
											<FormControl id="sales_staff" type="text" placeholder="売上社員" />
										</Col>  
									</FormGroup>

									<FormGroup>
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>紹介者番号</ControlLabel>
										</Col>
										<Col xs={3} sm={3} md={3} lg={3} xl={3}>        
											<FormControl id="introducer" type="text" placeholder="紹介者番号" />
										</Col>  
									</FormGroup>

									<FormGroup>
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>配送コメント</ControlLabel>
										</Col>
										<Col xs={3} sm={3} md={3} lg={3} xl={3}>        
											<FormControl id="delivery_comment" type="text" placeholder="配送コメント" />
										</Col>  
									</FormGroup>

									<FormGroup>
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>出荷コメント</ControlLabel>
										</Col>
										<Col xs={3} sm={3} md={3} lg={3} xl={3}>        
											<FormControl id="shipment_comment" type="text" placeholder="出荷コメント" />
										</Col>  
									</FormGroup>

									
									<table className="order_comments">
										<thead>
											<tr>
												<th>コメント日付</th>
												<th>受注コメント</th>
											</tr>
										</thead>
										{this.state.order_comments_rows.map(row => this.OrderCommentsForms(row))}
      								</table>

									<FormGroup>
										<Button className="btn btn-default" onClick={() => this.order_comments_addRow() }>
											<Glyphicon glyph="plus" />
										</Button>
									</FormGroup>

									
									<table className="contact_method">
										<thead>
											<tr>
												<th>連絡先</th>
												<th>連絡方法</th>
											</tr>
										</thead>
										{this.state.contact_method_rows.map(row => this.ContactMethodForms(row))}
      								</table>

									<FormGroup>
										<Button className="btn btn-default" onClick={() => this.contact_method_addRow() }>
											<Glyphicon glyph="plus" />
										</Button>
									</FormGroup>


                                    
									<FormGroup>
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>ステータス</ControlLabel>
										</Col>
										<Col xs={3} sm={3} md={3} lg={3} xl={3}>
											<Radio id="1" name="status" checked={this.state.status === '1'}
												onChange={(e) => this.RadiohandleChange_status(e)} inline>受付</Radio>
                                                
											<Radio id="2" name="status" checked={this.state.status === '2'}
												onChange={(e) => this.RadiohandleChange_status(e)} inline>確定</Radio>

											<Radio id="3" name="status" checked={this.state.status === '3'}
												onChange={(e) => this.RadiohandleChange_status(e)} inline>出荷指示</Radio>
                                            
											<Radio id="4" name="status" checked={this.state.status === '4'}
												onChange={(e) => this.RadiohandleChange_status(e)} inline>出荷済</Radio>
                                            
											<Radio id="5" name="status" checked={this.state.status === '5'}
												onChange={(e) => this.RadiohandleChange_status(e)} inline>配完</Radio>
                                            
											<Radio id="6" name="status" checked={this.state.status === '6'}
												onChange={(e) => this.RadiohandleChange_status(e)} inline>回収支持</Radio>
                                            
											<Radio id="7" name="status" checked={this.state.status === '7'}
												onChange={(e) => this.RadiohandleChange_status(e)} inline>回収済</Radio>
                                            
											<Radio id="8" name="status" checked={this.state.status === '8'}
												onChange={(e) => this.RadiohandleChange_status(e)} inline>回収完了</Radio>
										</Col>  
									</FormGroup>

								</Panel>    
							</PanelGroup>











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
              						データ登録に失敗しました。<br/>
										{this.state.errmsg}
									</div>
								</FormGroup>
							}

							{ this.state.isCompleted &&
								<FormGroup>
									<div>
      								データを登録しました。
									</div>
								</FormGroup>
							}

							<FormGroup>
								<Col smOffset={4} sm={12}>
									<Button type="submit" className="btn btn-primary">
              						登録
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

//ReactDOM.render(<ItemInput />, document.getElementById('container'))
