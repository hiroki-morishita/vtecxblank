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
			order : { 
						order_date: moment(),
						order_number: '',		
						order_class: '',
						sales_branch: '',
						sales_staff: '',
						introducer: '',
						delivery_comment: '',
						shipment_comment: '',
						
						status: '',



			}

		}
		moment.locale('ja')
		this.entrykey
	}

	RadiohandleChange_status(e:InputEvent) {
		this.entry.order.order_class = e.target.id
		this.forceUpdate()
	}

	DatehandleChange_order_date(date) {
		this.entry.order.order_date = date
		this.forceUpdate()
	}

	static propTypes = {
		hideSidemenu: PropTypes.func
	}

	initValue() {
		console.log(JSON.stringify(this.state.feed.entry[0].customer))
		this.entry.order.order_date    = this.state.feed.entry ? this.state.feed.entry[0].order.order_date : ''
		this.entry.order.order_number  = this.state.feed.entry ? this.state.feed.entry[0].order.order_number : ''
		this.entry.order.order_class   = this.state.feed.entry ? this.state.feed.entry[0].order_class : ''
		this.entry.order.sales_branch  = this.state.feed.entry ? this.state.feed.entry[0].sales_branch : ''
		this.entry.order.sales_staff   = this.state.feed.entry ? this.state.feed.entry[0].sales_staff : ''
		this.entry.order.introducer    = this.state.feed.entry ? this.state.feed.entry[0].introducer : ''
		this.entry.order.delivery_comment = this.state.feed.entry ? this.state.feed.entry[0].delivery_comment : ''
		this.entry.order.shipment_comment = this.state.feed.entry ? this.state.feed.entry[0].shipment_comment : ''
		
		
		this.entry.order.status = this.state.feed.entry ? this.state.feed.entry[0].status : ''
		this.forceUpdate()
	}

	
	componentWillMount() {

		this.entrykey = location.search.substring(1)
		
		axios({
			url: '/d/order/'+this.entrykey+'?e',
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
			url: '/d/order/' + this.entrykey,
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
		entry.order = {
						order_date: this.state.order_date,
						order_number: e.target.order_number,
						order_class: this.state.order_class,
						sales_branch: e.target.sales_branch,
						sales_staff: e.target.sales_staff,
						introducer: e.target.introducer,
						delivery_comment: e.target.delivery_comment,
						shipment_comment: e.target.shipment_comment,

						status: e.target.status,
		}


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
			url: '/d/order',
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

	handleChange_order(event:InputEvent) {
		this.entry.order[event.target.name] = event.target.value
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
                                <Panel collapsible header="顧客情報" eventKey="1" bsStyle="info">
                                            
                                    <FormGroup>
                                        <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                                            <ControlLabel class="text-right">受注日</ControlLabel>
                                        </Col>
                                        <Col xs={4}sm={4}md={4}lg={4}xl={4}>
                                            <DatePicker selected={this.entry.order.order_date}
                                                name="order_date"
                                                value={this.entry.order.order_date}
                                                onChange={(e) => this.DatehandleChange_order_date(e)} />
                                        </Col>
                                    </FormGroup>
                                            
                                    <FormGroup>
                                        <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                                            <ControlLabel>受注番号</ControlLabel>
                                        </Col>
                                        <Col xs={3}sm={3}md={3}lg={3}xl={3}>
											<FormControl id="order_number" value={this.entry.order.order_number}
														 type="text" placeholder="受注番号" />
                                        </Col>
                                    </FormGroup>
                                                                            
                                    <FormGroup controlId="order_class">
                                        <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                                            <ControlLabel>受注区分</ControlLabel>
                                        </Col>
                                        <Col xs={4}sm={4}md={4}lg={4}xl={4}>
											<FormControl componentClass="select" value={this.entry.order.order_class} placeholder="受注区分">
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
											<FormControl id="sales_branch" value={this.entry.order.sales_branch}
														 type="text" placeholder="売上視点" />
                                        </Col>  
                                    </FormGroup>
                                    
                                    <FormGroup>
                                        <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                                            <ControlLabel>売上社員</ControlLabel>
                                        </Col>
                                        <Col xs={3} sm={3} md={3} lg={3} xl={3}>        
											<FormControl id="sales_staff" value={this.entry.order.sales_staff}
														 type="text" placeholder="売上社員" />
                                        </Col>  
                                    </FormGroup>

                                    <FormGroup>
                                        <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                                            <ControlLabel>紹介者番号</ControlLabel>
                                        </Col>
                                        <Col xs={3} sm={3} md={3} lg={3} xl={3}>        
											<FormControl id="introducer" value={this.entry.order.introducer}
														 type="text" placeholder="紹介者番号" />
                                        </Col>  
                                    </FormGroup>

                                    <FormGroup>
                                        <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                                            <ControlLabel>配送コメント</ControlLabel>
                                        </Col>
                                        <Col xs={3} sm={3} md={3} lg={3} xl={3}>        
											<FormControl id="delivery_comment" value={this.entry.order.delivery_comment}
													     type="text" placeholder="配送コメント" />
                                        </Col>  
                                    </FormGroup>

                                    <FormGroup>
                                        <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                                            <ControlLabel>出荷コメント</ControlLabel>
                                        </Col>
                                        <Col xs={3} sm={3} md={3} lg={3} xl={3}>        
											<FormControl id="shipment_comment" value={this.entry.order.shipment_comment}
														 type="text" placeholder="出荷コメント" />
                                        </Col>  
                                    </FormGroup>




                                    <FormGroup>
                                        <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                                            <ControlLabel>受注コメント</ControlLabel>
                                        </Col>
                                        <Col xs={3} sm={3} md={3} lg={3} xl={3}>        
											<FormControl id="comment" value={this.entry.order.comment}
														 type="text" placeholder="受注コメント" />
                                        </Col>  
                                    </FormGroup>

                                    <FormGroup>
                                        <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                                            <ControlLabel>連絡先</ControlLabel>
                                        </Col>
                                        <Col xs={3} sm={3} md={3} lg={3} xl={3}>        
											<FormControl id="contact_to" value={this.entry.order.contact_to}
														 type="text" placeholder="連絡先" />
                                        </Col>  
                                    </FormGroup>
                                    
                                    <FormGroup>
                                        <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                                            <ControlLabel>連絡方法</ControlLabel>
                                        </Col>
                                        <Col xs={3} sm={3} md={3} lg={3} xl={3}>        
                                            <FormControl id="method" type="text" placeholder="連絡方法" />
                                        </Col>  
                                    </FormGroup>





                                    
                                    <FormGroup>
                                        <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                                            <ControlLabel>ステータス</ControlLabel>
                                        </Col>
                                        <Col xs={3} sm={3} md={3} lg={3} xl={3}>
                                            <Radio id="1" name="status" checked={this.entry.order.status === '1'}
                                                 onChange={(e) => this.RadiohandleChange_status(e)} inline>受付</Radio>
                                                
                                            <Radio id="2" name="status" checked={this.entry.order.status === '2'}
                                                 onChange={(e) => this.RadiohandleChange_status(e)} inline>確定</Radio>

                                            <Radio id="3" name="status" checked={this.entry.order.status === '3'}
                                                 onChange={(e) => this.RadiohandleChange_status(e)} inline>出荷指示</Radio>
                                            
                                            <Radio id="4" name="status" checked={this.entry.order.status === '4'}
                                                 onChange={(e) => this.RadiohandleChange_status(e)} inline>出荷済</Radio>
                                            
                                            <Radio id="5" name="status" checked={this.entry.order.status === '5'}
                                                 onChange={(e) => this.RadiohandleChange_status(e)} inline>配完</Radio>
                                            
                                            <Radio id="6" name="status" checked={this.entry.order.status === '6'}
                                                 onChange={(e) => this.RadiohandleChange_status(e)} inline>回収支持</Radio>
                                            
                                            <Radio id="7" name="status" checked={this.entry.order.status === '7'}
                                                 onChange={(e) => this.RadiohandleChange_status(e)} inline>回収済</Radio>
                                            
                                            <Radio id="8" name="status" checked={this.entry.order.status === '8'}
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

