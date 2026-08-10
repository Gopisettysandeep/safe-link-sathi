# Fraud sheild

Build a real-world mobile application titled "Fraud Detection in Online Transactions" that helps users verify whether a QR code or transaction URL is safe before making payments.



---



Purpose:

The application must detect fraudulent or suspicious QR codes and URLs used in online transactions and provide users with a clear and accurate risk assessment.



---



Target Users:

All users who perform online payments and want to ensure transaction safety.



---



Application Flow:



1. Launch Screen:

   - Display an attractive, colorful, and modern welcome screen.

   - No login/signup required.



---



2. Language Selection Screen:

   - Provide the following main languages:

     

     - Telugu

     - English

     - Hindi

     - Tamil

   

   - Optional additional languages (Kannada, Malayalam, etc.)

   

   - After selection, the entire app should operate in the chosen language.

   

   - Add a speaker (🔊) icon beside each language option:

     

     - When clicked, it should play voice guidance in that language (e.g., pronunciation or welcome message).



---



3. Global Voice Assistance (Important Feature):



- Implement voice assistance throughout the app based on the selected language.

- Add a speaker button (🔊) on every main screen (top-right corner).



Voice behavior:



- Reads instructions aloud (e.g., “Scan QR Code”, “Upload Image”, “Enter URL”)

- Explains results (e.g., “This QR code is safe”, “Be careful”, “Fraud detected”)

- Guides user step-by-step through the app



Voice settings:



- Voice should match selected language only

- Include:

  - Mute / Unmute toggle

  - Replay voice button

- Ensure clear and natural voice output (Text-to-Speech)



---



Main Home Screen:



- Clean and interactive UI with three main options:

  

  1. Scan Live QR Code

  2. Upload QR Code Image

  3. Enter or Paste Transaction URL



- Top-left: Back button



- Top-right:

  

  - Language switch 🌐

  - Speaker (🔊) for voice assistance



---



QR & URL Processing (Must Work Properly):



- Live QR Scanner:

  

  - Use device camera to scan QR codes in real-time

  - Accurately decode QR content



- QR Image Upload:

  

  - Upload from gallery

  - Correctly extract QR data



- URL Input:

  

  - Accept and validate links properly

  - Ensure no failure or empty results



---



Fraud Detection Logic:



- QR content validation (UPI/payment format check)

- URL safety analysis:

  - HTTPS vs HTTP

  - Suspicious keywords (verify, alert, free, update, secure)

  - Domain types (.xyz, .top, .click, .info)

- IP-based detection:

  - Suspicious IP origin

  - Location mismatch

- Unknown/new pattern detection

- Blacklist checking



---



Risk Score System:



- Generate risk score (0–100)



Display:



- 0–30 → "Completely Safe" (Green)

- 31–60 → "Be Careful" (Yellow)

- 61–100 → "Fraud Detected" (Red)



Also include:



- Clear explanation (e.g., “Suspicious domain detected”)

- Voice output explaining result



---



Result Screen:



- Show:

  - Risk Score (large)

  - Status message

  - Explanation

- Buttons:

  - Scan Again

  - Go Back

- Include voice playback of result



---



Additional Features:



- Store scan history (QR + URL + results)

- Show safety tips for users

- Real-time warning before opening risky links

- Smooth animations and transitions

- Offline basic QR scanning

- Fast performance

- Error handling (invalid QR, broken URL, no internet)



---



Technical Stack:



- Frontend: Flutter

- Backend: Python (FastAPI)

- QR Processing: OpenCV + Pyzbar

- URL Handling: Python Requests

- IP Analysis: GeoIP / IPInfo APIs

- Database: Firebase Firestore

- Voice Assistance: Text-to-Speech (TTS) APIs supporting multiple languages



---



Design Requirements:



- Highly interactive and colorful UI

- Modern mobile-first design

- Beginner-friendly navigation

- Use icons, animations, and visual indicators

- Clean responsive layouts



---



Output Expectation:



Generate a fully functional mobile application structure including:



- All UI screens

- Smooth navigation

- Working QR scanning, image upload, and URL validation

- Integrated fraud detection logic

- Fully implemented multilingual voice assistance



The application should behave like a real-world deployable product, not just a prototype.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://safe-link-sathi.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/fe9e9eb4-3c2c-4189-950f-d9080b0a6d0c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
