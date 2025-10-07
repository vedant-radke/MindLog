# MentalHealth Project

## Overview

This project includes a Node.js script for sending email notifications to users who have missed their daily journal entries. It's designed to help users maintain consistency with their journaling habit and keep their "MindLog" streak alive.

<img width="1118" height="602" alt="image" src="https://github.com/user-attachments/assets/48d4a699-3e46-448a-b78f-0c822746a531" />

## Key Features

- **Automated Email Notifications:** Sends reminders to users who haven't submitted a journal entry for the day.
- **Streak Tracking:** Integrates with a user streak system to encourage daily engagement.
- **Email Verification:** New signups receive a verification link; unverified accounts cannot log in until confirmed.

## `notifyMissedJournal.js`

This script is responsible for scheduling and sending the missed journal notifications.

### Functionality

- **Cron Scheduling:** Uses `node-cron` to schedule a daily check at 9 PM (21:00).
- **User Query:** Fetches users from the database who have an active streak but haven't written a journal entry today.
- **Email Sending:** Sends personalized email reminders using the `sendEmail` utility.

### Dependencies

- `node-cron`: For scheduling the task.
- `User` model: Mongoose model for querying user data.
- `sendEmail` utility: Function for sending emails.

### Setup

1.  **Install Dependencies:**

    ```bash
    npm install node-cron
    ```

2.  **Configuration:**

    - Ensure your `.env` file includes the necessary email configuration for the `sendEmail` utility.
    - Set up your MongoDB connection for the `User` model.
    - Provide `CLIENT_URL`, `EMAIL_VERIFICATION_EXPIRY_HOURS`, and (optionally) `EMAIL_VERIFICATION_RESEND_MINUTES` environment variables for the verification flow.

### Scheduling

The script is set to run daily at 9 PM. You can adjust the cron schedule in `notifyMissedJournal.js` as needed.

## Models

- **User**: Mongoose model to represent users in the database. Includes fields like `streak`, `lastJournalDate`, `email`, and `name`.

## Utilities

- **sendEmail**: Reusable function to send emails.

## Contributing

Feel free to contribute to the project by submitting pull requests, reporting issues, or suggesting improvements.

## License

[Your License]
