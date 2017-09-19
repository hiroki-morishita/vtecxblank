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
	FormControl,
	Radio,
	PanelGroup,
	Panel,
} from 'react-bootstrap'
import type {
	Props,
	InputEvent
} from 'demo2.types'

import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'


type State = {
	isCompleted: boolean,
	isDeleted: boolean,
	isError: boolean,
	errmsg: string,
	isForbidden: boolean,
}

export default class CustomerUpdate extends React.Component {
	state: State
	entrykey: string
	
	constructor(props:Props) {
		super(props)
		this.state = {
							   feed: {},
				   	 	isCompleted: false,
					   	  isDeleted: false,
					     	isError: false,
			              	 errmsg: '',
				     	isForbidden: false
		}
		
		this.entry = {
			customer : { 
							       customer_number: '',
							        corporate_type: '',
							         customer_name: '',
							    customer_name_kana: '',
							
							         customer_tel1: '',
							         customer_tel2: '',
							          customer_fax: '',

							       department_name: '',
							        customer_staff: '',
							      person_in_charge: '',

							         birthday_year: '',
							        birthday_month: '',
							          birthday_day: '',

							                   sex: '',
							        email_address1: '',
							        email_address2: '',

							              zip_code: '',
							            prefecture: '',

							              address1: '',
							              address2: '',
				            parent_customer_number: ''
			},
			account_info : {
							  billing_closing_date: moment(),
							       date_of_payment: moment(),
							         payment_month: '',
				                    payment_method: '',
									 account_class: '',
				                    account_number: '',
			}
		}
		moment.locale('ja')
		this.entrykey
	}

	RadiohandleChange_corporate_type(e: InputEvent) {
		this.entry.customer.corporate_type = e.target.id
		this.forceUpdate()
	}
	RadiohandleChange_sex(e:InputEvent) {
		this.entry.customer.sex = e.target.id
		this.forceUpdate()
	}
	RadiohandleChange_payment_month(e:InputEvent) {
		this.entry.account_info.payment_month = e.target.id
		this.forceUpdate()
	}
	RadiohandleChange_payment_method(e: InputEvent) {
		this.entry.account_info.payment_method = e.target.id
		this.forceUpdate()
	}

	DatehandleChange_billing_closing_date(date) {
		this.entry.account_info.billing_closing_date = date
		this.forceUpdate()
	}
	DatehandleChange_date_of_payment(date) {
		this.entry.account_info.date_of_payment = date
		this.forceUpdate()
	}

	static propTypes = {
		hideSidemenu: PropTypes.func
	}

	initValue() {
		this.entry.customer.customer_number    = this.state.feed.entry ? this.state.feed.entry[0].customer.customer_number : ''
		this.entry.customer.corporate_type     = this.state.feed.entry ? this.state.feed.entry[0].customer.corporate_type : ''
		this.entry.customer.customer_name      = this.state.feed.entry ? this.state.feed.entry[0].customer.customer_name : ''
		this.entry.customer.customer_name_kana = this.state.feed.entry ? this.state.feed.entry[0].customer.customer_name_kana : ''
		 
		this.entry.customer.customer_tel1 = this.state.feed.entry ? this.state.feed.entry[0].customer.customer_tel1 : ''
		this.entry.customer.customer_tel2 = this.state.feed.entry ? this.state.feed.entry[0].customer.customer_tel2 : ''
		this.entry.customer.customer_fax  = this.state.feed.entry ? this.state.feed.entry[0].customer.customer_fax : ''
		
		this.entry.customer.department_name  = this.state.feed.entry ? this.state.feed.entry[0].customer.department_name : ''
		this.entry.customer.customer_staff   = this.state.feed.entry ? this.state.feed.entry[0].customer.customer_staff : ''
		this.entry.customer.person_in_charge = this.state.feed.entry ? this.state.feed.entry[0].customer.person_in_charge : ''
		
		this.entry.customer.birthday_year  = this.state.feed.entry ? this.state.feed.entry[0].customer.birthday_day : ''
		this.entry.customer.birthday_month = this.state.feed.entry ? this.state.feed.entry[0].customer.birthday_month : ''
		this.entry.customer.birthday_day   = this.state.feed.entry ? this.state.feed.entry[0].customer.birthday_year : ''
		
		this.entry.customer.sex            = this.state.feed.entry ? this.state.feed.entry[0].customer.sex : ''
		this.entry.customer.email_address1 = this.state.feed.entry ? this.state.feed.entry[0].customer.email_address1 : ''

		this.entry.customer.email_address2 = this.state.feed.entry ? this.state.feed.entry[0].customer.email_address2 : ''
		this.entry.customer.zip_code   = this.state.feed.entry ? this.state.feed.entry[0].customer.zip_code : ''
		this.entry.customer.prefecture = this.state.feed.entry ? this.state.feed.entry[0].customer.prefecture : ''
							
		this.entry.customer.address1 = this.state.feed.entry ? this.state.feed.entry[0].customer.address1 : ''
		this.entry.customer.address2 = this.state.feed.entry ? this.state.feed.entry[0].customer.address2 : ''
		this.entry.customer.parent_customer_number = this.state.feed.entry ? this.state.feed.entry[0].customer.parent_customer_number : ''

		this.entry.account_info.billing_closing = this.state.feed.entry ? moment(Date.parse(this.state.feed.entry[0].account_info.billing_closing)) : moment()
		this.entry.account_info.date_of_payment = this.state.feed.entry ? moment(Date.parse(this.state.feed.entry[0].account_info.date_of_payment)) : moment()
		this.entry.account_info.payment_month   = this.state.feed.entry ? this.state.feed.entry[0].account_info.payment_month : ''
		this.entry.account_info.payment_method  = this.state.feed.entry ? this.state.feed.entry[0].account_info.payment_method : ''
		this.entry.account_info.account_class   = this.state.feed.entry ? this.state.feed.entry[0].account_info.account_class : ''
		this.entry.account_info.account_number = this.state.feed.entry ? this.state.feed.entry[0].account_info.account_number : ''
		this.forceUpdate()
	}

	
	componentWillMount() {

		this.entrykey = location.search.substring(1)
		
		axios({
			url: '/d/customer/'+this.entrykey+'?e',
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
			url: '/d/customer/' + this.entrykey,
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
		let reqdata = {'feed': {'entry': this.entry } } 
		axios({
			url: '/d/customer',
			method: 'put',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			},
			data : reqdata

		}).then(() => {
			this.setState({ isCompleted: true })
			alert('成功')

		}).catch((error) => {
			if (error.response&&error.response.status===401) {
				this.setState({isForbidden: true})
			} else if (error.response&&error.response.status === 403) {
				alert('実行権限がありません。ログインからやり直してください。')
				location.href = 'login.html'
			} else {
				this.setState({isError: true,errmsg:error.response.status})
			}



		})
	}

	handleChange_customer(event:InputEvent) {
		this.entry.customer[event.target.name] = event.target.value
		this.forceUpdate()
	}

	handleChange_account_info(event:InputEvent) {
		this.entry.account_info[event.target.name] = event.target.value
		this.forceUpdate()
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
								<Panel collapsible header="顧客情報" eventKey="1" bsStyle="info" defaultExpanded="true">
											
									<FormGroup controlId="corporate_type">
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel class="text-right">顧客区分</ControlLabel>
										</Col>
										<Col xs={4}sm={4}md={4}lg={4}xl={4}>
											<Radio id="1" name="corpotate_type" checked={this.entry.customer.corporate_type === '1'}
												onChange={(e) => this.RadiohandleChange_corporate_type(e)} inline>個人</Radio>
											<Radio id="2" name="corpotate_type" checked={this.entry.customer.corporate_type === '2'}
												onChange={(e) => this.RadiohandleChange_corporate_type(e)} inline>法人</Radio>
										</Col>
									</FormGroup>
										
									<FormGroup>
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>顧客名(漢字)姓、名</ControlLabel>
										</Col>
										<Col xs={3}sm={3}md={3}lg={3}xl={3}>
											<FormControl name="customer_name" value={this.entry.customer.customer_name}
											   	         type="text" placeholder="顧客名（漢字）姓、名" onChange={(e) => this.handleChange_customer(e)} />
										</Col>

										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>顧客名(カナ)</ControlLabel>
										</Col>	
										<Col xs={3}sm={3}md={3}lg={3}xl={3}>		
											<FormControl name="customer_name_kana" value={this.entry.customer.customer_name_kana}
												         type="text" placeholder="顧客名（カナ）" onChange={(e) => this.handleChange_customer(e)}/>
										</Col>
									</FormGroup>
										
									<FormGroup >
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>電話１</ControlLabel>
										</Col>
										<Col xs={3} sm={3} md={3} lg={3} xl={3}>
											<FormControl name="customer_tel1" value={this.entry.customer.customer_tel1} 
														 type="text" placeholder="電話１" onChange={(e) => this.handleChange_customer(e)}/>
										</Col>

										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>電話２</ControlLabel>
										</Col>
										<Col xs={3} sm={3} md={3} lg={3} xl={3}>
											<FormControl name="customer_tel2" value={this.entry.customer.customer_tel2}
														 type="text" placeholder="電話２" onChange={(e) => this.handleChange_customer(e)}/>
										</Col>	
									</FormGroup>
									
									<FormGroup controlId="customer_fax">
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>FAX</ControlLabel>
										</Col>
										<Col xs={3}sm={3}md={3}lg={3}xl={3}>
											<FormControl name="customer_fax" type="text" value={this.entry.customer.customer_fax} 
														 placeholder="FAX" onChange={(e) => this.handleChange_customer(e)}/>
										</Col>
									</FormGroup>
									
									<FormGroup controlId="department_name">
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>部署名</ControlLabel>
										</Col>
										<Col xs={3}sm={3}md={3}lg={3}xl={3}>
											<FormControl name="department_name" type="text" value={this.entry.customer.department_name} 
														 placeholder="部署名" onChange={(e) => this.handleChange_customer(e)}/>
										</Col>
									</FormGroup>
										


									<FormGroup controlId="customer_staff">
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>担当者</ControlLabel>
										</Col>
										<Col xs={3}sm={3}md={3}lg={3}xl={3}>
											<FormControl name="customer_staff" type="text" value={this.entry.customer.customer_staff} 
														 placeholder="担当者" onChange={(e) => this.handleChange_customer(e)}/>
										</Col>
									</FormGroup>

									<FormGroup controlId="person_in_charge">
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>担当社員</ControlLabel>
										</Col>
										<Col xs={3}sm={3}md={3}lg={3}xl={3}>
											<FormControl name="person_in_charge" type="text" value={this.entry.customer.person_in_charge} 
														 placeholder="担当社員" onChange={(e) => this.handleChange_customer(e)}/>
										</Col>
									</FormGroup>
								
									<FormGroup >
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>生年月日</ControlLabel>
										</Col>
										<Col xs={3}sm={3}md={3}lg={3}xl={3}>
											<FormControl name="birthday_year" value={this.entry.customer.birthday_year} 
														 type="text" placeholder="年" onChange={(e) => this.handleChange(e)}/>
										</Col>
										<Col xs={3}sm={3}md={3}lg={3}xl={3}>
											<FormControl name="birthday_month" value={this.entry.customer.birthday_month} 
														 type="text" placeholder="月" onChange={(e) => this.handleChange(e)}/>
										</Col>
										<Col xs={3}sm={3}md={3}lg={3}xl={3}>
											<FormControl name="birthday_day" value={this.entry.customer.birthday_day} 
														 type="text" placeholder="日" onChange={(e) => this.handleChange(e)}/>
										</Col>
									</FormGroup>

									<FormGroup controlId="sex">
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>性別</ControlLabel>
										</Col>
										<Col xs={4}sm={4}md={4}lg={4}xl={4}>
											<Radio id="sex_man" name="sex" checked={this.entry.customer.sex === 'sex_man'}
												onChange={(e) => this.RadiohandleChange_sex(e)} inline>男</Radio>
											<Radio id="sex_woman" name="sex" checked={this.entry.customer.sex === 'sex_woman'}
												onChange={(e) => this.RadiohandleChange_sex(e)} inline>女</Radio>
										</Col>
									</FormGroup>

									<FormGroup>
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>メールアドレス１</ControlLabel>
										</Col>
										<Col xs={3} sm={3} md={3} lg={3} xl={3}>
											<FormControl name="email_address1" value={this.entry.customer.email_address1} 
														 type="email" placeholder="メールアドレス１" onChange={(e) => this.handleChange_customer(e)}/>
										</Col>

										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>メールアドレス２</ControlLabel>
										</Col>
										<Col xs={3} sm={3} md={3} lg={3} xl={3}>
											<FormControl name="email_address2" value={this.entry.customer.email_address2}
														 type="email" placeholder="メールアドレス２" onChange={(e) => this.handleChange_customer(e)}/>
										</Col>
									</FormGroup>								
									

									<FormGroup controlId="zip_code">
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>郵便番号</ControlLabel>
										</Col>
										<Col xs={4}sm={4}md={4}lg={4}xl={4}>
											<FormControl name="zip_code" type="text" value={this.entry.customer.zip_code}
														 placeholder="郵便番号" onChange={(e) => this.handleChange_customer(e)}/>
										</Col>
									</FormGroup>

									<FormGroup controlId="prefecture">
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>住所（都道府県）</ControlLabel>
										</Col>
										<Col xs={4}sm={4}md={4}lg={4}xl={4}>
											<FormControl name="prefecture" componentClass="select" value={this.entry.customer.prefecture} 
														 placeholder="都道府県" onChange={(e) => this.handleChange_customer(e)} >
												<option value="1">北海道</option>
												<option value="2">青森県</option>
												<option value="3">岩手県</option>
												<option value="4">宮城県</option>
												<option value="5">秋田県</option>
												<option value="6">山形県</option>
												<option value="7">福島県</option>
												<option value="8">茨城県</option>
												<option value="9">栃木県</option>
												<option value="10">群馬県</option>
												<option value="11">埼玉県</option>
												<option value="12">千葉県</option>
												<option value="13">東京都</option>
												<option value="14">神奈川県</option>
												<option value="15">新潟県</option>
												<option value="16">富山県</option>
												<option value="17">石川県</option>
												<option value="18">福井県</option>
												<option value="19">山梨県</option>
												<option value="20">長野県</option>
												<option value="21">岐阜県</option>
												<option value="22">静岡県</option>
												<option value="23">愛知県</option>
												<option value="24">三重県</option>
												<option value="25">滋賀県</option>
												<option value="26">京都府</option>
												<option value="27">大阪府</option>
												<option value="28">兵庫県</option>
												<option value="29">奈良県</option>
												<option value="30">和歌山県</option>
												<option value="31">鳥取県</option>
												<option value="32">島根県</option>
												<option value="33">岡山県</option>
												<option value="34">広島県</option>
												<option value="35">山口県</option>
												<option value="36">徳島県</option>
												<option value="37">香川県</option>
												<option value="38">愛媛県</option>
												<option value="39">高知県</option>
												<option value="40">福岡県</option>
												<option value="41">佐賀県</option>
												<option value="42">長崎県</option>
												<option value="43">熊本県</option>
												<option value="44">大分県</option>
												<option value="45">宮崎県</option>
												<option value="46">鹿児島県</option>
												<option value="47">沖縄県</option>
											</FormControl>
										</Col>
									</FormGroup>

									<FormGroup controlId="address1">
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>住所（市区町村）</ControlLabel>
										</Col>
										<Col xs={4}sm={4}md={4}lg={4}xl={4}>
											<FormControl name="address1" type="text" value={this.entry.customer.address1}
														 placeholder="住所(市区町村)" onChange={(e) => this.handleChange_customer(e)}/>
										</Col>
									</FormGroup>

									<FormGroup controlId="address2">
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>建物名、部屋番号</ControlLabel>
										</Col>
										<Col xs={4}sm={4}md={4}lg={4}xl={4}>
											<FormControl name="address2" type="text" value={this.entry.customer.address2}
														 placeholder="建物名、部屋番号" onChange={(e) => this.handleChange_customer(e)}/>
										</Col>
									</FormGroup>
								
									<FormGroup controlId="parent_customer_number">
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>親顧客コード</ControlLabel>
										</Col>
										<Col xs={4}sm={4}md={4}lg={4}xl={4}>
											<FormControl name="parent_customer_number" type="text" value={this.entry.customer.parent_customer_number}
														 placeholder="親顧客コード" onChange={(e) => this.handleChange_customer(e)}/>
										</Col>
									</FormGroup>
									
								</Panel>
								
								 <Panel collapsible header="請求情報" eventKey="2" bsStyle="info" defaultExpanded="true">
								
									<FormGroup controlId="billing_closing_date">
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>請求締日</ControlLabel>
										</Col>
										<Col xs={4}sm={4}md={4}lg={4}xl={4}>
											<DatePicker selected={this.entry.account_info.billing_closing_date}
												        name="billing_closing_date"
												        value={this.entry.account_info.billing_closing_date}
												        onChange={(e) => this.DatehandleChange_billing_closing_date(e)} />
										</Col>
									</FormGroup>

									<FormGroup controlId="date_of_payment">
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>支払日</ControlLabel>
										</Col>
										<Col xs={4}sm={4}md={4}lg={4}xl={4}>
											<DatePicker selected={this.entry.account_info.date_of_payment}
												        name="date_of_payment"
												        value={this.entry.account_info.date_of_payment}
												        onChange={(e) => this.DatehandleChange_date_of_payment(e)} />
										</Col>
									</FormGroup>

									<FormGroup controlId="payment_month">
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>支払月区分</ControlLabel>
										</Col>
										<Col xs={4}sm={4}md={4}lg={4}xl={4}>
											<Radio id="0" name="payment_month" checked={this.entry.account_info.payment_month === '0'}
												   onChange={(e) => this.RadiohandleChange_payment_month(e)} inline>当月</Radio>
											<Radio id="1" name="payment_month" checked={this.entry.account_info.payment_month === '1'}
												   onChange={(e) => this.RadiohandleChange_payment_month(e)} inline>翌月</Radio>
											<Radio id="2" name="payment_month" checked={this.entry.account_info.payment_month === '2'}
												   onChange={(e) => this.RadiohandleChange_payment_month(e)} inline>翌々月</Radio>
										</Col>
									</FormGroup>

									<FormGroup controlId="payment_method">
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>支払方法</ControlLabel>
										</Col>
										<Col xs={4}sm={4}md={4}lg={4}xl={4}>
											<Radio id="2" name="payment_method" checked={this.entry.account_info.payment_method === '2'}
												   onChange={(e) => this.RadiohandleChange_payment_method(e)} inline>集金</Radio>
											<Radio id="3" name="payment_method" checked={this.entry.account_info.payment_method === '3'}
												   onChange={(e) => this.RadiohandleChange_payment_method(e)} inline>振込</Radio>
											<br />	   
											<Radio id="4" name="payment_method" checked={this.entry.account_info.payment_method === '4'}
												   onChange={(e) => this.RadiohandleChange_payment_method(e)} inline>分割払い</Radio>
											<Radio id="9" name="payment_method" checked={this.entry.account_info.payment_method === '9'}
												   onChange={(e) => this.RadiohandleChange_payment_method(e)} inline>その他</Radio>
										</Col>
									</FormGroup>

									<FormGroup controlId="account_class">
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>口座区分</ControlLabel>
										</Col>
										<Col xs={4}sm={4}md={4}lg={4}xl={4}>
											<FormControl name="account_class" type="text" value={this.entry.account_info.account_class}
														 placeholder="口座区分(1:管理)" onChange={(e) => this.handleChange_account_info(e)}/>
										</Col>
									</FormGroup>

									<FormGroup controlId="account_number">
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>店名＋口座番号</ControlLabel>
										</Col>
										<Col xs={4}sm={4}md={4}lg={4}xl={4}>
											<FormControl name="account_number" type="text" value={this.entry.account_info.account_number}
														 placeholder="店名＋口座番号" onChange={(e) => this.handleChange_account_info(e)}/>
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

ReactDOM.render(<CustomerUpdate />, document.getElementById('container'))

