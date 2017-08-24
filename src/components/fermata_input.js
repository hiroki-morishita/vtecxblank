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
	Radio,
} from 'react-bootstrap'
import type {
	Props,
	InputEvent	
} from 'demo2.types'



import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'

type State = {		
				   rows: Array<number>,
			isCompleted: boolean,
				isError: boolean,
				 errmsg: string,
		    isForbidden: boolean,
			 	   type: string,
		      creditUse: string,
	         creditPaid: string,
}

export default class ItemInput extends React.Component {
	state: State
	
	constructor(props:Props) {
		super(props)
		this.state = {
				 date_of_rent: moment(),		//お貸出日
				 release_date: moment(),		//放送日・発売日
			 return_date_part: moment(),		//一部返却日
			return_date_final: moment(),		//最終返却日
			return_completion: moment(),		//返却完了日	
			             rows: [1],
						 type: '',
			        creditUse: '',
				   creditPaid: '',
				  isCompleted: false,
					  isError: false,
				 	   errmsg: '',
				  isForbidden: false
		}    
		moment.locale('ja')
		this.setReturn_date = []
		this.setReturn_date[0] = function (date) {
			this.setState({ return_date1: date })
		}.bind(this)
		//setReturn_date配列を作る
		//setReturn_dateの0番目に1行目の日付変更処理の関数をセットする
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

		this.setState({ type: e.target.id })
	}
	RadiohandleChange_creditUse(e: InputEvent) {

		this.setState({ creditUse: e.target.id })
	}
	RadiohandleChange_creditPaid(e: InputEvent) {

		this.setState({ creditPaid: e.target.id })
	}

	static propTypes = {
		hideSidemenu: PropTypes.func
	}

	
	handleSubmit(e:InputEvent){
		e.preventDefault()
		let reqdata = {'feed': {'entry': [] } }
		let entry = {}
		entry.bill = {
					    date_of_rent: e.target.date_of_rent.value ? e.target.date_of_rent.value : '',
			            	  lender: e.target.lender.value ? e.target.lender.value : '',
			          	  lender_tel: e.target.lender_tel.value ? e.target.lender_tel.value : '',	  
						 publication: {
								                         type: this.state.type ? this.state.type : '',
								                other_notices: e.target.other_notices.value  ? e.target.other_notices.value  : '',
								    		   publisher_name: e.target.publisher_name.value ? e.target.publisher_name.value : '',
								      		     program_name: e.target.program_name.value   ? e.target.program_name.value   : '',
								  	  			 release_date: e.target.release_date.value   ? e.target.release_date.value   : '',
				     			   		 		    is_credit: this.state.creditUse ? this.state.creditUse : '',
								  			 prospective_user: e.target.prospective_user.value ? e.target.prospective_user.value : '',	
						  			   			  return_date: {
							  									   part: e.target.return_date_part.value  ? e.target.return_date_part.value  : '',
					                                    	      final: e.target.return_date_final.value ? e.target.return_date_final.value : '',
				                                 },
							  },   
						   'items': [],
						 
			         credit_paid: this.state.creditPaid ? this.state.creditPaid : '',
			   return_completion: e.target.return_completion.value ? e.target.return_completion.value : '',
					     notices: e.target.notices.value ? e.target.notices.value : '',
			  responsible_person: e.target.responsible_person.value ? e.target.responsible_person.value : '',
		}
		
		this.state.rows.map(row => 
			entry.bill.items.push({
				    'brand_name': e.target[     'brand_name' + row].value,
					   'item_no': e.target[        'item_no' + row].value,
					 'item_name': e.target[      'item_name' + row].value,
			   'usage_situation': e.target['usage_situation' + row].value,
				   'return_date': e.target[    'return_date' + row].value,
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
			method: 'post',
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
				this.setState({isError: true,errmsg:error})
			}
		})
	}

	addRow() {
		this.setState(
			(prevState) => ({
				rows: prevState.rows.concat([prevState.rows.length + 1])
			})
		)

		
		const return_date = 'return_date' + (this.state.rows.length + 1)
		this.setReturn_date[this.state.rows.length] = function (date) {
			this.setState({ [return_date]: date })

		}.bind(this)

	}


	HobbyForm(row: number) {
		const      brand_name = 'brand_name' + row
		const 		  item_no = 'item_no' + row
		const 		item_name = 'item_name' + row
		const usage_situation = 'usage_situation' + row
		const 	  return_date = 'return_date' + row
		return(
			<tbody key={row.toString()}>
				<td>
					<Col sm={12}>              
						<FormGroup controlId={brand_name}>
							<FormControl type="text" placeholder="ブランド名">
							</FormControl>
						</FormGroup>
					</Col>
				</td>              
				<td>
					<Col sm={12}>              
						<FormGroup controlId={item_no}>
							<FormControl type="text" placeholder="品番" />
						</FormGroup>
					</Col>
				</td>
				<td>
					<Col sm={12}>              
						<FormGroup controlId={item_name}>
							<FormControl type="text" placeholder="アイテム名" />
						</FormGroup>
					</Col>
				</td><td>
					<Col sm={12}>              
						<FormGroup controlId={usage_situation}>
							<FormControl type="text" placeholder="着用・使用状況" />
						</FormGroup>
					</Col>
				</td><td>
					<Col sm={12}>              
						<FormGroup controlId={return_date}>							
							<DatePicker selected={this.state[return_date]}
								        name={return_date}
								        value={this.state[return_date]}
								        onChange={(e) => this.setReturn_date[row-1](e)} />
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
					<Col sm={8} >					
						<Form horizontal onSubmit={(e)=>this.handleSubmit(e)}>
							<PageHeader>貸出伝票</PageHeader>
							<Col xsOffset={8}
								 smOffset={8}
								 mdOffset={8}
								 lgOffset={8}
								 xlOffset={8}
								 xs={4}sm={4}md={4}lg={4}xl={4}>
								<FormGroup controlId="date_of_rent">        
									<ControlLabel>お貸出日</ControlLabel>
									<DatePicker selected={this.state.date_of_rent}
										name="date_of_rent"
										value={this.state.date_of_rent}
										onChange={(e) => this.DatehandleChange_date_of_rent(e)} />
								</FormGroup>
							</Col>
							
							<FormGroup controlId="lender"> 
								<Col xs={10}sm={10}md={10}lg={10}xl={10}>
									<ControlLabel>貸出先</ControlLabel>
									<FormControl type="text" placeholder="貸出先" />
								</Col>
							</FormGroup>

							<FormGroup controlId="lender_tel">
								<Col xs={10}sm={10}md={10}lg={10}xl={10}>
									<ControlLabel>連絡先</ControlLabel>
									<FormControl type="text" placeholder="連絡先" />
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
									<FormControl type="text" placeholder="その他記入欄" />
								</Col>	
							</FormGroup>
						
							<FormGroup controlId="publisher_name">
								<Col xs={10}sm={10}md={10}lg={10}xl={10}>
									<ControlLabel>局名・出版社名</ControlLabel>
									<FormControl type="text" placeholder="局名・出版社名" />
								</Col>
							</FormGroup>
							
							<FormGroup controlId="program_name">
								<Col xs={10}sm={10}md={10}lg={10}xl={10}>
									<ControlLabel>番組・雑誌名</ControlLabel>
									<FormControl type="text" placeholder="番組・雑誌名" />
								</Col>
							</FormGroup>

							<FormGroup controlId="return_completion">
								<Col xs={10}sm={10} md={10} lg={10} xl={10}>
									<ControlLabel>放送日・発売日</ControlLabel>
									<br/>
									<DatePicker selected={this.state.release_date}
										name="release_date"
										value={this.state.release_date}
										onChange={(e) => this.DatehandleChange_release_date(e)} />
								</Col>
							</FormGroup>

							<FormGroup controlId="IS_CREDIT">
								<Col xs={10} sm={10} md={10} lg={10} xl={10}>
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
									<FormControl type="text" placeholder="着用・使用予定者" />
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

							<br />

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
								{this.state.rows.map(row => this.HobbyForm(row))}
      						</table>

							<FormGroup>
								<Button className="btn btn-default" onClick={() => this.addRow() }>
									<Glyphicon glyph="plus" />
								</Button>
							</FormGroup>

							<FormGroup controlId="CREDIT_PAID">
								<Col xs={10} sm={10} md={10} lg={10} xl={10}>
									<ControlLabel>クレジット払</ControlLabel>	
									<br/>
									<Radio id="credit_Paid"   name="creditP" checked={this.state.creditPaid === 'credit_Paid'}   onChange={(e) => this.RadiohandleChange_creditPaid(e) } inline >有</Radio>
									<Radio id="credit_unPaid" name="creditP" checked={this.state.creditPaid === 'credit_unPaid'} onChange={(e) => this.RadiohandleChange_creditPaid(e) } inline >無</Radio>
								</Col>
							</FormGroup>


							<FormGroup controlId="RETURN_COMPLETION">
								<Col xs={10}sm={10} md={10} lg={10} xl={10}>
									<ControlLabel>返却完了日</ControlLabel>
									<br/>
									<DatePicker selected={this.state.return_completion} name="return_completion"
										value={this.state.return_completion} onChange={(e)=>this.DatehandleChange_return_completion(e)} />
								</Col>
							</FormGroup>
							
							
							
							<FormGroup controlId="notices">
								<Col xs={10}sm={10} md={10} lg={10} xl={10}>
									<ControlLabel>特記事項</ControlLabel>
									<FormControl componentClass="textarea" placeholder="特記事項" />												 
								</Col>
							</FormGroup>

							<FormGroup controlId="responsible_person">
								<Col xs={10}sm={10} md={10} lg={10} xl={10}>
									<ControlLabel>担当者名</ControlLabel>
									<FormControl type="text" placeholder="担当者名"  />
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

ReactDOM.render(<ItemInput />, document.getElementById('container'))
