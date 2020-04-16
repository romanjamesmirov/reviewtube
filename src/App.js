import React, { Component, Fragment } from 'react'
import cloneDeep from 'lodash/cloneDeep'
import './static/styles/App.css'

const blankSlate = { videoLink: '', timestamps: [''], comments: [''] }

export default class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			reviews: [cloneDeep(blankSlate)], // all your posts, pulled from localStorage
			current: 0, // current displayed review in reviews array (-1 = blank slate)
			menuOpen: true
		}
		this.onInputChange = this.onInputChange.bind(this)
		this.onAddClick = this.onAddClick.bind(this)
		this.onMenuClick = this.onMenuClick.bind(this)
		this.onReviewItemClick = this.onReviewItemClick.bind(this)
		this.onTrashClick = this.onTrashClick.bind(this)
	}

	// when the page loads, we read once...
	componentDidMount() { this.setState({ reviews: this.pullReviews() }) }

	onInputChange({ target }) { // ...then, we write to the (local) database after every change to the client-side model.
		let reviews = cloneDeep(this.state.reviews)
		let { current } = this.state
		if (target.getAttribute('data-key') === 'videoLink')
		{ reviews[current].videoLink = target.value }
		else {
			const key = target.getAttribute('data-key')
			const keyIndex = parseInt(target.getAttribute('data-index'))
			reviews[current][key][keyIndex] = target.value
		}
		// so we've updated the displayed review; now we need to handle cases.
		// case one: this is a blank slate and it's no longer blank
		const notBlank = reviews[current].videoLink !== ''
			&& reviews[current].comments[0] !== ''
		if (current === 0 && notBlank) {
			reviews.push(reviews[0])
			reviews[0] = cloneDeep(blankSlate)
			current = reviews.length - 1
		}
		// if it's not, don't create a new review and just proceed with updating
		this.setState({ reviews, current })
		localStorage.setItem('reviews', JSON.stringify(reviews))
	}

	pullReviews() {
		const reviews = localStorage.getItem('reviews') 
		if (reviews === null) {
			const noReviews = [cloneDeep(blankSlate)]
			localStorage.setItem('reviews', JSON.stringify(noReviews))
			return noReviews
		} else return JSON.parse(reviews)
	}

	onAddClick() {
		let reviews = cloneDeep(this.state.reviews)
		const { current } = this.state
		reviews[current].timestamps.push('')
		reviews[current].comments.push('')
		this.setState({ reviews })
	}

	onMenuClick() { this.setState(state => ({ menuOpen: !state.menuOpen })) }

	onReviewItemClick(index) { this.setState({ current: parseInt(index) }) }

	onTrashClick(e, index) {
		e.stopPropagation()
		let reviews = cloneDeep(this.state.reviews)
		reviews.splice(index, 1)
		if (reviews[index] !== undefined) this.setState({ reviews })
		else if (reviews[index - 1] !== undefined)
		{ this.setState({ reviews, current: index - 1 }) }
		else this.setState({ reviews, current: 0 })
		localStorage.setItem('reviews', JSON.stringify(reviews))
	}

	render() {
		let { reviews, current, menuOpen } = this.state
		return (
			<Fragment>
				<ul className={`Nav ${menuOpen ? 'open' : 'closed'}`}>
					{reviews.map((review, index) => (
						<li key={index} className={index === 0 ? 'New-review' : undefined}>
							<button onClick={e => this.onReviewItemClick(index)}
								className={current === index ? 'Displayed' : undefined}>
								{reviewItemClickable(review, index, this.onTrashClick)}</button>
						</li>))}
				</ul>

				<main>
					<div className='Grid-container'>
						<input type='url' className='Video-link' placeholder='Video link'
							value={reviews[current].videoLink} onChange={this.onInputChange}
							data-key='videoLink' />

						{reviews[current].comments.map((comment, index) => (
							commentBlock(reviews, current, comment, index, this.onInputChange)
						))}
					</div>

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

function commentBlock(reviews, current, comment, index, onInputChange) {
	return (
		<Fragment key={index}>
			<div className='Timestamp-container'>
				<input type='text' className='Timestamp' placeholder='Time'
					value={reviews[current].timestamps[index]}
					onChange={onInputChange}
					data-index={index} data-key='timestamps' /></div>

			<textarea className='Comment' placeholder='Comment'
				value={comment} onChange={onInputChange}
				rows='1' data-index={index} data-key='comments' /></Fragment>
	)
}

function reviewItemClickable(review, index, onTrashClick) {
	let reviewItemContent = index === 0 ? 'New Review'
		: <Fragment>
			{trashButton(index, onTrashClick)}
			<span>{review.videoLink}</span>
		</Fragment>
	return reviewItemContent
}

function trashButton(index, onTrashClick) {
	return (
		<button onClick={e => onTrashClick(e, index)} className='Trash'>
			<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
				<path d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z' /></svg>
		</button>
	)
}