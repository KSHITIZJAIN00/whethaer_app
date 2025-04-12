![68747470733a2f2f7777772e68746d6c68696e74732e636f6d2f696d6167652f72656163742f7265616374576561746865724170702e706e67](https://github.com/user-attachments/assets/e2683de3-87e9-427e-9f99-5d57cbf21071)
--

Backend Setup (Node.js + Express) -->

cd server
npm init -y
Install the required packages: 
npm install express axios cors dotenv
Create .env file:
touch .env

Inside .env:
API_KEY=your_openweathermap_api_key_here

Frontend Setup (React) :
Create React App :
npx create-react-app client
cd client
Install Axios:
npm install axios

Running Both Backend and Frontend -->
node server.js
npm start
