import axios from 'axios'
import React from 'react'
import PropTypes from 'prop-types'
import {
	Grid,
	Row,
	Col,
	Pagination
} from 'react-bootstrap'
 
export default class VtecxPagination extends React.Component {
	constructor(props) {
		super(props)
		this.state = { activePage : 1 , items : 0  }
		this.handleSelect = this.handleSelect.bind(this)
		this.pageIndex = 0         // ページネーションを貼る最大index
		this.resultcount = 0	   // 検索結果件数
	}
 
	static propTypes = {
		url: PropTypes.string,
		onChange: PropTypes.func,
		maxDisplayRows: PropTypes.number,    // 1ページにおける最大表示件数（例：50件/1ページ）
		maxButtons : PropTypes.number     	 // pageIndexにおける最大表示件数-1
	}

/****
 * ページネーションのIndex設定処理
 * @url ページネーションを設定するURL
 * @page 取得したいページ
 *****/
	buildIndex(url,activePage) {

      // ページング取得に必要な設定を行う
		let param
		let pageIndex = activePage + this.props.maxButtons > this.pageIndex ? activePage + this.props.maxButtons : this.pageIndex
		if (pageIndex > this.pageIndex) {
			if (this.pageIndex > 1) {
				param = this.pageIndex + ',' + pageIndex
			} else {
				param = pageIndex
			}

		    // サーバにページネーションIndex作成リクエストを送信
			axios({
				url: url + '?f&l=' + this.props.maxDisplayRows + '&_pagination=' + param,
				method: 'get',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			}).then(() => {
				this.pageIndex = pageIndex
			}).catch(() => {
				this.pageIndex = pageIndex
			})
        
		} 
	}

	 handleSelect(eventKey) {		 
		this.buildIndex(this.props.url, eventKey)
		this.setState({
			activePage: eventKey
		})
		this.props.onChange(eventKey)	// 最検索
		console.log('activePage='+eventKey) 
	}

	componentDidMount() {
	    // pageIndex作成処理呼び出し
		this.buildIndex(this.props.url, 1)

		// 件数取得
		axios({
			url: this.props.url + '?f&l=' + this.props.maxDisplayRows + '&c',
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then((response) => {
			this.resultcount = Number(response.data.feed.title)
			const items =  Math.ceil(this.resultcount / this.props.maxDisplayRows)
			this.setState({ items: items })
		}).catch(() => {
			this.setState({ items: 0 })
		})
	}

	render() {
		return (
			  <Grid>
				<Row>
					<Col xs={4} md={4}><p>{(this.state.activePage-1)*this.props.maxDisplayRows}-{(this.state.activePage)*this.props.maxDisplayRows}/{this.resultcount}件</p></Col>
					<Col xs={8} md={8}>
							<Pagination
										prev
										next
										first
										last
										ellipsis
										boundaryLinks
										items={this.state.items}
										maxButtons={this.props.maxButtons}
										activePage={this.state.activePage}
										onSelect={this.handleSelect} />
					</Col>
				</Row>
			  </Grid>
		)
	}
}