import React, { Component } from 'react'
import { Editor, EditorState, RichUtils, convertToRaw } from 'draft-js'
import 'draft-js/dist/Draft.css'
import '../static/styles/BlankSlate.css'

export default class BlankSlate extends Component {
	constructor(props) {
		super(props)
		this.state = {
			editorState: EditorState.createEmpty(),
			menuOpen: false
		}
		this.onChange = editorState => this.setState({ editorState })
		this.handleKeyCommand = this.handleKeyCommand.bind(this)
		this.handleSave = this.handleSave.bind(this)
		this.handleMenuClick = this.handleMenuClick.bind(this)
	}

	handleKeyCommand(command, editorState) {
		const newState = RichUtils.handleKeyCommand(editorState, command)
		if (newState) {
			this.onChange(newState)
			return 'handled'
		}
		return 'not-handled'
	}

	handleSave() {
		const contentState = this.state.editorState.getCurrentContent()
		const rawJS = convertToRaw(contentState)
		console.log(rawJS)
	}

	handleMenuClick() {
		this.setState(state => ({ menuOpen: !state.menuOpen }))
	}

	render() {
		return (
			<div>
				<p className='Changes-saved'><a href='#'>All changes saved</a></p>

				<div className='Grid-container'>
					<input type='url'
						className='Video-link '
						placeholder='Video link' />

					<div className='Timestamp-container'>
						<input type='text'
							className='Timestamp'
							placeholder='Time' /></div>

					<div className='Editor-container'>
						<Editor placeholder='Comment'
							editorState={this.state.editorState}
							handleKeyCommand={this.handleKeyCommand}
							onChange={this.onChange} /></div>
				</div>

				<button className='Continue-btn'>
					<svg xmlns='http://www.w3.org/2000/svg' viewBox='2 2 20 20'>
						<path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z' />
					</svg></button>

				<button className='Menu-btn' onClick={this.handleMenuClick}>
					<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
						<path d='M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z' />
					</svg></button>
				
			</div>
		)
	}
}