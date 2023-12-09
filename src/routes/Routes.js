import React, { Component } from "react"
import { Switch, Route } from "react-router-dom"

// pages
import Home from "../pages/Home"
import Error404 from "../pages/Error404"

class Routes extends Component {
	render() {
		return (
			<>
				<Switch>
					<Route exact path="/" component={Home} />
					<Route exact path="*">
						<Error404 />
					</Route>
				</Switch>
			</>
		)
	}
}

export default Routes
