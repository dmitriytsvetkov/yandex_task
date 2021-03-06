window.MyForm = {
	validate() {
		const $form = $('#myForm');
		let isValid = false;
		const errorFields = [];

		const fioValidate = () => {
			let fioContent = $form.find('#fio').val();
			fioContent = fioContent.split(' ');
			$("#fio").removeClass("error");
			return (fioContent.length === 3);
		};
		const emailValidate = () => {
			let emailContent = $form.find('#email').val();
			$("#email").removeClass("error");
			return (/\S+@((ya\.ru)|(yandex\.(ru|ua|by|kz|com)))/.test(emailContent));
		};
		const phoneValidate = () => {
			const add = (str) => {
				str = str.split('');
				let sum = 0;
				for (let i = 0; i < str.length; i++) {
					sum += parseInt(str[i],10);
				}
				return sum;
			};
			let phoneContent = $form.find('#phone').val();
			phoneContent = phoneContent.replace(/[^0-9]/g, '');
			phoneContent = add(phoneContent);
			$("#phone").removeClass("error");
			return (phoneContent < 30);
		};
		let fio = fioValidate();
		let email = emailValidate();
		let phone	= phoneValidate();

		if (!fioValidate()) {
			isValid = false;
			$("#fio").addClass("error");
			errorFields.push('fio');
		}
		if (!emailValidate()) {
			isValid = false;
			$("#email").addClass("error");
			errorFields.push('email');
		}
		if (!phoneValidate()) {
			isValid = false;
			$("#phone").addClass("error");
			errorFields.push('phone');
		}
		if (fio && email && phone){
			isValid = true;
			$(document).ready(function() {
				$(':input[type="submit"]').prop('disabled', true);
			});
		}

		return {
			isValid : isValid,
			errorFields : errorFields
		};
	},
	getData() {
		return {
			fio :  $('#fio').val(),
			email :  $('#email').val(),
			phone:  $('#phone').val()
		};
	},
	setData(obj) {
		if (obj.fio) {
			$('#fio').val(obj.fio);
		} else $('#fio').val("");
		if (obj.email) {
			$('#email').val(obj.email);
		} else $('#email').val("");
		if (obj.phone) {
			$('#phone').val(obj.phone);
		} else $('#phone').val("");
	},
	submit() {
		if (!this.validate().isValid) {
			return;
		}
		function setStatus(clazz, text) {
			const $resCont = $("#resultContainer");
			$resCont.addClass(clazz);
			if (text) {
				$resCont.text(text);
			}
		}

		function setSuccess() {
			setStatus('success', 'Success');
		}

		function setError(reason) {
			setStatus('error', reason);
		}

		function setProgress() {
			setStatus('progress')
		}

		const url = 'success.json';
		const data = this.getData();
		const sendAjax = () => {
			$.getJSON(url, data,
					function (result, textStatus, XMLHttpRequest) {
						if (XMLHttpRequest.status === 200) {
							if (result.status === 'success') {
								setSuccess();
							} else if (result.status === 'error') {
								setError(result.reason)
							} else if (result.status === 'progress') {
								setProgress();
								setTimeout(sendAjax, result.timeout)
							}
						}
					})
		};
		sendAjax();
	}
};
