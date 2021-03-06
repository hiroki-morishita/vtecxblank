/* @flow */
import '../styles/index.css'
import axios from 'axios'
import jsSHA from 'jssha'
import React from 'react'
import ReactDOM from 'react-dom'
import ReCAPTCHA from 'react-google-recaptcha'
import {
	Form,
	Col,
	FormGroup,
	Button,
	HelpBlock,
	FormControl
} from 'react-bootstrap'

type InputEvent = {
		target: any,
	preventDefault: Function  
} 
 
class Registration extends React.Component {
	constructor() {
		super()
		this.state = { isError : false, isAlreadyRegistered: false, isIllegalPassword: false, captchaValue:'' }    
	}

	capchaOnChange(value:string) {
		this.setState({captchaValue: value})
	}
   
	//ハッシュ化したパスワードを取得する
	getHashPass(password:string){
		var shaObj = new jsSHA('SHA-256', 'TEXT')
		shaObj.update(password)
		return shaObj.getHash('B64')
	}

	handleSubmit(e:InputEvent){
		e.preventDefault()
		const password = e.target.password.value
		//パスワードのバリデーションチェックを行う
		if (!password.match('^(?=.*?[0-9])(?=.*?[a-zA-Z])(?=.*?[!-/@_])[A-Za-z!-9@_]{8,}$')) {
			this.setState({isIllegalPassword: true})

		}else {

			const reqData = {'feed': {'entry':[{'contributor': [{'uri': 'urn:vte.cx:auth:'+ e.target.account.value +','+ this.getHashPass(password) +''}]}]}}
  			const captchaOpt = '&g-recaptcha-response=' + this.state.captchaValue

			axios({
				url: '/d/?_adduser' + captchaOpt,
				method: 'post',
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				},
				data : reqData

			}).then( () => {
				this.setState({isCompleted: true})
			}).catch((error) => {
				if (error.response) {
					if (error.response.data.feed.title.indexOf('User is already registered') !== -1) {
						this.setState({isAlreadyRegistered: true})
					}else {
						this.setState({isError: true})
					}
				} else {
					this.setState({isError: true})
				}
			})

		}
	} 
  
	render() {
		return (
			<div>
				{this.state.isCompleted ? (
					<Form>
						<h2>仮登録が完了しました</h2>
						<hr />
						<FormGroup>
							<Col sm={12}>
								<div className="caution">
                    入力したメールアドレスに本登録用のメールを送信しました。<br />
                    メールのリンクをクリックし、本登録を完了してください。
								</div>
							</Col>
						</FormGroup>
					</Form>          
				) : (
					<Form horizontal onSubmit={(e)=>this.handleSubmit(e)}>
						<h2>新規登録</h2>
						<hr />
						<FormGroup controlId="account">
							<Col sm={12}>
								<FormControl type="email" placeholder="アカウント(メールアドレス)" />
							</Col>
						</FormGroup>

						<FormGroup controlId="password">
							<Col sm={12}>
								<FormControl type="password" placeholder="パスワード" />
								<HelpBlock>（8文字以上、かつ数字・英字・記号を最低1文字含む）</HelpBlock>
							</Col>
						</FormGroup>

						<FormGroup>
							<Col sm={12}>
								<div className="caution">
									<a href="user_terms.html">利用規約</a>に同意のうえ、「利用規約に同意して新規登録」ボタンを押してください。
								</div>
							</Col>
						</FormGroup>
    
						<FormGroup>
							<Col sm={12}>
								<ReCAPTCHA
									sitekey="6LfBHw4TAAAAAMEuU6A9BilyPTM8cadWST45cV19"
									onChange={(value)=>this.capchaOnChange(value)}
								/>
							</Col>
						</FormGroup>

						<FormGroup>
							<Col smOffset={2} sm={12}>
								<Button type="submit" className="btn btn-primary">
                  利用規約に同意して新規登録
								</Button>
							</Col>
						</FormGroup>

						{ this.state.isIllegalPassword &&
												<FormGroup>
													<Col sm={12}>
														<div className="alert alert-danger">
                  パスワードは8文字以上、かつ数字・英字・記号を最低1文字含む必要があります。
														</div>
													</Col>
												</FormGroup>
						}

						{ this.state.isAlreadyRegistered &&
												<FormGroup>
													<Col sm={12}>
														<div className="alert alert-danger">
                  そのアカウントは既に登録済みです。
														</div>
													</Col>
												</FormGroup>
						}

						{ this.state.isError &&
												<FormGroup>
													<Col sm={12}>
														<div className="alert alert-danger">
                  新規登録に失敗しました。アカウントまたはパスワードが使用できない可能性があります。
														</div>
													</Col>
												</FormGroup>
						}
					</Form>            
				)}
			</div>      
		)
	}
}

ReactDOM.render(<Registration />, document.getElementById('registration_form'))