# Notes Application

A mobile notes application built with **React Native, Expo, and TypeScript**. The application allows users to capture ideas, organise notes into categories, and easily find notes using search and sorting features.

## APK Download (Google Drive)

Download and install the Android APK using the link below:

[Download APK](https://drive.google.com/drive/folders/1q2l3ABR-f16txAxU--lApmx44Qga6KLt?usp=sharing)

## Features

- **Onboarding:** Welcome screen with an illustration and navigation to Login or Register.
- **Registration:** Create an account with email, username, and password validation.
- **Login:** Sign in using registered account credentials.
- **Password Visibility:** Show or hide passwords using the eye icon.
- **Password Hashing:** Hash passwords using bcryptjs before saving.
- **Notes Management:** Create, view, edit, and delete notes.
- **Categories:** Organise notes into categories and view notes within each category.
- **Search:** Search notes by title, content, or category.
- **Sorting:** Sort notes from newest to oldest or oldest to newest.
- **Profile:** View and update username information and log out.
- **Empty States:** Display illustrations when no notes or search results are available.
- **Local Storage:** Save application data locally using AsyncStorage.

## Technologies Used

React Native : Building the mobile user interface 
 TypeScript : Adding type safety 
 Expo : Developing and running the application 
 Expo Router : Navigating between screens 
 AsyncStorage : Storing users, sessions, and notes locally 
 bcryptjs : Hashing and verifying passwords 
 expo-crypto : Providing secure random bytes for bcryptjs 
 lucide-react-native :  Displaying icons 

## Screens and Components


 Onboarding : Introduces the application and provides Login and Register navigation 

  Register : Validates registration details and creates a new account 
 Login : Verifies user credentials and starts a local session 
 Home : Displays categories, note totals, search, and sorting options 
 Category Notes : Displays notes belonging to a selected category 
 Add Note : Allows users to create notes 
 Profile : Displays user information, supports username editing, and logout 
 CustomInput : Reusable input component with password visibility functionality 

## User Interface

The application uses a clean and playful design 

## Getting Started

### Prerequisites

Before running the application, ensure you have:

- Node.js and npm installed.
- Expo Go installed on a supported mobile device or an Android emulator.
- Git installed.

### Installation

**1. Clone the repository**

```bash
git https://github.com/Karabo-Merinah/Notes-App.git
```

**2. Navigate to the project directory**

```bash
cd Notes-Application
```

**3. Install dependencies**

```bash
npm install
```

**4. Start the development server**

```bash
npx expo start
```

**5. Run the application**

Scan the QR code using Expo Go or follow the terminal instructions to launch the application on an emulator.

## Data Storage

The application uses AsyncStorage to store information locally on the device.

- Registered user information.
- Logged-in user session.
- Notes and their categories.

Passwords are hashed using bcryptjs before being stored.

## What I Have Learned

During the development of this application I learnt :

- Navigating between screens using Expo Router.
- Storing and retrieving data using AsyncStorage.
- Implementing CRUD operations for notes.
- Filtering and sorting data based on user input.
- Validating registration forms and handling errors.
- Implementing password visibility toggles.
- Hashing passwords using bcryptjs and expo-crypto.
- Creating reusable components.
- Applying consistent styling using React Native StyleSheet.


## Future Improvements

- Implement backend authentication and database integration.
- Implement secure session management.
- Add reminders and notifications for notes.
