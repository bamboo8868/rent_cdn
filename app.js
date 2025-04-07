const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const port = 3000
const path = require('path');
const axios = require('axios');
const https = require('https');
const fs = require('fs');



// 解析 application/x-www-form-urlencoded 格式的数据
app.use(bodyParser.urlencoded({ extended: false }));
// 解析 application/json 格式的数据
app.use(bodyParser.json());

async function download(app_id) {
		let url = `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${app_id}/header.jpg`;;

			let dest_path = path.join(__dirname, `/game/header_${app_id}.jpg`);
    try {

    	        const agent = new https.Agent({
            rejectUnauthorized: false
        });


        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
            headers:{
            	'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36'
            },
            httpsAgent: agent
        });

        const writer = fs.createWriteStream(dest_path);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        console.log('图片下载成功');
    } catch (error) {
        console.error('下载图片时出错:', error);
    }

}


app.post('/down', (req, res) => {
    let account = req.body.account;
    let password = req.body.password;

    let app_id = req.body.app_id;

    download(app_id);

     res.send("success")


})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})