import { drag } from "../drag.js"
import { html, render, sig, mem, mounted } from "../solid_monke/solid_monke.js"

let italic = sig(300)
let fontSize = sig(16)
let letter_spacing = sig(0)
let line_height = sig(1.)


let slider = (value, setter, min, max) => {
	let step = (max - min) / 100
	return html`
		input [type=range min=${min} max=${max} step=${step} 
			oninput=${(e) => setter(e.target.value)} ]
	`
}



// make a draggable div, that has controls
let page = () => {
	let main_css = mem(() => `
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: ${fontSize()}px;
		letter-spacing: ${letter_spacing()}px;
		line-height: ${line_height()}em;
`)
	let font_slider = () => slider(fontSize, fontSize.set, 10, 200)
	let letter_spacing_slider = () => slider(letter_spacing, letter_spacing.set, -100, 100)
	let line_height_slider = () => slider(line_height, line_height.set, -3, 10)

	let show = sig(true)

	return html`
		div [id=editor ]
			button.close [onclick=${() => show.set(!show())}] -- ${mem(() => show() ? "Hide" : "Show")} Editor
			
			when ${show}
			then ${() => html`
				.optor 
					span -- Font Size: ${fontSize} px
					span -- ${font_slider}
				.optor
					span -- Letter Spacing: ${letter_spacing} px 
					span -- ${letter_spacing_slider}
				.optor
					span -- Line Height: ${line_height} em
					span -- ${line_height_slider}
			`}
		div[style=${main_css}]
				div [contenteditable=true style=width:85%;height:85%;margin-top:10%;] -- Basic text type in some more text. This works, just needs to be better designed that's all. Like the user interface could be a little more intuitive but will work on that for the final submission.		`
}


render(page, document.body)
