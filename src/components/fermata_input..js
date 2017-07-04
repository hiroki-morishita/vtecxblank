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

type State = {
	       rows: Array<number>,
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
				   rows: [1],
			isCompleted: false,
				isError: false,
				 errmsg: '',
			isForbidden: false
		}    
	}
 
	static propTypes = {
		hideSidemenu: PropTypes.func
	}

	handleSubmit(e:InputEvent){
		e.preventDefault()
		let reqdata = {'feed': {'entry': []}}
		let entry = {}
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

		this.state.rows.map(row => 
			entry.items.push({
					'brand_name': e.target['brand_name' + row].value,
					   'item_no': e.target['item_no' + row].value,
					 'item_name': e.target['item_name' + row].value,
				'usagesituation': e.target['usagesituation' + row].value,
				   'return_date': e.target['return_date' + row].value,
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
			rows: prevState.rows.concat([prevState.rows.length+1])
		}))
	}

	HobbyForm(row:number) {
		const 	  brand_name = 'brand_name'+row
		const 	 	 item_no = 'item_no'+row
		const 	   item_name = 'item_name'+row
		const usagesituation = 'usagesituation'+row
		const 	 return_date = 'return_date'+row
		return(
			<tbody key={HTMLTableRowElement.toString()}>
				<td>
					<Col sm={12}>
						<FormGroup controlId={brand_name}>
							<FormControl type="text" placeholder="ブランド名" />
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
				</td>

				<td>
					<Col sm={12}>
						<FormGroup controlId={usagesituation}>
							<FormControl type="text" placeholder="着用・使用状況" />
						</FormGroup>
					</Col>
				</td>

				<td>
					<Col sm={12}>
						<FormGroup controlId={return_date}>							
							<FormControl type="text" placeholder="返却日" />
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
							<PageHeader>新規登録</PageHeader>
							
							<FormGroup controlId="date_of_rent">
								<Col xsOffset={8}
									 smOffset={8}
									 mdOffset={8}
									 lgOffset={8}
									 xlOffset={8}
									 xs={4}sm={4}md={4}lg={4}xl={4}>
									<ControlLabel>お貸出日</ControlLabel>
									<FormControl type="text" placeholder="お貸出日" />
								</Col>
							</FormGroup>

							<FormGroup controlId="lender">
								<Col xs={10}sm={10} md={10} lg={10} xl={10}>
									<ControlLabel>貸出先</ControlLabel>
									<FormControl type="text" placeholder="貸出先" />								</Col>
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
									<FormControl type="text" placeholder="その他"
												 value={this.state.other_notices} />
								</Col>
							</FormGroup>
							
							<FormGroup controlId="publisher_name">
								<col xs={10} sm={10} md={10} lg={10} xl={10}>
									<ControlLabel>局名出版社名</ControlLabel>
									<FormControl type="text" placeholder="局名・出版社名" />
								</col>
							</FormGroup>

							<FormGroup controlId="program_name">
								<Col xs={10}sm={10} md={10} lg={10} xl={10}>
									<ControlLabel>番組名・雑誌名</ControlLabel>
									<FormControl type="text" placeholder="番組名・雑誌名" />
								</Col>
							</FormGroup>

							<FormGroup controlId="release_date">
								<Col xs={10}sm={10}md={10}lg={10}xl={10}>
									<ControlLabel>放送日・発売日</ControlLabel>
									<FormControl type="text" placeholder="放送日・発売日" />
								</Col>
							</FormGroup>

							<FormGroup cotrolId="is_credit">
								<Col xs={10}sm={10}md={10}lg={10}xl={10}>
									<ControlLabel>クレジット</ControlLabel>
									<Radio id="creditUse" name="creditU" >有</Radio>
									<Radio id="creditUnused" name="creditU" >無</Radio>
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
									<FormControl type="text" placeholder="一部返却日" />
								</Col>
							</FormGroup>

							<FormGroup controlId="return_date_final">
								<Col xs={10}sm={10} md={10} lg={10} xl={10}>
									<ControlLabel>最終返却日</ControlLabel>
									<FormControl type="text" placeholder="最終返却日" />								</Col>
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
								{this.state.rows.map(row => this.HobbyForm(row))}
      						</table>

							<FormGroup>
								<Button className="btn btn-default" onClick={() => this.addRow() }>
									<Glyphicon glyph="plus" />
								</Button>
							</FormGroup>

							<FormGroup cotrolId="credit_paid">
								<Col xs={10}sm={10}md={10}lg={10}xl={10}>
									<ControlLabel>クレジット</ControlLabel>
									<Radio name="creditP" id="creditPaid">済</Radio>
									<Radio name="creditP" id="creditUnpaid">未</Radio>
								</Col>
							</FormGroup>

							<FormGroup controlId="return_completion">
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
