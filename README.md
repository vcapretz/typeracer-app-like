# TypeRacer APP
> type as fast as you can to battle your friends!

Although this project is in just one repository (as it is supposed to serve for a test), in a real-world scenario it would be better if spplited into two different repos, but the hole structure were developed with that in mind, so both of them has a `package.json`, `Dockerfile` and run separately.

This is a simple implementation of [TypeRacer](http://typeracer.com/) game, using websocket to emit events.

When entering a room the user can wait for 2 or more people to join and then start it.
Starting the game enables users to type the shown text (random size, random words, 200 words max); copying and pasting are not allowed (and will not work as expected ¯\_(ツ)_/¯).

The room doesn't have a game-ending, so people can join and leave anytime. If you keep playing your average score should improve and your ranking will be better.

#### Score
The ranking is calculted by dividing the correct keys typed per total time typing.

The formula is: `countTotalCorrectKeysPressed / (timeBetweenFirstAndLastKeyPressed)` (the time in milliseconds)

Enjoy it! 🎊

## Live demo

For a live demo, access the url: https://typeracer-app.now.sh/

It was deployed using [now](https://zeit.co/now)

## The stack

### Front-end (APP)

- [React](https://facebook.github.io/react/)
- [Socket.io-client](https://github.com/socketio/socket.io-client)
- [Babel](https://babeljs.io/)
- [eslint](https://eslint.org/)
- [Webpack](https://webpack.js.org/)

### Back-end (API)

- [Node.js](https://nodejs.org/en/)
- [koa](http://koajs.com/)
- [Socket.io](https://github.com/socketio/socket.io)
- [eslint](https://eslint.org/)
- [faker](https://github.com/Marak/Faker.js)
- [moment](https://momentjs.com/)

## Dependencies

Almost every dependency will be installed when you run `npm i` in both folders (`./app` and `./api`) but you will need:

- Node.js v8+ and npm v5+ installed

or

- Docker and/or docker-compose to run

## Running

You can run both projects by hitting `npm start` (make sure to install the dependencies before it) or each project folder or `docker-compose build && docker-compose up` on the root (it will run both).

You should be able to access:
- http://localhost:3000 for the API
- http://localhost:8080 for the app

## Linting

Always make sure that you are following a Airbnb-based styleguide by running:
```bash
$ npm run lint
```

--------

Bye! 🖖