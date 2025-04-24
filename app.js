const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const port = 3000
const path = require('path');
const axios = require('axios');
const https = require('https');
const fs = require('fs');
const cheerio = require('cheerio');



// 解析 application/x-www-form-urlencoded 格式的数据
app.use(bodyParser.urlencoded({ extended: false }));
// 解析 application/json 格式的数据
app.use(bodyParser.json());

async function download(app_id) {


    let dest_path = path.join(__dirname, `/game/header_${app_id}.jpg`);


    try {

        let fileExist = fs.existsSync(dest_path);

        if (!fileExist) {
            const agent = new https.Agent({
                rejectUnauthorized: false
            });

            let gameDetailUrl = `https://store.steampowered.com/app/${app_id}`;
            // const gameResponse = await axios({
            //     gameDetailUrl,
            //     method: 'GET',
            //     // responseType: 'text',
            //     headers: {
            //         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36'
            //     },
            //     httpsAgent: agent
            // });
            let tmp = await axios.get(gameDetailUrl);
            console.log(tmp);

            let $ = cheerio.load(tmp.data);
            let src = $("#gameHeaderImageCtn").find('img[class=game_header_image_full]').attr("src");


            if (src) {
                const response = await axios({
                    url:src,
                    method: 'GET',
                    responseType: 'stream',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36'
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
            }

        }


    } catch (error) {
        console.error('下载图片时出错:', error);
    }

}


app.post('/down', (req, res) => {
    let app_id = req.body.app_id;

    download(app_id);

    res.send("success")


})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})