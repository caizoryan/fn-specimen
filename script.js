import { drag } from "./drag.js"
import { html, render, sig, mem, mounted } from "./solid_monke/solid_monke.js"

let italic = sig(300)
let fontSize = sig(259)
let text = sig("interaction")
let mouse_x = sig(0)
let mouse_y = sig(0)
let time = sig(0)
let increment = sig(.03)
let operation = sig("add")

setInterval(() => {
	let new_time = time() + increment()
	console.log(time())
	console.log(increment())
	console.log(new_time)
	time.set(new_time)
}, 10)


document.addEventListener("mousemove", (e) => {
	mouse_x.set(e.clientX)
	mouse_y.set(e.clientY)

	italic.set(300 - ((mouse_y() / window.innerHeight) * 600))
})

let t_y = sig(.25)
let t_x = sig(0)

let r_z = sig(.125)
let r_x = sig(0)

let opacity_offset = sig(0.3)
let blur_offset = sig(0.2)
let border_radius = sig(100)
let border = sig(1)
let letter_spacing = sig(0)


let current_css = (noise) => {
	if ("function" == typeof noise) { noise = noise() }
	return `font-size: ${fontSize()}px; font-variation-settings: "wght" 300, "ital" ${noise};
	transform:  translateY(${noise / 4}px);
	transform: 
		rotateZ(${(noise) * r_z()}deg) 
		rotateX(${(noise) * r_x()}deg)
		translateY(${noise * t_y()}px)
		translateX(${noise * t_x()}px);


	border: ${border()}px dotted rgba(255,255,255,.4);

	filter: blur(${(Math.abs(noise) / 300 * blur_offset())}px);

	opacity: ${(Math.abs(noise) / 300) + opacity_offset()};
	margin: ${letter_spacing()}px;

	border-radius: ${border_radius()}px;
	`
}


let letter = (letter, index) => {
	if ("function" == typeof index) { index = (index() + 1) }
	else { index = (index + 1) }

	let noise = sig(index)
	let css = mem(() => current_css(noise))
	let multiply = (a, b) => a * b
	let add = (a, b) => a + b
	let divide = (a, b) => a / b

	setInterval(() => {
		let operation_fn =
			operation() == "add" ? add :
				operation() == "multiply" ? multiply :
					divide
		let value = operation_fn(time(), index / 8)
		noise.set(Math.sin(value) * 300)
	}, 10)

	return html`div[style = ${css}] -- ${letter} `
}

let slider = (value, setter, min, max) => {
	let step = (max - min) / 100
	return html`
		input [type=range min=${min} max=${max} step=${step} 
			oninput=${(e) => setter(e.target.value)} ]
	`
}

let set_all_zero = () => {
	t_y.set(0)
	t_x.set(0)
	r_z.set(0)
	r_x.set(0)
	increment.set(0)


}

let text_box = (value, setter) => {
	return html`
		input [oninput=${(e) => setter(e.target.value)}]
	`
}

// make a draggable div, that has controls
let page = () => {
	let letters = mem(() => text().split(""))
	let main_css = `
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
`
	let font_slider = () => slider(fontSize, fontSize.set, 10, 500)
	let speed_slider = () => slider(increment, (val) => increment.set(parseFloat(val)), .01, 1)
	let x_slider = () => slider(t_x, t_x.set, -2, 2)
	let y_slider = () => slider(t_y, t_y.set, -2, 2)
	let r_z_slider = () => slider(r_z, r_z.set, -1, 1)
	let r_x_slider = () => slider(r_x, r_x.set, -1, 1)
	let opacity_slider = () => slider(opacity_offset, (val) => opacity_offset.set(parseFloat(val)), -1, 1)
	let blur_slider = () => slider(blur_offset, (val) => blur_offset.set(parseFloat(val)), -1, 10)
	let letter_spacing_slider = () => slider(letter_spacing, letter_spacing.set, -100, 100)
	let border_radius_slider = () => slider(border_radius, border_radius.set, -1, 100)
	let border_slider = () => slider(border, border.set, -1, 10)

	return html`
		div [id=editor]
			button [onclick=${set_all_zero}] -- Stagnate
			.title -- Word(s): 
			div -- ${() => text_box(text, text.set)}

			.title -- Speed (${increment})
			.slider -- ${speed_slider}

			.title -- Font Size (${fontSize})
			.slider -- ${font_slider}

			.title -- x_offset (${t_x})
			.slider -- ${x_slider}

			.title -- y_offset (${t_y})
			.slider -- ${y_slider}

			.title -- rotation_z (${r_z})
			.slider -- ${r_z_slider}

			.title -- rotation_x (${r_x})
			.slider -- ${r_x_slider}

			.title -- opacity_offset (${opacity_offset})
			.slider -- ${opacity_slider}

			.title -- blur_offset (${blur_offset})
			.slider -- ${blur_slider}

			.title -- Letter Spacing (${letter_spacing})
			.slider -- ${letter_spacing_slider}

			.title -- Border Radius (${border_radius})
			.slider -- ${border_radius_slider}

			.title -- Border (${border})
			.slider -- ${border_slider}

			span.title -- Operation: 

			select [onchange=${(e) => operation.set(e.target.value)}]
				option[value=add] -- Add
				option[value=multiply] -- Multiply
				option[value=divide] -- Divide
			


		div[style=${main_css}]
			div[style=display:flex;]
				each of ${letters} as ${letter}
		`
}


render(page, document.body)
