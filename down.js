
let url = `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/570/header.jpg?t=1739210483`

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');



const axios = require('axios');

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

download(1293830);