var Api2Pdf = require('api2pdf');   
var a2pClient = new Api2Pdf('6350995c-48de-46fe-b9d9-5c5705514cd8');

var options = { orientation: 'landscape', pageSize: 'A4'};

exports.saveToPdf = async function (data) {
	return new Promise((resolve, reject) => {
		a2pClient.wkhtmltopdfFromHtml(data, inline = true, filename = 'test.pdf', options = options).then(function(result) {
			resolve(result);
		});
	});
}