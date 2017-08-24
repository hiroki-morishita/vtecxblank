/* @flow */
import axios from 'axios'
import React from 'react'
import PropTypes from 'prop-types'
import VtecxPagination from './vtecx_pagination'
import ConditionInputForm from './fermata_conditioninput'
import ReactDOM from 'react-dom'
import {
	Table,
	Grid,
	Row,
	Col
} from 'react-bootstrap'
import type {
	InputEvent,
	Props
} from 'demo.types'

type State = {
		   feed: any,
	isCompleted: boolean,
		isError: boolean,
		 errmsg: string,
	isForbidden: boolean,
			url: string
}

export default class ListItems extends React.Component {
	state : State
	maxDisplayRows: number
	activePage: number

	constructor(props:Props) {
		super(props)
		this.maxDisplayRows = 50    // 1ページにおける最大表示件数（例：50件/1ページ）
		this.state = {
				   feed: { entry: [] },
			isCompleted: false,
			    isError: false,
				 errmsg: '',
			isForbidden: false,
				    url: '/d/registration?f&l=' + this.maxDisplayRows
		}
		this.activePage = 1
	}

	static propTypes = {
		hideSidemenu: PropTypes.func,
		history: PropTypes.any
	}
  
	search(condition:string) {
		this.setState({ url: '/d/registration?f&l=' + this.maxDisplayRows + condition })
	}
   
	getFeed(activePage:number) {
		this.activePage = activePage
		axios({
			url: this.state.url + '&n=' + activePage,
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then( (response) => {
			// 「response.data.feed」に１ページ分のデータ(1~50件目)が格納されている
			// activePageが「2」だったら51件目から100件目が格納されている
			this.setState({ feed: response.data.feed })


		}).catch((error) => {
			if (error.response) {
				if (error.response.status === 401) {
					this.setState({ isForbidden: true })
				} else if (error.response.status === 403 ) {
					//alert('実行権限がありません。。ログインからやり直してください。')
					//location.href = 'login.html'
				} else if (error.response.status === 204||error.response.data.feed.title === 'Please make a pagination index in advance.') {
					// pagination indexがまだ作成されていなければ１秒待って再検索
					setTimeout(() => this.getFeed(activePage), 1000)
				} 
			}else {
				this.setState({ isError: true, errmsg: error.message })
			}
		})    
	}

  
	componentDidMount() {
		// 一覧取得
		this.getFeed(1)
	}

	onSelect(e:InputEvent) {
		// 入力画面に遷移
		const id = e.currentTarget.id.match(/^\/registration\/(.+),.*$/)
		this.props.history.push('/itemupdate?' + id[1])
	
	}


	viewentry(idx:number,entry:any,key:string) {
		return(
			<tr id={entry.id} key={key} onClick={(e)=>this.onSelect(e)}>
				
				<td>{entry.bill.date_of_rent}</td>
				<td>{entry.bill.lender}</td>
				<td>{entry.bill.lender_tel}</td>
				
				{entry.bill.publication.type === 'drama_series' &&
						<td>連続ドラマ</td>
				}
				{entry.bill.publication.type ==='drama_short' &&
						<td>単発ドラマ</td>
				}
				{entry.bill.publication.type === 'web' && 
						<td>WEB</td>
				}
				{entry.bill.publication.type === 'variety' &&
						<td>バラエティー</td>
				}
				{entry.bill.publication.type === 'movie' &&
						<td>映画</td>
				}
				{entry.bill.publication.type === 'newsprogram' &&
						<td>情報・報道番組</td>
				}
				{entry.bill.publication.type === 'magazine' &&
						<td>雑誌</td>
				}
				{entry.bill.publication.type === 'cm' &&
						<td>CM</td>
				}
				{entry.bill.publication.type === 'other' &&	
					<td>{entry.bill.publication.other_notices}</td>
				}
				{entry.bill.publication.type === '' &&
						<td></td>
				}

				<td>{entry.bill.publication.publisher_name}</td>
				<td>{entry.bill.publication.program_name}</td>
				<td>{entry.bill.publication.release_date}</td>
				
				{entry.bill.publication.is_credit === 'credit_Use' &&
					<td>有</td>
				}
				{entry.bill.publication.is_credit === 'credit_unUsed' &&
					<td>無</td>
				}
				{entry.bill.publication.is_credit === '' &&
					<td></td>
				}

				<td>{entry.bill.publication.prospective_user}</td>
				<td>{entry.bill.publication.return_date.part}</td>
				<td>{entry.bill.publication.return_date.final}</td>

				{entry.bill.credit_paid === 'credit_Paid' &&
					<td>済</td>
				}
				{entry.bill.credit_paid === 'credit_unPaid' &&
					<td>未</td>
				}
				{entry.bill.credit_paid === '' &&
					<td></td>
				}
				
				<td>{entry.bill.return_completion}</td>
				<td>{entry.bill.notices}</td>
				<td>{entry.bill.responsible_person}</td>		
			</tr>
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
					<Col sm={9} >
						<ConditionInputForm search={(url) => this.search(url)} />
					</Col>  
					<Col sm={3} >
					</Col>  
				</Row>  
				<Row>
					<Col sm={12} >
						<VtecxPagination
							url={this.state.url}
							onChange={(activePage)=>this.getFeed(activePage)}
							maxDisplayRows={this.maxDisplayRows}
							maxButtons={4}
						/>
						<Table striped bordered condensed hover className="table" >
							<thead>
								<tr>
									<th>お貸出日</th>
									<th>貸出先</th>
									<th>連絡先</th>
									<th>媒体</th>
									<th>局名・出版社名</th>
									<th>番組名・雑誌名</th>
									<th>放送日・発売日</th>
									<th>クレジット払</th>
									<th>着用・使用予定者</th>
									
									<th>一部返却日</th>
									<th>最終返却日</th>
									<th>クレジット済</th>
									<th>返却完了日</th>
									<th>特記事項</th>
									<th>担当者</th>
								</tr>
							</thead>
							<tbody>
								{this.state.feed&&this.state.feed.entry.map((entry, idx) => 
          	     					 entry.bill &&
										this.viewentry(((this.activePage-1)*this.maxDisplayRows)+idx + 1,entry,idx)
								)
								}
								{ this.state.isForbidden &&
									<div className="alert alert-danger">
										
									</div>
								}

								{ this.state.isError &&
									<div>
										<td className="alert alert-danger">通信エラー</td>
										<td>{this.state.errmsg}</td>
									</div>
								}

							</tbody>
						</Table>
					</Col>  
					<Col sm={3} >
					</Col>  
				</Row>  
		 </Grid>
		)
	}
}
ReactDOM.render(<ListItems />, document.getElementById('container'))

