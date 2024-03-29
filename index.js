/// DISCORD
// const Discord = require("discord.js");
// const discord = new Discord.client();
/// DISCORD

/// SPOTIFY
import request from 'request';
import SpotifyWebApi from 'spotify-web-api-node';
const spotify = new SpotifyWebApi();
const spotify_url = "https://accounts.spotify.com/api/token";
const authorizationCode = "";
const options = {
    method: 'POST',
    uri: spotify_url,
    form: {
        'grant_type': 'client_credentials'
    },
    headers: {
        "Authorization": `Basic ${authorizationCode}`
    }
};

function doRequest() {
    return new Promise(function (resolve, reject) {
        request(spotify_url, options, function (error, res, body) {
            if (!error && res.statusCode === 200) {
                resolve(String(JSON.parse(body).access_token));
            } else {
                reject(error);
            }
        });
    });
}

function checkBody (response) {
    if (response.body.albums.items[0] === undefined) {
        return "Not found, sorry :c"
    }
    else {
        return String(response.body.albums.items[0].external_urls.spotify)
    }
}

function getLink (song_name, token) {
    return new Promise(function (resolve, reject) {
        spotify.searchAlbums(song_name, {
            limit: 1,
            access_token: token
        }).then(res => {
            resolve(checkBody(res));
        }).catch(err => {
            reject(err);
        })
    })
}
/// SPOTIFY

/// VK
import {VK} from 'vk-io';
const grouptoken = "";
const servicetoken = "";
const groups = [];
const usefullPosts = new Map();
const vk = new VK({ token: servicetoken });
const users = []

function postId(groupId) {
    return new Promise(function (resolve, reject) {
        vk.api.wall.get({
            owner_id: groupId,
            count: 1
        }).then((data) => {
            resolve(data.items[0].id);
        }).catch(err => {
            reject(err);
        });
    });
}

function getText(groupId) {
    return new Promise(function (resolve, reject) {
        vk.api.wall.get({
            owner_id: groupId,
            count: 1
        }).then((data) => {
            resolve(data.items[0].text.split("\n")[0]);
        }).catch(err => {
            reject(err);
        });
    });
}

function sendContent(owner_id, media_id, link, user_id) {
    vk.api.messages.send({
        user_id: user_id,
        random_id: Math.floor(Math.random() * Math.floor(999)),
        message: link,
        attachment: `wall${owner_id}_${media_id}`,
        access_token: grouptoken
    }).then(() => {
        console.log("Post sent!");
    }).catch((err) => {
        console.log(err);
    })
}
/// VK

async function run() {
    setInterval(async () => {
        const token = await doRequest();
        for (let i = 0; i < 4; i++) {
            let groupid = groups[i];
            const response = await postId(groupid);
            const text = await getText(groupid);
            if (usefullPosts.get(groupid) === undefined) {
                usefullPosts.set(groupid, response);
            }
            else {
                if (response !== usefullPosts.get(groupid)) {
                    const link = await getLink(text, token);
                    for (let i = 0; i < 2; i++) {
                        sendContent(groupid, response, link, users[i])
                    }
                    sendContent(groupid, response, link);
                    usefullPosts.set(groupid, response);
                }
            }
        }
    }, 3000);
}
run().then(() => {console.log("Good :)");}).catch((err) => {console.log(err);});
