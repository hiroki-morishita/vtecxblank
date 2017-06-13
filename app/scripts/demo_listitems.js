import '../styles/index.css'
import axios from 'axios'
import React from 'react'
import ReactDOM from 'react-dom'
import VtecxPagination from './vtecx_pagination'
import ConditionInputForm from './demo_condition_input'
import {
  Table
} from 'react-bootstrap'
 
class ListItems extends React.Component {
	constructor(props) {
		super(props)
		this.state = {feed:{entry:[]},isCompleted: false,isError: false,errmsg:'',isForbidden: false}
		this.maxDisplayRows = 50    // 1ページにおける最大表示件数（例：50件/1ページ）
		this.url = '/d/registration'
		this.activePage = 1
		this.condition = ''
	}

	search(condition) {
		this.condition = condition
		console.log('url='+this.condition)
		this.getFeed(1)
	}
   
	getFeed(activePage) {
		this.activePage = activePage
		axios({
			url: this.url + '?f&l='+ this.maxDisplayRows + '&n=' + activePage + this.condition,
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		}).then( (response) => {
      // 「response.data.feed」に１ページ分のデータ(1~50件目)が格納されている
      // activePageが「2」だったら51件目から100件目が格納されている
			this.setState({ feed: response.data.feed })
			console.log('feed='+JSON.stringify(this.state.feed))
		}).catch((error) => {
			if (error.response) {
				if (error.response.status === 401) {
					this.setState({ isForbidden: true })
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

	viewentry(idx,entry,key) {
		return(
            <tr key={key}>
              <td>{idx}</td>
              <td>{entry.userinfo.id}</td>
              <td>{entry.userinfo.email}</td>
              <td>{entry.favorite.food}</td>
              <td>{entry.favorite.music}</td>
            </tr>
		)
	}

	render() {
		return (
		<div>
    <ConditionInputForm search={(url)=>this.search(url)} />
    <hr/>
        <VtecxPagination
          url={this.url}
          onChange={(activePage)=>this.getFeed(activePage)}
          maxDisplayRows={this.maxDisplayRows}
          maxButtons={4}
        />
    <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>No</th>
            <th>id</th>
            <th>email</th>
            <th>好きな食べ物</th>
            <th>好きな音楽</th>
          </tr>
        </thead>
        <tbody>
          {this.state.feed.entry.map((entry, idx) => 
          	entry.userinfo && entry.favorite && 
              this.viewentry(((this.activePage-1)*this.maxDisplayRows)+idx + 1,entry,idx)
            )
          }
          { this.state.isForbidden &&
              <div className="alert alert-danger">
                <a href="login.html">ログイン</a>を行ってから実行してください。
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
		 </div>
		)
	}
}

ReactDOM.render(<ListItems />, document.getElementById('container'))

