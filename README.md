# HealthTrackPro
HealthTrackPro is a React Native mobile app for healthcare providers to track and monitor patient data. It allows adding and viewing patient records, managing clinical data like blood pressure and heart rate, and alerting providers to critical conditions. Designed for efficient healthcare data management with an intuitive interface.
Here’s a sample `README.md` for your **HealthTrackPro** project:

```markdown
# HealthTrackPro

**HealthTrackPro** is a React Native mobile application designed for healthcare providers to track and monitor patient clinical data efficiently. This app helps providers manage patients' vital information, including blood pressure, heart rate, and symptoms, and alerts providers when a patient is in critical condition.

## Features

- **Add and View Patients**: Easily add new patients or view existing patient records.
- **Track Clinical Data**: Monitor patient vitals like blood pressure (systolic/diastolic), heart rate, respiratory rate, blood oxygen level, and more.
- **Critical Condition Alerts**: Automatically identify patients who are in critical condition based on predefined thresholds for clinical data.
- **Patient Symptoms**: Record patient symptoms such as cough, fever, fatigue, and shortness of breath.
- **User Authentication**: Secure login and registration for healthcare providers.
- **24/7 Assistance**: Access to live support for healthcare providers.
  
## Screens

1. **Welcome Screen**: Initial landing page that guides users to login or sign up.
2. **Login & Sign Up**: Secure authentication for healthcare providers.
3. **Home Screen**: Dashboard showing total patients, critical alerts, and quick actions to manage patient data.
4. **Add Patient**: Form to create new patient records.
5. **Add Patient Record**: Form to record clinical data for patients, with options to record vitals and symptoms.
6. **View Patients**: List all patients and filter by name or critical condition.
7. **Patient Detail**: Detailed view of an individual patient’s records and clinical data.
8. **Critical Condition Alert**: List of patients currently in critical condition based on their vitals.
9. **Forgot Password**: Allows healthcare providers to reset their password.
  
## Tech Stack

- **React Native**: For building the mobile application.
- **Node.js**: Backend server for handling API requests.
- **Express**: To manage backend routes and server logic.
- **MongoDB**: Database to store patient and user data.
- **React Navigation**: For navigating between screens.
- **Expo**: For building and running the app in development.

## How to Run the Project

1. **Clone the repository**:
   ```bash
   git clone https://github.com/adityajanjanam/HealthTrackPro.git
   cd HealthTrackPro
   ```

2. **Install dependencies** for the mobile app:
   ```bash
   yarn install
   ```

3. **Run the backend server**:
   ```bash
   cd backend
   npm install
   npm start
   ```

4. **Start the app**:
   ```bash
   expo start
   ```

5. **Access the app**:
   You can scan the QR code from the Expo DevTools to run the app on a physical device, or use an emulator.


## License

This project is licensed under the MIT License.
```
