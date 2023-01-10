import './index.css'

import placeholder from 'virtual:image/placeholder/text/import'

const img = new Image()
img.src = placeholder

document.body.appendChild(img)

const img1 = new Image()
img1.src = '/image/placeholder'

const img2 = new Image()
img2.src = '/image/placeholder/text/ssss2'

document.body.appendChild(img1)
document.body.appendChild(img2)
