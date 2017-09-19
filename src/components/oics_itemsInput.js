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
			 			
				           isCompleted: false,
				               isError: false,
				                errmsg: '',
				           isForbidden: false
		}
		moment.locale('ja')
	}
 
	RadiohandleChange_corporate_type(e: InputEvent) {
		this.setState({ corporate_type:e.target.id })
	}
	RadiohandleChange_sex(e:InputEvent) {
		this.setState({ sex:e.target.id })
	}
	RadiohandleChange_payment_month(e:InputEvent) {
		this.setState({ payment_month:e.target.id })
	}
	RadiohandleChange_payment_method(e: InputEvent) {
		this.setState({ payment_method:e.target.id })
	}

	DatehandleChange_billing_closing_date(date) {
		this.setState({ billing_closing_date:date})
	}
	DatehandleChange_date_of_payment(date) {
		this.setState({ date_of_payment:date})
	}

	static propTypes = {
		hideSidemenu: PropTypes.func
	}

	handleSubmit(e:InputEvent){
		e.preventDefault()
		let reqdata = {'feed': {'entry': [] } }
		let entry = {}
		entry.customer = {
								    corporate_type:         this.state.corporate_type ? this.state.corporate_type : '',			//顧客区分
								     customer_name:      e.target.customer_name.value ? e.target.customer_name.value : '',		//顧客名漢字
			                    customer_name_kana: e.target.customer_name_kana.value ? e.target.customer_name_kana.value : '',	//顧客名カナ
											
								     customer_tel1:      e.target.customer_tel1.value ? e.target.customer_tel1.value : '',		//顧客電話１
								     customer_tel2:      e.target.customer_tel2.value ? e.target.customer_tel2.value : '',		//顧客電話２
								      customer_fax:       e.target.customer_fax.value ? e.target.customer_fax.value : '',		//顧客FAX
												
								   department_name:    e.target.department_name.value ? e.target.department_name.value : '',		//部署名
								    customer_staff:     e.target.customer_staff.value ? e.target.customer_staff.value : '',		//担当者
								  person_in_charge:   e.target.person_in_charge.value ? e.target.person_in_charge.value : '',	//担当社員
											
									 birthday_year:      e.target.birthday_year.value ? e.target.birthday_year.value : '',		//誕生年
			                        birthday_month:     e.target.birthday_month.value ? e.target.birthday_month.value : '',		//誕生月
									  birthday_day:       e.target.birthday_day.value ? e.target.birthday_day.value : '',		//誕生日
										
								               sex:                    this.state.sex ? this.state.sex : '',					//性別
								    email_address1:     e.target.email_address1.value ? e.target.email_address1.value : '',		//メールアドレス１
								    email_address2:     e.target.email_address2.value ? e.target.email_address2.value : '',		//メールアドレス２
														
								          zip_code:           e.target.zip_code.value ? e.target.zip_code.value : '',			//郵便番号
								        prefecture:         e.target.prefecture.value ? e.target.prefecture.value : '',			//都道府県
								          address1:           e.target.address1.value ? e.target.address1.value : '',			//市区町村
								          address2:           e.target.address2.value ? e.target.address2.value : '',			//建物、部屋番号
			                parent_customer_number: e.target.parent_customer_number.value ? e.target.parent_customer_number.value : '',	//親顧客コード
		}

		entry.account_info = {
						      billing_closing_date: e.target.billing_closing_date.value ? e.target.billing_closing_date.value : '',		//請求締日
							       date_of_payment: e.target.date_of_payment.value ? e.target.date_of_payment.value : '',				//支払日
								     payment_month: this.state.payment_month ? this.state.payment_month : '',				//支払月区分
			                        payment_method: this.state.payment_method ? this.state.payment_method : '',				//支払い方法
								     account_class: e.target.account_class.value ? e.target.account_class.value : '',			//口座区分
			                        account_number: e.target.account_number.value ? e.target.account_number.value : '',			//店名＋口座区分
		}
		
		reqdata.feed.entry.push(entry)
		console.log('reqdata.feed=' + JSON.stringify(reqdata.feed.entry))
		//console.log('entry.customer=' + JSON.stringify(reqdata.entry.customer))
		//console.log('entry.account_info='+JSON.stringify(reqdata.entry.account_info))

		/*  for pagination test
		for (let i = 1; i < 100; i++) {
			let entry2 = {}
			entry2.userinfo = { id : i, email : e.target.email.value }
			entry2.favorite = { food : e.target.food.value, music : e.target.music.value }
			reqdata.feed.entry.push(entry2)
		}
*/
		axios({
			url: '/d/customer?_addids=1',
			method: 'put',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			},
			data: {}
		}).then((response) => {
			console.log(JSON.stringify(response))
			reqdata.feed.entry[0].customer.customer_number = ('000000' + response.data.feed.title).slice(-7)
			
			axios({
				url: '/d/customer',
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
											
									<FormGroup controlId="corporate_type">
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel class="text-right">顧客区分</ControlLabel>
										</Col>
										<Col xs={4}sm={4}md={4}lg={4}xl={4}>
											<Radio id="1" name="corpotate_type" checked={this.state.corporate_type === '1'}
												onChange={(e) => this.RadiohandleChange_corporate_type(e)} inline>個人</Radio>
											<Radio id="2" name="corpotate_type" checked={this.state.corporate_type === '2'}
												onChange={(e) => this.RadiohandleChange_corporate_type(e)} inline>法人</Radio>
										</Col>
									</FormGroup>
											
									<FormGroup>
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>顧客名(漢字)姓、名</ControlLabel>
										</Col>
										<Col xs={3}sm={3}md={3}lg={3}xl={3}>
											<FormControl id="customer_name" type="text" placeholder="顧客名（漢字）姓、名" />
										</Col>

										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>顧客名(カナ)</ControlLabel>
										</Col>	
										<Col xs={3}sm={3}md={3}lg={3}xl={3}>		
											<FormControl id="customer_name_kana" type="text" placeholder="顧客名（カナ）" />
										</Col>
									</FormGroup>
										
									<FormGroup >
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>電話１</ControlLabel>
										</Col>
										<Col xs={3} sm={3} md={3} lg={3} xl={3}>
											<FormControl id="customer_tel1" type="text" placeholder="電話１" />
										</Col>

										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>電話２</ControlLabel>
										</Col>
										<Col xs={3} sm={3} md={3} lg={3} xl={3}>		
											<FormControl id="customer_tel2" type="text" placeholder="電話２" />
										</Col>	
									</FormGroup>
									
									<FormGroup controlId="customer_fax">
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>FAX</ControlLabel>
										</Col>
										<Col xs={3}sm={3}md={3}lg={3}xl={3}>
											<FormControl type="text" placeholder="FAX" />
										</Col>
									</FormGroup>
									
									<FormGroup controlId="department_name">
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>部署名</ControlLabel>
										</Col>
										<Col xs={3}sm={3}md={3}lg={3}xl={3}>
											<FormControl type="text" placeholder="部署名" />
										</Col>
									</FormGroup>
										


									<FormGroup controlId="customer_staff">
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>担当者</ControlLabel>
										</Col>
										<Col xs={3}sm={3}md={3}lg={3}xl={3}>
											<FormControl type="text" placeholder="担当者" />
										</Col>
									</FormGroup>

									<FormGroup controlId="person_in_charge">
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>担当社員</ControlLabel>
										</Col>
										<Col xs={3}sm={3}md={3}lg={3}xl={3}>
											<FormControl type="text" placeholder="担当社員" />
										</Col>
									</FormGroup>
								
									<FormGroup >
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>生年月日</ControlLabel>
										</Col>
										<Col xs={3}sm={3}md={3}lg={3}xl={3}>
											<FormControl id="birthday_year" type="text" placeholder="年" />
										</Col>
										<Col xs={3}sm={3}md={3}lg={3}xl={3}>
											<FormControl id="birthday_month" type="text" placeholder="月" />
										</Col>
										<Col xs={3}sm={3}md={3}lg={3}xl={3}>
											<FormControl id="birthday_day" type="text" placeholder="日" />
										</Col>
									</FormGroup>

									<FormGroup controlId="sex">
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>性別</ControlLabel>
										</Col>
										<Col xs={4}sm={4}md={4}lg={4}xl={4}>
											<Radio id="sex_man" name="sex" checked={this.state.sex === 'sex_man'}
												onChange={(e) => this.RadiohandleChange_sex(e)} inline>男</Radio>
											<Radio id="sex_woman" name="sex" checked={this.state.sex === 'sex_woman'}
												onChange={(e) => this.RadiohandleChange_sex(e)} inline>女</Radio>
										</Col>
									</FormGroup>

									<FormGroup>
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>メールアドレス１</ControlLabel>
										</Col>
										<Col xs={3} sm={3} md={3} lg={3} xl={3}>
											<FormControl id="email_address1" type="email" placeholder="メールアドレス１" />
										</Col>

										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>メールアドレス２</ControlLabel>
										</Col>
										<Col xs={3} sm={3} md={3} lg={3} xl={3}>
											<FormControl id="email_address2" type="email" placeholder="メールアドレス２" />
										</Col>
									</FormGroup>								
									

									<FormGroup controlId="zip_code">
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>郵便番号</ControlLabel>
										</Col>
										<Col xs={4}sm={4}md={4}lg={4}xl={4}>
											<FormControl type="text" placeholder="郵便番号" />
										</Col>
									</FormGroup>

									<FormGroup controlId="prefecture">
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>住所（都道府県）</ControlLabel>
										</Col>
										<Col xs={4}sm={4}md={4}lg={4}xl={4}>
											<FormControl componentClass="select" placeholder="都道府県">
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
											<FormControl type="text" placeholder="住所(市区町村)" />
										</Col>
									</FormGroup>

									<FormGroup controlId="address2">
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>建物名、部屋番号</ControlLabel>
										</Col>
										<Col xs={4}sm={4}md={4}lg={4}xl={4}>
											<FormControl type="text" placeholder="建物名、部屋番号" />
										</Col>
									</FormGroup>
								
									<FormGroup controlId="parent_customer_number">
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>親顧客コード</ControlLabel>
										</Col>
										<Col xs={4}sm={4}md={4}lg={4}xl={4}>
											<FormControl type="text" placeholder="親顧客コード" />
										</Col>
									</FormGroup>
									
								</Panel>
								
								 <Panel collapsible header="請求情報" eventKey="2" bsStyle="info">
								
									<FormGroup controlId="billing_closing_date">
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>請求締日</ControlLabel>
										</Col>
										<Col xs={4}sm={4}md={4}lg={4}xl={4}>
											<DatePicker selected={this.state.billing_closing_date}
												name="billing_closing_date"
												value={this.state.billing_closing_date}
												onChange={(e) => this.DatehandleChange_billing_closing_date(e)} />
										</Col>
									</FormGroup>

									<FormGroup controlId="date_of_payment">
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>支払日</ControlLabel>
										</Col>
										<Col xs={4}sm={4}md={4}lg={4}xl={4}>
											<DatePicker selected={this.state.date_of_payment}
												name="date_of_payment"
												value={this.state.date_of_payment}
												onChange={(e) => this.DatehandleChange_date_of_payment(e)} />
										</Col>
									</FormGroup>

									<FormGroup controlId="payment_month">
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>支払月区分</ControlLabel>
										</Col>
										<Col xs={4}sm={4}md={4}lg={4}xl={4}>
											<Radio id="0" name="payment_month" checked={this.state.payment_month === '0'}
												onChange={(e) => this.RadiohandleChange_payment_month(e)} inline>当月</Radio>
											<Radio id="1" name="payment_month" checked={this.state.payment_month === '1'}
												onChange={(e) => this.RadiohandleChange_payment_month(e)} inline>翌月</Radio>
											<Radio id="2" name="payment_month" checked={this.state.payment_month === '2'}
												onChange={(e) => this.RadiohandleChange_payment_month(e)} inline>翌々月</Radio>
										</Col>
									</FormGroup>

									<FormGroup controlId="payment_method">
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>支払方法</ControlLabel>
										</Col>
										<Col xs={4}sm={4}md={4}lg={4}xl={4}>
											<Radio id="2" name="payment_method" checked={this.state.payment_method === '2'}
												onChange={(e) => this.RadiohandleChange_payment_method(e)} inline>集金</Radio>
											<Radio id="3" name="payment_method" checked={this.state.payment_method === '3'}
												onChange={(e) => this.RadiohandleChange_payment_method(e)} inline>振込</Radio>
											<br />	   
											<Radio id="4" name="payment_method" checked={this.state.payment_method === '4'}
												onChange={(e) => this.RadiohandleChange_payment_method(e)} inline>分割払い</Radio>
											<Radio id="9" name="payment_method" checked={this.state.payment_method === '9'}
												onChange={(e) => this.RadiohandleChange_payment_method(e)} inline>その他</Radio>
										</Col>
									</FormGroup>

									<FormGroup controlId="account_class">
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>口座区分</ControlLabel>
										</Col>
										<Col xs={4}sm={4}md={4}lg={4}xl={4}>
											<FormControl type="text" placeholder="口座区分(1:管理)" />
										</Col>
									</FormGroup>

									<FormGroup controlId="account_number">
										<Col xs={2} sm={2} md={2} lg={2} xl={2}>
											<ControlLabel>店名＋口座番号</ControlLabel>
										</Col>
										<Col xs={4}sm={4}md={4}lg={4}xl={4}>
											<FormControl type="text" placeholder="店名＋口座番号" />
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
