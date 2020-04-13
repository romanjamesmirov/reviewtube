import React, { Component, Fragment } from 'react'
import '../static/styles/BlankSlate.css'

export default class BlankSlate extends Component {
	constructor(props) {
		super(props)
		this.state = {
			reviews: [], // all your posts, pulled from localStorage
			reviewsWerePulled: false,
			menuOpen: true,
			indexOfDisplayedReview: -1, // blank slate = -1, created review > -1
			hasBeenCreated: true, // don't recreate reviews or save blank slates
			videoLink: '',
			comments: [''],
			timestamps: ['']
		}
		this.createLS = this.createLS.bind(this)
		this.updateLS = this.updateLS.bind(this)
		this.onInputChange = this.onInputChange.bind(this)
		this.onAddClick = this.onAddClick.bind(this)
		this.onMenuClick = this.onMenuClick.bind(this)
		this.onReviewItemClick = this.onReviewItemClick.bind(this)
	}

	componentDidMount() {
		this.setState({ reviews: this.pullReviews(), reviewsWerePulled: true })
	}

	componentDidUpdate() { // if review is not blank and it hasn't been created, create it; otherwise, update it (the currently displayed one in state.reviews)
		if (!this.state.reviewsWerePulled) return
		const { hasBeenCreated, videoLink, timestamps, comments } = this.state
		const shouldCallCreate = !hasBeenCreated && videoLink !== '' && comments[0] !== ''
		if (shouldCallCreate) this.createLS({ videoLink, timestamps, comments })
	}

	pullReviews() { // the R in CRUD; set state.reviews to localStorage.reviews; we only need to execute this initially
		let reviews = localStorage.getItem('reviews')
		reviews = JSON.parse(reviews)
		if (reviews === null) localStorage.setItem('reviews', JSON.stringify([]))
		return reviews === null ? [] : reviews
	}

	createLS(review) { // the C; pop newly-created review onto state.reviews and localStorage.reviews; execute when blank slate isn't blank anymore
		if (this.state.hasBeenCreated) return
		let { reviews } = this.state
		reviews = [...reviews, review]
		this.setState({ reviews, hasBeenCreated: true })
		localStorage.setItem('reviews', JSON.stringify(reviews))
	}

	updateLS() { // the U; set localStorage.reviews to state.reviews; execute when updating an already-created review (one of the state.reviews elements)
		let { indexOfDisplayedReview } = this.state
		if (indexOfDisplayedReview === -1) return 
		let { reviews, videoLink, timestamps, comments } = this.state
		reviews = [...reviews]
		timestamps = [...timestamps]
		comments = [...comments]
		reviews[indexOfDisplayedReview] = { videoLink, timestamps, comments }
		localStorage.setItem('reviews', JSON.stringify(reviews))
		this.setState({ reviews })
	}

	onInputChange({ target }) {
		if (target.classList.contains('Video-link')) this.setState({ videoLink: target.value }, this.updateLS)
		else {
			const property = target.classList.contains('Timestamp') ? 'timestamps' : 'comments'
			const index = parseInt(target.getAttribute('data-index'))
			const newValue = [...this.state[property]]
			newValue[index] = target.value
			this.setState({ [property]: newValue }, this.updateLS)
		}
	}

	onAddClick() {
		const timestamps = [...this.state.timestamps, '']
		const comments = [...this.state.comments, '']
		this.setState({ timestamps, comments })
	}

	onMenuClick() { this.setState(state => ({ menuOpen: !state.menuOpen })) }

	onReviewItemClick({ target }, index) {
		const review = this.state.reviews[index]
		const { videoLink, timestamps, comments } = review
		this.setState({ videoLink, timestamps, comments, indexOfDisplayedReview: index, hasBeenCreated: true })
	}

	render() {
		return (
			<Fragment>
				<nav className={this.state.menuOpen ? 'open' : 'closed'}>
					<ul className='Reviews-list'>
						{this.state.reviews.map((review, index) => (
							<li key={index}>
								<button onClick={e => this.onReviewItemClick(e, index)}>
									<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
										<path d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z' /></svg>
									<span>{review.videoLink}</span></button></li>
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