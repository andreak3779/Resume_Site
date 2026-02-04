document.addEventListener('DOMContentLoaded', () => {
	const skip = document.querySelector('.skip-link');
	if (skip) {
		skip.addEventListener('click', () => {
			const main = document.getElementById('main');
			if (main) {
				main.setAttribute('tabindex', '-1');
				main.focus();
			}
		});
	}

	const downloadBtn = document.getElementById('downloadPdf');
	if (downloadBtn && window.html2pdf) {
		downloadBtn.addEventListener('click', () => {
			const element = document.getElementById('main');
			if (!element) return;
			const opt = {
				margin:       0.4,
				filename:     'Andrea_Kaplen_Resume.pdf',
				image:        { type: 'jpeg', quality: 0.98 },
				html2canvas:  { scale: 2 },
				jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
			};
			html2pdf().set(opt).from(element).save();
		});
	}
});
