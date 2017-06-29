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
				  date_of_rent: '',
			            lender: '',
			        lender_tel: '',
			    publisher_name: '',
				  program_name: '',
				  release_date: '',
					 is_credit: false,
			  prospective_user: '',
				   credit_paid: false,
			 return_completion: '',
					   notices: '',
			responsible_person: '',
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
			 		credit_paid: this.state.feed.entry ? this.state.feed.entry[0].bill.credit_paid : '',
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
			lender: e.tarfet.lender.value,
			lender_tel: e.target.lender_tel.value,
				   credit_paid: e.target.credit_paid.value,
			 return_completion: e.targer.return_completion,
					   notices: e.target.notices.value,
			responsible_person: e.target.responsible_person
		}

		entry.publication = {
			drama_series: e.target.publication.drama_series.value,
				 drama_short: e.target.publication.drama_shotr.value,
						 web: e.target.publication.web.value,
					 variety: e.target.publication.variery.value,
					   movie: e.target.publication.movie.value,
				 newsprogram: e.tarfet.publication.newsprogram.value,
			magazine: e.target.publication.magazine.value,
						  cm: e.target.publication.cm.value,
					   other: e.target.publication.other.value,
			  publisher_name: e.target_publication.publisher_name.value,
			program_name: e.target.publication.program_name.value,
			release_date: e.target.publication.release_date.value,
				   is_credit: e.target.publication.is_credit.value,
			prospective_user: e.target.publication.prospective_user.value
		}

		entry.return_date = {
			 part: e.target.part.value,
			final: e.target.final.value
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
							<FormControl type="text" placeholder="ブランド名" value={this.state[brand_name]} name={brand_name} onChange={(e)=>this.handleChange(e)} />
						</FormGroup>
					</Col>
				</td>

				<td>
					<Col sm={12}>
						<FormGroup controlId={item_no}>
							<FormControl type="text" placeholder="品番" value={this.state[item_no]} name={item_no} onChange={(e)=>this.handleChange(e)} />
						</FormGroup>
					</Col>
				</td>

				<td>
					<Col sm={12}>
						<FormGroup controlId={item_name}>
							<FormControl type="text" placeholder="アイテム名" value={this.state[item_name]} name={item_name} onChange={(e)=>this.handleChange(e)} />
						</FormGroup>
					</Col>
				</td>

				<td>
					<Col sm={12}>
						<FormGroup controlId={usagesituation}>
							<FormControl type="text" placeholder="着用・使用状況" value={this.state[usagesituation]} name={usagesituation} onChange={(e)=>this.handleChange(e)} />
						</FormGroup>
					</Col>
				</td>

				<td>
					<Col sm={12}>
						<FormGroup controlId={return_date}>							
							<FormControl type="text" placeholder="返却日" value={this.state[return_date]} name={return_date} onChange={(e)=>this.handleChange(e)} />
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
									<Radio name="media" value="series" >ドラマ(連続)</Radio>
									<Radio name="media" value="short">ドラマ(単発)</Radio>
									<Radio name="media" value="web">WEB</Radio>
									<Radio name="media" value="variety">バラエティー</Radio>
									<Radio name="media" value="movie">映画</Radio>
									<Radio name="media" value="newsprogram">情報・報道番組</Radio>
									<Radio name="media" value="magazine">雑誌</Radio>
									<Radio name="media" value="cm">CM</Radio>
									<Radio name="media" value="other">その他</Radio>
									<FormControl type="text" placeholder="その他" name="publication" />
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
									<Radio name="credit">有</Radio>
									<Radio name="credit">無</Radio>
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
									<ControlLabel>一部</ControlLabel>
									<FormControl type="text" placeholder="一部返却日" name="return_date_part"
										onChange={(e) => this.handleChange(e)}/>
								</Col>
							</FormGroup>

							<FormGroup controlId="return_date_final">
								<Col xs={10}sm={10} md={10} lg={10} xl={10}>
									<ControlLabel>最終</ControlLabel>
									<FormControl type="text" placeholder="最終返却日" name="return_date_final"
										onChange={(e) => this.handleChange(e)}/>
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
									this.state.feed.entry[0].itesm.map((row, key) => this.HobbyForm(key))}
							</table>
								
							<FormGroup cotrolId="credit">
								<Col xs={10}sm={10}md={10}lg={10}xl={10}>
									<ControlLabel>クレジット</ControlLabel>
									<Radio name="credit" value="paid">済</Radio>
									<Radio name="credit" value="unpaid">未</Radio>
								</Col>
							</FormGroup>

							<FormGroup controlId="return_situation">
								<Col xs={10}sm={10} md={10} lg={10} xl={10}>
									<ControlLabel>返却完了日</ControlLabel>
									<FormControl type="text" placeholder="返却完了日" />
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
									<FormControl type="text" placeholder="担当者名" />
								</Col>
							</FormGroup>

							<FormGroup>
								<Button className="btn btn-default" onClick={() => this.addRow() }>
									<Glyphicon glyph="plus" />
								</Button>
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
									<Button type="button" className="btn btn-primary" onClick={(e)=>this.handleDelete(e)}>
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

