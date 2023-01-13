import './index.css'

import placeholder from 'virtual:image/placeholder/text/import'
import svg from 'virtual:image/placeholder/text/svg+xml.svg'

const img = new Image()
img.src = placeholder

const imgSvg = new Image()
imgSvg.src = svg

document.body.appendChild(img)
document.body.appendChild(imgSvg)

const img1 = new Image()
img1.src = '/image/placeholder'

const img2 = new Image()
img2.src = '/image/placeholder/text/ssss2'

document.body.appendChild(img1)
document.body.appendChild(img2)

// no match
const img3 = new Image()
img2.src = '/image/placeholder/bg/ggg'
document.body.appendChild(img3)
