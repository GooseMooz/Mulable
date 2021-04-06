// const Discord = require("discord.js");
// const discord = new Discord.client();
// const Spotify = require("spotify-web-api-node");
// const spotify = new Spotify();
const grouptoken = "cc11cc0601ec8a27f6a225dd8f7d8942888c038176d8ba4362820de14fe50d56a6bf56c0a8472fe70ab37";
const servicetoken = "662c37d6662c37d6662c37d691665b0b046662c662c37d606473c8f899acd11edcdac5b";
const groups = [-39531827, -173914857, -63822860,-203645584];
const usefullPosts = new Map();

import { VK } from 'vk-io';

const vk = new VK({
    token: servicetoken
});

function sendContent(owner_id, media_id) {
    vk.api.messages.send({
        user_id: 364599236,
        random_id: Math.floor(Math.random() * Math.floor(999)),
        attachment: `wall${owner_id}_${media_id}`,
        access_token: grouptoken
    }).then(() => {
        console.log("Post sent!");
    }).catch((err) => {
        console.log(err);
    })
}

async function run() {
    setInterval(() => {
        for (let i = 0; i < 3; i++) {
            let groupid = groups[i];
            vk.api.wall.get({
                owner_id: groupid,
                count: 1
            }).then((data) => {
                let response;
                response = data.items[0].id;
                if (usefullPosts.get(groupid) === undefined) {
                    usefullPosts.set(groupid, response);
                }
                else {
                    if (response !== usefullPosts.get(groupid)) {
                        sendContent(groupid, response);
                        usefullPosts.set(groupid, response);
                    }
                }
            }).catch(err => {
                console.log(err);
            })
        }
    }, 3000);
}

run().then(() => {console.log("Good :)");}).catch((err) => {console.log(err);});