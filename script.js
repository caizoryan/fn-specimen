import { sig, render, html } from "./solid_monke/solid_monke.js";


let images = [
	"./images/img_1.jpg",
	"./images/img_2.jpg",
	"./images/img_3.jpg",
	"./images/img_4.jpg",
	"./images/img_5.jpg",
	"./images/img_6.jpg",
	"./images/img_7.jpg",
	"./images/img_8.jpg",
	"./images/img_9.jpg",
	"./images/img_10.jpg",
	"./images/img_11.jpg",
	"./images/img_12.jpg",
	"./images/img_13.jpg",
	"./images/img_14.jpg",
	"./images/img_15.jpg",
	"./images/img_16.jpg",
	"./images/img_17.jpg",
	"./images/img_18.jpg",
	"./images/img_19.jpg",
	"./images/img_20.jpg",
	"./images/img_21.jpg",
	"./images/img_22.jpg",
	"./images/img_23.jpg",
	"./images/img_24.jpg",

]


let image_scroll = () => {
	let image = sig(images[0])

	setInterval(() => {
		fade(document.querySelector("img.top"))
		image.set(images[Math.floor(Math.random() * images.length)])
		console.log(image())
	}, 3000)


	return html`
	.image-scroll
		img.top [src=${image}]
	.nav
		div [style=margin-bottom:20px]
			a [href=./modulator/index.html]
				span -- Visit Typeface Modulator

		div
			a [href=./type-tester/index.html]
				span -- (WIP) Visit Typeface Tester
`
}

let fade = (element) => {
	element.style.transition = "none"
	element.style.opacity = 0
	element.style.transition = "opacity 1s"
	setTimeout(() => { element.style.opacity = 1 }, 10)
}

render(image_scroll, document.body)

