/**
 * QrCodeGenerator
 * Create a form and generate an QR Code image for the URL provided
 * Use qrserver API V1
 *
 * Usage:
 * const my_qr_code = new QrCodeGenerator("my_qr_code", {
 *   size: 150, // Default value is 200 / [10-1000] or [10-1000000] for format=svg|eps
 *   color: "255-0-0", // Default value is "0-0-0" / [0-255]-[0-255]-[0-255] or hex value
 *   bgcolor: "0000ff", // Default value is "0-0-0" / [0-255]-[0-255]-[0-255] or hex value
 *   margin: 10, // Default value is 1 / [0-50]
 *   qzone: 10, // Default value is 0 / [0-100]
 *   format: "jpeg" // Default value is "png" / validate format is ["png", "gif", "jpeg", "jpg", "svg", "eps"]
 * });
 */
class QrCodeGenerator {
	constructor(containerId, options = null) {
		this.containerId = containerId;
		this.options = typeof options !== "undefined" ? options : null;
		this.validFormat = ["png", "gif", "jpeg", "jpg", "svg", "eps"];
		this.format = "png";
		this.api = `https://api.qrserver.com/v1/create-qr-code/`;
		this.#buildForm();
	}
	
	#apiUrl(data) {
		let apiUrl = `${this.api}?`;
		if (this.options !== null) {
			if (this.options.hasOwnProperty('format') && this.validFormat.includes(this.options.format)) {
				this.format = this.options.format;
				apiUrl += `&format=${this.format}`;
			}
			if (this.options.hasOwnProperty('size') && this.#validSizeFormat(this.options.size)) {
				apiUrl += `&size=${this.options.size}x${this.options.size}`;
			}
			if (this.options.hasOwnProperty('color') && this.#validColorData(this.options.color)) {
				apiUrl += `&color=${this.options.color}`;
			}
			if (this.options.hasOwnProperty('bgcolor') && this.#validColorData(this.options.bgcolor)) {
				apiUrl += `&bgcolor=${this.options.bgcolor}`;
			}
			if (this.options.hasOwnProperty('margin') && this.#validDecimal(this.options.margin, 0, 50)) {
				apiUrl += `&bgcolor=${this.options.margin}`;
			}
			if (this.options.hasOwnProperty('qzone') && this.#validDecimal(this.options.qzone, 0, 100)) {
				apiUrl += `&qzone=${this.options.qzone}`;
			}
		}
		return `${apiUrl}&data=${data}`;
	}
	
	#validSizeFormat(size) {
		let maxSize = 1000;
		if (["svg", "eps"].includes(this.format)) {
			maxSize = 1000000;
		}
		if (this.#validDecimal(size, 10, maxSize)) {
			return true;
		}
		return false;
	}
	
	#validColorData(color) {
		let regexHex3 = /[0-9A-Fa-f]{3}/g;
		let regexHex6 = /[0-9A-Fa-f]{6}/g;
		if (regexHex3.test(color) || regexHex6.test(color)) {
			return true;
		} else {
			let decimals = color.split('-');
			if (decimals.length === 3 && this.#validDecimal(decimals[0]) && this.#validDecimal(decimals[1]) && this.#validDecimal(decimals[2])) {
				return true;
			}
		}
		return false;
	}
	
	#validDecimal(decimal, min = 0, max = 255) {
		if (decimal >= min && decimal <= max) {
			return true;
		}
		return false;
	}
	
	#buildForm() {
		let container = document.querySelector("#" + this.containerId);
		
		let container_img = document.createElement("div");
		container_img.classList.add("qr_code_img_container");
		let img = document.createElement("img");
		img.classList.add("qr_code_img");
		img.setAttribute("src", "");
		img.setAttribute("alt", "");
		img.setAttribute("onClick", "QrCodeGenerator.download(this)");
		container_img.appendChild(img);
		container.appendChild(container_img);
		
		let container_form = document.createElement("div");
		container_form.classList.add("qr_code_form_container");
		let input = document.createElement("input");
		input.classList.add("qr_code_input");
		input.setAttribute("type", "text");
		input.setAttribute("spellcheck", "false");
		input.setAttribute("placeholder", "Enter url");
		input.setAttribute("autocomplete", "off");
		container_form.appendChild(input);
		let button = document.createElement("button");
		button.classList.add("qr_code_button");
		button.innerHTML = "Generate QR Code";
		button.addEventListener("click", () => {
			let container = document.querySelector("#" + this.containerId);
			let input = container.querySelector("input");
			let image = container.querySelector("img");
			image.src = this.#apiUrl(input.value);
			image.alt = "qr code " + new URL(input.value).hostname.replace("www.", "").split(".")[0];
			image.setAttribute("data-ext", this.format);
		});
		container_form.appendChild(button);
		container.appendChild(container_form);
	}
	
	static download(qr_code) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", qr_code.getAttribute("src"), true);
		xhr.responseType = "blob";
		xhr.onload = function () {
			var urlCreator = window.URL || window.webkitURL;
			var imageUrl = urlCreator.createObjectURL(this.response);
			var tag = document.createElement("a");
			tag.href = imageUrl;
			tag.download = qr_code.getAttribute("alt").replaceAll(" ", "-") + "." + qr_code.dataset.ext;
			document.body.appendChild(tag);
			tag.click();
			document.body.removeChild(tag);
		};
		xhr.send();
	}
}
