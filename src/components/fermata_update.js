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
					   
					 drama_series: false,
					  drama_short: false,
					   		  web: false,
					   	  variety: false,
					   		movie: false,
					  newsprogram: false,
					   	 magazine: false,
					   		   cm: false,
					   		other: false,
			        other_notices: '',
					
			       publisher_name: '',		//局名・出版社名
					 program_name: '',		//番組名・雑誌名
					 release_date: '',		//放送日
					   credit_use: false,	//クレジット有
				    credit_unUsed: false,   //クレジット無
				 prospective_user: '',		//着用者
				 
				 return_date_part: '',
			    return_date_final: '',
				 
					  credit_paid: false,	//クレジット済
			        credit_unPaid: false,	//クレジット未
			 	return_completion: '',		//返却完了日
					   	  notices: '',		//備考
			   responsible_person: '',		//担当者
			
				   	  isCompleted: false,
					    isDeleted: false,
					      isError: false,
			               errmsg: '',
				      isForbidden: false
		} 
		this.entrykey
	}
 
	static propTypes = {
		hideSidemenu: PropTypes.func
	}

	initValue() {
		this.setState({
				   date_of_rent: this.state.feed.entry ? this.state.feed.entry[0].bill.date_of_rent : '',
						 lender: this.state.feed.entry ? this.state.feed.entry[0].bill.lender : '',
					 lender_tel: this.state.feed.entry ? this.state.feed.entry[0].bill.lender_tel : '',
					 
				   drama_series: this.state.feed.entry ? this.state.feed.entry[0].publication.drama_series : false,
			        drama_short: this.state.feed.entry ? this.state.feed.entry[0].publication.drama_short : false,
			                web: this.state.feed.entry ? this.state.feed.entry[0].publication.web : false,
			            variety: this.state.feed.entry ? this.state.feed.entry[0].publication.variety : false,
						  movie: this.state.feed.entry ? this.state.feed.entry[0].publication.movie : false,
			        newsprogram: this.state.feed.entry ? this.state.feed.entry[0].publication.newsprogram : false,
					   magazine: this.state.feed.entry ? this.state.feed.entry[0].publication.magazine : false,
							 cm: this.state.feed.entry ? this.state.feed.entry[0].publication.cm : false,
						  other: this.state.feed.entry ? this.state.feed.entry[0].publication.other : false,
				  other_notices: this.state.feed.entry ? this.state.feed.entry[0].publication.other_notices : '',
				  
				 publisher_name: this.state.feed.entry ? this.state.feed.entry[0].publication.publisher_name : '',
				   program_name: this.state.feed.entry ? this.state.feed.entry[0].publication.program_name : '',
				   release_date: this.state.feed.entry ? this.state.feed.entry[0].publication.release_date : '',
				     credit_use: this.state.feed.entry ? this.state.feed.entry[0].publication.is_credit : false,
				  credit_unUsed: this.state.feed.entry ? this.state.feed.entry[0].publication.is_credit ? false : true :false,
			   prospective_user: this.state.feed.entry ? this.state.feed.entry[0].publication.prospective_user : '',

			   return_date_part: this.state.feed.entry ? this.state.feed.entry[0].return_date.part : '',
			  return_date_final: this.state.feed.entry ? this.state.feed.entry[0].return_date.final : '',

			  		credit_paid: this.state.feed.entry ? this.state.feed.entry[0].bill.credit_paid : false,
				  credit_unPaid: this.state.feed.entry ? this.state.feed.entry[0].bill.credit_paid ? false : true : false,
			  return_completion: this.state.feed.entry ? this.state.feed.entry[0].bill.return_completion : '',
			 			notices: this.state.feed.entry ? this.state.feed.entry[0].bill.notices : '',
			 responsible_person: this.state.feed.entry ? this.state.feed.entry[0].bill.responsible_person : ''
		})

		this.state.feed.entry[0].items.map(
			(items, i) => {
				const 	  brand_name = 'brand_name' + i
				const 		 item_no = 'item_no' + i
				const 	   item_name = 'item_name' + i
				const usagesituation = 'usagesituation' + i
				const    return_date = 'return_date' + i
				this.setState({
					[brand_name]: items.brand_name,
						   [item_no]: items.item_no,
						 [item_name]: items.item_name,
					[usagesituation]: items.usagesituation,
					   [return_date]: items.return_date		
				})
			}
		)
	}

	componentWillMount() {
		this.entrykey = location.search.substring(1)
		console.log(this.entrykey)
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
			this.setState({isDeleted: true})
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

	handleSubmit(e:InputEvent){
		e.preventDefault()
		let reqdata = { 'feed': { 'entry': [] } }
		let entry = {}
		// 更新の際に必要となるキー
		entry.link = this.state.feed.entry ? this.state.feed.entry[0].link : ''
		// idを指定すると楽観的排他チェックができる。,の右の数字がリビジョン(更新回数)
		//		entry.id = this.state.feed.entry[0].id
		entry.bill = {
				  date_of_rent: e.target.date_of_rent.value,
			            lender: e.target.lender.value,
			        lender_tel: e.target.lender_tel.value,

			       credit_paid: this.state.credit_paid ? true : false,	//払済or未払い
			 
			 return_completion: e.target.return_completion,
					   notices: e.target.notices.value,
			responsible_person: e.target.responsible_person
		}

		entry.publication = {
			    drama_series: this.state.drama_series,
				 drama_short: this.state.drama_short,
						 web: this.state.web,
					 variety: this.state.variery,
					   movie: this.state.movie,
				 newsprogram: this.state.newsprogram,
			        magazine: this.state.magazine,
						  cm: this.state.cm,
					   other: this.state.other,
			   other_notices: this.state.other ? e.target.publication.other_notices : '',
			   
			  publisher_name: e.target.publisher_name.value,
			    program_name: e.target.program_name.value,
			    release_date: e.target.release_date.value,
				
			       is_credit: this.state.credit_use ? true : false, //使用or未使用
			
			prospective_user: e.target.prospective_user.value
		}

		entry.return_date = {
			 part: e.target.return_date_part.value,
			final: e.target.return_date_final.value
		}

		entry.items = []

	
		this.state.feed.entry[0].items.map((row,key) => 
			entry.items.push({
				    'brand_name': e.target['brand_name' + key].value,
					   'item_no': e.target['item_no' + key].value,
					 'item_name': e.target['item_name' + key].value,
				'usagesituation': e.target['usagesituation' + key].value,
				   'return_date': e.target['return_date'+key].value
			})
		)
		reqdata.feed.entry.push(entry)
    
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
		this.setState((prevState) => ({
			feed: ((prevState) => { 
				if (!prevState.feed.entry[0].items) {
					prevState.feed.entry[0].items = []
				}
				prevState.feed.entry[0].items.push({
					brand_name: '',
					   	   item_no: '',
						 item_name: '',
					usagesituation: '',
					   return_date: ''
				})
				return prevState.feed				
			})(prevState)
		}))			
	}

	HobbyForm(key: number) {
		const 	  brand_name = 'brand_name'+key
		const 	 	 item_no = 'item_no'+key
		const 	   item_name = 'item_name'+key
		const usagesituation = 'usagesituation'+key
		const 	 return_date = 'return_date'+key
		return(
			<tbody key={key.toString()}>
				<td>
					<Col sm={12}>
						<FormGroup controlId={brand_name}>
							<FormControl type="text" placeholder="ブランド名" value={this.state[brand_name]}
										 name={brand_name} onChange={(e) => this.handleChange(e)} />
						</FormGroup>
					</Col>
				</td>

				<td>
					<Col sm={12}>
						<FormGroup controlId={item_no}>
							<FormControl type="text" placeholder="品番" value={this.state[item_no]}
										 name={item_no} onChange={(e) => this.handleChange(e)} />
						</FormGroup>
					</Col>
				</td>

				<td>
					<Col sm={12}>
						<FormGroup controlId={item_name}>
							<FormControl type="text" placeholder="アイテム名" value={this.state[item_name]}
										 name={item_name} onChange={(e) => this.handleChange(e)} />
						</FormGroup>
					</Col>
				</td>

				<td>
					<Col sm={12}>
						<FormGroup controlId={usagesituation}>
							<FormControl type="text" placeholder="着用・使用状況" value={this.state[usagesituation]}
									 	 name={usagesituation} onChange={(e) => this.handleChange(e)} />
						</FormGroup>
					</Col>
				</td>

				<td>
					<Col sm={12}>
						<FormGroup controlId={return_date}>							
							<FormControl type="text" placeholder="返却日" value={this.state[return_date]}
										 name={return_date} onChange={(e) => this.handleChange(e)} />
						</FormGroup>
					</Col>
				</td>
			</tbody>
		)
	}
  
	handleChange(event:InputEvent) {
		this.setState({ [event.target.name]: event.target.value })
	}

	render() {
		return (
			<Grid>
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
									<FormControl type="text" placeholder="お貸出日" name="date_of_rent"
												 value={this.state.date_of_rent} onChange={(e) => this.handleChange(e)} />
								</Col>
							</FormGroup>

							
							<FormGroup controlId="lender">
								<Col xs={10}sm={10} md={10} lg={10} xl={10}>
									<ControlLabel>貸出先</ControlLabel>
									<FormControl type="text" placeholder="貸出先" name="lender"
												 value={this.state.lender} onChange={(e) => this.handleChange(e)} />
								</Col>
							</FormGroup>


							<FormGroup controlId="lender_tel">
								<Col xs={10}sm={10} md={10} lg={10} xl={10}>
									<ControlLabel>連絡先</ControlLabel>
									<FormControl type="text" placeholder="連絡先" name="lender_tel"
												 value={this.state.lender_tel} onChange={(e) => this.handleChange(e)} />
								</Col>
							</FormGroup>

							<h3>使用媒体</h3>
							<FormGroup controlId="publication">
								<Col xs={10}sm={10}md={10}lg={10}xl={10}>
									<Radio name="media" value="series" inline>ドラマ(連続)</Radio>
									<Radio name="media" value="short" inline>ドラマ(単発)</Radio>
									<Radio name="media" value="web" inline>WEB</Radio>
									<Radio name="media" value="variety" inline>バラエティー</Radio>
									<br />
									<Radio name="media" value="movie" inline>映画</Radio>
									<Radio name="media" value="newsprogram" inline>情報・報道番組</Radio>
									<Radio name="media" value="magazine" inline>雑誌</Radio>
									<Radio name="media" value="cm" inline>CM</Radio>
									<br />
									<Radio name="media" value="other" inline>その他</Radio>
									<FormControl type="text" placeholder="その他" name="other_notices"
												 value={this.state.other_notices} onChange={(e) => this.handleChange(e)}/>
								</Col>
							</FormGroup>

							<FormGroup controlId="publisher_name">
								<Col xs={10}sm={10} md={10} lg={10} xl={10}>
									<ControlLabel>局名・出版社名</ControlLabel>
									<FormControl type="text" placeholder="局名・出版社名" name="publisher_name"
												 value={this.state.publisher_name} onChange={(e) => this.handleChange(e)} />
								</Col>
							</FormGroup>

							<FormGroup controlId="program_name">
								<Col xs={10}sm={10} md={10} lg={10} xl={10}>
									<ControlLabel>番組名・雑誌名</ControlLabel>
									<FormControl type="text" placeholder="番組名・雑誌名" name="program_name"
												 value={this.state.program_name} onChange={(e) => this.handleChange(e)} />
								</Col>
							</FormGroup>

							<FormGroup controlId="release_date">
								<Col xs={10}sm={10}md={10}lg={10}xl={10}>
									<ControlLabel>放送日・発売日</ControlLabel>
									<FormControl type="text" placeholder="放送日・発売日" name="release_date"
												 value={this.state.release_date} onChange={(e) => this.handleChange(e)} />
								</Col>
							</FormGroup>

							<FormGroup cotrolId="is_credit">
								<Col xs={10}sm={10}md={10}lg={10}xl={10}>
									<ControlLabel>クレジット</ControlLabel>
									<Radio id="creditUse" name="creditU" value={this.state.credit_use}>有</Radio>
									<Radio id="creditUnused" name="creditU" value={this.state.credit_unUsed}>無</Radio>
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
									<FormControl type="text" placeholder="一部返却日" name="return_date_part"
												 value={this.state.return_date_part} onChange={(e) => this.handleChange(e)}/>
								</Col>
							</FormGroup>

							<FormGroup controlId="return_date_final">
								<Col xs={10}sm={10} md={10} lg={10} xl={10}>
									<ControlLabel>最終返却日</ControlLabel>
									<FormControl type="text" placeholder="最終返却日" name="return_date_final"
												 value={this.state.return_date_final} onChange={(e) => this.handleChange(e)}/>
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
								{this.state.feed.entry && this.state.feed.entry[0].items &&
								 this.state.feed.entry[0].items.map((row, key) => this.HobbyForm(key))}
							</table>
							
							<FormGroup>
								<Button className="btn btn-default" onClick={() => this.addRow() }>
									<Glyphicon glyph="plus" />
								</Button>
							</FormGroup>
							
							<FormGroup cotrolId="credit_paid">
								<Col xs={10}sm={10}md={10}lg={10}xl={10}>
									<ControlLabel>クレジット</ControlLabel>
									<Radio name="creditP" id="creditPaid"  value={this.state.credit_paid}>済</Radio>
									<Radio name="creditP" id="creditUnpaid"value={this.state.credit_unPaid}>未</Radio>
								</Col>
							</FormGroup>

							<FormGroup controlId="return_completion">
								<Col xs={10}sm={10} md={10} lg={10} xl={10}>
									<ControlLabel>返却完了日</ControlLabel>
									<FormControl type="text" placeholder="返却完了日" name="return_completion"
												 value={this.state.return_completion} onChange={(e) => this.handleChange(e)}/>
								</Col>
							</FormGroup>

							<FormGroup controlId="notices">
								<Col xs={10}sm={10} md={10} lg={10} xl={10}>
									<ControlLabel>特記事項</ControlLabel>
									<FormControl componentClass="textarea" placeholder="特記事項" name="nitices"
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

