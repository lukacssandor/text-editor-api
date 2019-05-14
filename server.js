const express = require("express");
const saveToPdf = require('./savetopdf');
const bodyParser = require('body-parser');
const https = require('https');
const cors = require('cors');
const request = require('request');

let app = express();

app.use(cors());
app.use(bodyParser.json());


app.post("/savetopdf", async (req, res, next) => {
	console.log("Save to pdf request");
	console.log(req.body);
	let result = await saveToPdf.saveToPdf(req.body.content);
 	res.send(result);
});

app.post("/savetodrive", async(req, res1, next) => {
	console.log("Save to drive request");
	let result = await saveToPdf.saveToPdf(req.body.content);
	https.get(result.pdf, function (res2) {

		let chunks = [];

		res2.on('data', function (chunk) {
        	chunks.push(chunk);
        });

		res2.on('end', async () => {
			result = Buffer.concat(chunks);

			let headers = {
				'Content-Type': 'application/pdf',
				'Content-Length': result.length,
				'Authorization': 'Bearer ' + req.body.token,
			}

			request.post({
				headers: headers,
				url: 'https://www.googleapis.com/upload/drive/v3/files?uploadType=media',
				body: result
			}, function (err, res3) {
				if (err) {
					console.log('Error: ' + err);
					return;
				} else {
					result = JSON.parse(res3.body);
					
					if (result.error) {
						res1.send({
							"result": "error",
							"message": result.error.message
						});
					} else {
						res1.send({
							"result": "ok",
							"message": "Successful upload" 
						});
					}
				}
			});
    	});
	});
});

app.listen(process.env.PORT || 3000, () => {
	console.log("Server running on port 3000");
});