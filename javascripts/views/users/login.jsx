'use strict';

import React, { Component, PropTypes } from 'react';
import Page from 'views/layout/page';
import Auth from 'lib/auth';

export default class ProductSearch extends Component {	

	static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static propTypes = {
    location: PropTypes.object
  };

  state = {
		username: '',
		password: ''
	};

	handleUsernameChange = (e) => {
		this.setState({ username: e.target.value });
	}

	handlePasswordChange = (e) => {
		this.setState({ password: e.target.value });
	}

	handleLogin = (e) => {
		e.preventDefault();

		Auth.login({
			username: this.state.username,
			password: this.state.password
		}).then((response) => {
			if (response.ok) {
				const { location } = this.props

				if (location.state && location.state.nextPathname) {
	        this.context.router.replace(location.state.nextPathname)
	      } else {
	        this.context.router.replace('/')
	      }
	    } else {
	    	alert('error: cannot log in');
				console.error(response);
	    }
		});
	}

	render() {
		return (
			<Page
				breadcrumbs={ 'Home / Login' }
				title='Login'
			>
				<div className="well no-padding col-md-6">
					<form className="smart-form client-form">
						<header>
							Sign In
						</header>
						<fieldset>
							<section>
								<label className="label">Username</label>
								<label className="input"> <i className="icon-append fa fa-user" />
									<input type="email" value={ this.state.username } onChange={ this.handleUsernameChange } />
									<b className="tooltip tooltip-top-right"><i className="fa fa-user txt-color-teal" /> Please enter username</b></label>
							</section>
							<section>
								<label className="label">Password</label>
								<label className="input"> <i className="icon-append fa fa-lock" />
									<input type="password" value={ this.state.password } onChange={ this.handlePasswordChange }/>
									<b className="tooltip tooltip-top-right"><i className="fa fa-lock txt-color-teal" /> Enter your password</b> </label>
							</section>
						</fieldset>
						<footer>
							<button type="submit" className="btn btn-primary" onClick={ this.handleLogin }>
								Sign in
							</button>
						</footer>
					</form>
				</div>
			</Page>
		)
	}
}
