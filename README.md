# uu1stGear

The swipe-based application made for you to find the perfect car !

This is a Unicorn University project for the class "Cloud Application
Architecture".

## Installation

Initialise all submodules by running

```bash
git submodule update --init --recursive
```

Then you have to start the two servers :

## Backend

To start the backend, run

```bash
cd backend
node app.js
```

## Frontend

To start the frontend, run

```bash
cd frontend
npm run build
npm run preview
```

## How to use?

Once you started both servers, you can go the URL given by the frontend, and
start to use the app.

You will see a CarCard, and traffic lights. If you like the car you can press
the Green light and it will save it from you. It won't be shown again. If you
press the Red light, the car will be remembered as disliked and won't be shown
again. If you press the Yellow light, it will just show you another car and take
no action.

## Authors

- [Jules-Arthus KLEIN](https://www.github.com/jularthus)
