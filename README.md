### HealthTrackPro

HealthTrackPro is a React Native mobile application designed to help healthcare providers efficiently manage and monitor patient clinical data. This application connects with a Node.js backend and a MongoDB database to store, retrieve, and process patient information and clinical records.

---

### Table of Contents
1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Installation](#installation)
4. [API Endpoints](#api-endpoints)
5. [Screens](#screens)
6. [License](#license)

---

### Features
- **Patient Management**:
  - Add, view, and edit patient details.
  - Maintain a centralized list of all patients.
- **Clinical Data**:
  - Add and view clinical records, including:
    - Blood Pressure
    - Heart Rate
    - Blood Oxygen Levels
    - Respiratory Rate
  - Identify patients in critical condition.
- **Secure Authentication**:
  - Login/logout functionality with token-based authentication.
- **User-friendly Interface**:
  - Responsive UI for healthcare providers.
  - Clear navigation across features.

---

### Technologies Used
- **Frontend**: React Native, Expo, AsyncStorage
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Atlas)
- **Other Tools**: Postman (API Testing), Git (Version Control)

---

### Installation

#### Prerequisites
- Node.js (>=14.x)
- MongoDB (local or Atlas)
- Expo CLI

#### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/adityajanjanam/HealthTrackPro.git
   ```
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure the `.env` file with your MongoDB URI and JWT secret:
   ```
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=<your-secret-key>
   ```
5. Start the server:
   ```bash
   npm start
   ```
   The backend will run on `http://localhost:5000`.

#### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   expo start
   ```

---

### API Endpoints

| Method | Endpoint             | Description                     |
|--------|-----------------------|---------------------------------|
| POST   | `/auth/login`         | User login                     |
| GET    | `/patients`           | Retrieve all patients          |
| POST   | `/patients`           | Add a new patient              |
| GET    | `/patients/:id`       | Get a specific patient         |
| POST   | `/patient-records`    | Add a patient clinical record  |
| GET    | `/patient-records`    | Retrieve clinical records      |

---

### Screens

1. **Login Screen**:
   - Secure user login with token-based authentication.
2. **Home Screen**:
   - Welcome message and quick links to key features.
3. **Manage Patients**:
   - Add, view, and list all patients.
4. **Patient Records**:
   - Add and view detailed clinical records.
5. **App Features**:
   - Highlights key app functionalities, such as managing vital signs and health information.

---

### License
This project is licensed under the MIT License. See the `LICENSE` file for more details.

---

### Contributors
- **Aditya Janjanam** - [GitHub](https://github.com/adityajanjanam)
- Open for collaboration! Feel free to fork and contribute.

---
