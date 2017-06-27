import '../styles/index.css'
import axios from 'axios'
import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import {
	Form,
	Col,
	FormGroup,
	Button,
	Radio,
	ControlLabel,
	PageHeader,
	Glyphicon,
	FormControl
} from 'react-bootstrap'
 
class Input extends React.Component {
	constructor(props) {
		super(props)
		this.state = { rows:[1],
			isCompleted: false,
			isError: false,
			errmsg:'',
			isForbidden: false }    
		this.handleSubmit = this.handleSubmit.bind(this)
	}
 
	handleSubmit(e){
		e.preventDefault()
		let reqdata = {'feed': {'entry': []}}
		let entry = {}
		entry.userinfo = { id : Number(e.target.id.value),
			                 email : e.target.email.value }
		entry.favorite = { food : e.target.food.value,
			                 music : e.target.music.value }

		entry.hobby = []
		this.state.rows.map(row => 
    	entry.hobby.push({'type': e.target['hobby_type'+row].value,
		                    'name': e.target['hobby_name'+row].value})
		)
		reqdata.feed.entry.push(entry)

		axios.defaults.withCredentials = true // cookies
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
  
	render() {
		return (
			<Form horizontal onSubmit={this.handleSubmit}>
				<PageHeader>貸出伝票</PageHeader>

				<FormGroup controlId="date_of_rent">
					<Col xsOffset={8}
						smOffset={8}
						mdOffset={8}
						lgOffset={8}
						xlOffset={8}
						xs={4}sm={4}md={4}lg={4}xl={4}>
						<ControlLabel>お貸出日</ControlLabel>
						<FormControl type="text" placeholder="お貸出日"/>
					</Col>
				</FormGroup>

				<FormGroup controlId="lender">        
					<Col xs={10}sm={10} md={10} lg={10} xl={10}>
						<ControlLabel>貸出先</ControlLabel>
						<FormControl type="text" placeholder="貸出先" />
					</Col>
				</FormGroup>


				<FormGroup controlId="lender_tel">
					<Col xs={10}sm={10} md={10} lg={10} xl={10}>
						<ControlLabel>連絡先</ControlLabel>
						<FormControl type="text" placeholder="連絡先" />
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
						<FormControl type="text" placeholder="その他" />
					</Col>
				</FormGroup>
        
				<FormGroup controlId="publisher_name">
					<Col xs={10}sm={10} md={10} lg={10} xl={10}>
						<ControlLabel>局名・出版社名</ControlLabel>
						<FormControl type="text" placeholder="局名・出版社名" />
					</Col>
				</FormGroup>

				<FormGroup controlId="program_name">
					<Col xs={10}sm={10} md={10} lg={10} xl={10}>
						<ControlLabel>番組名・雑誌名</ControlLabel>
						<FormControl type="text" placeholder="番組名・雑誌名" />
					</Col>
				</FormGroup>

				<FormGroup controlId="release_name">
					<Col xs={10}sm={10}md={10}lg={10}xl={10}>
						<ControlLabel>放送日・発売日</ControlLabel>
						<FormControl type="text" placeholder="放送日・発売日" />
					</Col>
				</FormGroup>

				<FormGroup cotrolId="credit">
					<Col xs={10}sm={10}md={10}lg={10}xl={10}>
						<ControlLabel>クレジット</ControlLabel>
						<Radio name="credit">有</Radio>
						<Radio name="credit">無</Radio>
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
						<ControlLabel>一部</ControlLabel>
						<FormControl type="text" placeholder="一部返却日" />
					</Col>
				</FormGroup>

				<FormGroup controlId="return_date_final">
					<Col xs={10}sm={10} md={10} lg={10} xl={10}>
						<ControlLabel>最終</ControlLabel>
						<FormControl type="text" placeholder="最終返却日" />
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
					{this.state.rows.map(row => <HobbyForm row={row} key={row.toString()}/>)}
      	</table>

				<FormGroup>
					<Col sm={12}>
						<Button className="btn btn-default" onClick={() => this.addRow() }>
							<Glyphicon glyph="plus" />
						</Button>
					</Col>
				</FormGroup>


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






				<br/>
				{ this.state.isForbidden &&
								<FormGroup>
									<Col sm={12}>
										<div className="alert alert-danger">
											<a href="login.html">ログイン</a>を行ってから実行してください。
										</div>
									</Col>
								</FormGroup>
				}

				{ this.state.isError &&
								<FormGroup>
									<Col sm={12}>
										<div className="alert alert-danger">
              データ登録に失敗しました。<br/>
											{this.state.errmsg}
										</div>
									</Col>
								</FormGroup>
				}

				{ this.state.isCompleted &&
								<FormGroup>
									<Col sm={12}>
										<div>
      				データを登録しました。
										</div>
									</Col>
								</FormGroup>
				}

				<FormGroup>
					<Col smOffset={4} sm={10}>
						<Button type="submit" className="btn btn-primary">
              登録
						</Button>
					</Col>
				</FormGroup>

			</Form>
		)
	}
}

HobbyForm.propTypes = {
	row: PropTypes.number
}

function HobbyForm(props) {
	const hobby_type = 'hobby_type'+props.row
	const hobby_name = 'hobby_name'+props.row
	return(
		<tbody>

			<td>
				<Col sm={12}>              
					<FormGroup controlId={hobby_type}>
						<FormControl type="text" placeholder="ブランド名" />
					</FormGroup>
				</Col>
			</td>

			<td>
				<Col sm={12}>              
					<FormGroup controlId={hobby_name}>
						<FormControl type="text" placeholder="品番" />
					</FormGroup>
				</Col>
			</td>

			<td>
				<Col sm={12}>              
					<FormGroup controlId={hobby_name}>
						<FormControl type="text" placeholder="アイテム名" />
					</FormGroup>
				</Col>
			</td>

			<td>
				<Col sm={12}>              
					<FormGroup controlId={hobby_name}>
						<FormControl type="text" placeholder="着用・使用状況" />
					</FormGroup>
				</Col>
			</td>

			<td>
				<Col sm={12}>              
					<FormGroup controlId={hobby_name}>
						<FormControl type="text" placeholder="返却日" />
					</FormGroup>
				</Col>
			</td>

		</tbody>
	)
}

ReactDOM.render(<Input />, document.getElementById('container'))

