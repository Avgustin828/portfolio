
document.querySelectorAll('.nav-links a').forEach(link => {
	link.addEventListener('mouseover', () => {
		link.style.transform = 'scale(1.1)'
		link.style.transition = 'transform 0.3s'
	})

	link.addEventListener('mouseout', () => {
		link.style.transform = 'scale(1)'
	})
})
