import React, { Component, Fragment } from 'react'
import 'draft-js/dist/Draft.css'
import '../static/styles/BlankSlate.css'

export default class BlankSlate extends Component {
	constructor(props) {
		super(props)
		this.state = {
			menuOpen: false,
			videoLink: '',
			comments: [''],
			timestamps: ['']
		}
		this.onInputChange = this.onInputChange.bind(this)
		this.onAddClick = this.onAddClick.bind(this)
		this.onMenuClick = this.onMenuClick.bind(this)
	}
	
	onInputChange({ target }) {
		if (target.classList.contains('Video-link')) this.setState({ videoLink: target.value })
		else {
			const property = target.classList.contains('Timestamp') ? 'timestamps' : 'comments'
			const index = parseInt(target.getAttribute('data-index'))
			let newValue = [...this.state[property]]
			newValue[index] = target.value
			this.setState({ [property]: newValue })
		}
	}

	onAddClick() {
		this.setState(state => ({ comments: [...state.comments, ''], timestamps: [...state.timestamps, ''] }))
	}

	onMenuClick() {
		this.setState(state => ({ menuOpen: !state.menuOpen }))
	}

	render() {
		return (
			<Fragment>
				<nav className={this.state.menuOpen ? 'open' : 'closed'}>
					<ul className='Reviews-list'>
						{/* tabIndex just for demo purposes */}
						{[1,1,1,1,1,1].map((el, index) => (
							<li key={index} tabIndex='0'>
								<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
									<path d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z' /></svg>
								<span>Lorem ipsum dolor sit amet.</span></li>
						))}
					</ul>
				</nav>

				<main>
					<p className='Changes-saved'><a href='#'>All changes saved</a></p>

					<div className='Grid-container'>
						<input type='url' className='Video-link'
							value={this.state.videoLink} onChange={this.onInputChange}
							placeholder='Video link' />

						{this.state.comments.map((comment, index) => (
							<Fragment key={index}>
								<div className='Timestamp-container'>
									<input type='text' className='Timestamp'
										placeholder='Time'
										value={this.state.timestamps[index]}
										onChange={this.onInputChange}
										data-index={index} /></div>

								<textarea className='Comment' placeholder='Comment'
									value={comment}
									onChange={this.onInputChange}
									rows='1'
									data-index={index} /></Fragment>
						))}</div>

					<button className='Add-btn' onClick={this.onAddClick}>
						<svg xmlns='http://www.w3.org/2000/svg' viewBox='2 2 20 20'>
							<path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z' /></svg></button>

					<button className='Menu-btn' onClick={this.onMenuClick}>
						<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
							<path d='M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z' />
						</svg></button>

				</main>
			</Fragment>
		)
	}
}