# Frontend Dashboard (React)

This is the frontend dashboard for your project, built with [Create React App](https://github.com/facebook/create-react-app) and Material UI.

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── FileUpload/
│   ├── components/
│   └── ...
├── package.json
└── README.md
```

## Available Scripts

In the `frontend` directory, you can run:

### `npm install`

Installs all dependencies.

### `npm start`

Runs the app in development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

## Features

- Upload video/audio files for transcription
- View transcribed data
- Responsive Material UI design

## API Integration

This frontend expects an API server running (see your backend project) and uses endpoints like:

- `POST http://localhost:4000/api/upload` for file uploads
- `GET http://localhost:4000/api/transcripts` for fetching transcripts

Update these endpoints in the code if your backend runs elsewhere.

## Learn More

- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React Documentation](https://reactjs.org/)
- [Material UI Documentation](https://mui.com/)

---

For backend/API instructions, see the `backend` folder or the main project README.