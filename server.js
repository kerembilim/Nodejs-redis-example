const express = require('express')
const fetch = require("node-fetch");
const redis = require('redis')
 
const app = express()
 
const client = redis.createClient(6379)
 
app.get('/users', (req, res) => {
    const redisKey = 'users:usersInfo';
    return client.get(redisKey, (err, users) => {
        if (users) {
            return res.json({ source: 'cache', data: JSON.parse(users) })
        } else {
            fetch('https://jsonplaceholder.typicode.com/users')

                .then(response => response.json())
                .then(users => {
                    client.setex(redisKey, 3600, JSON.stringify(users))
                    return res.json({ source: 'api', data: users })
                })
        }
    });
});

app.listen(3000, () => {
    console.log('Server listening on port: ', 3000)
});