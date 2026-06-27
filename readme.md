# 🔗 Upins — URL Shortener

Upins is a lightweight URL shortening service built with **Node.js**, **Express.js**, and **MongoDB**. It transforms long URLs into short, shareable links while maintaining a clean and modern interface.

---

## ✨ Features

* 🔗 Shorten long URLs instantly
* 📋 One-click copy to clipboard
* 📜 View previously generated URLs
* 🚀 Fast redirects
* 🌙 Responsive dark UI
* 💻 Minimal and modern design

---

## 🛠 Tech Stack

**Frontend**

* EJS
* HTML
* CSS
* Vanilla JavaScript

**Backend**

* Node.js
* Express.js

**Database**

* MongoDB
* Mongoose

---

##  How It Works

1. Paste a long URL.
2. Click **Shorten**.
3. Receive a unique short URL.
4. Share it anywhere.
5. Visiting the short URL redirects to the original website.

---

## Project Structure

```
Upins
│
├── models
├── routes
├── views
├── controllers
├── app.js
├── package.json
└── public
```

---

##  Installation

Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/Upins.git
```

Navigate into the project

```bash
cd Upins
```

Install dependencies

```bash
npm install
```

Create a `.env`

```
PORT=8000
MONGO_URI=your_mongodb_connection
```

Run

```bash
npm start
```

Open

```
http://localhost:8000
```

---
##  Features in Detail

* Generate unique short IDs
* Persistent MongoDB storage
* Automatic redirection
* Copy short links with one click
* View all generated URLs
* Responsive UI
* IP-based history support (optional)

---

##  Screens

* Landing Page
* URL Generator
* Generated Link
* URL History

---

##  Future Improvements

* User authentication
* QR code generation
* Click analytics
* Custom aliases
* Link expiration
* Password-protected URLs
* API support
* Dashboard

---

##  Author

**Kashif Ahmed**

LinkedIn:
https://www.linkedin.com/in/a-kashif-ahmed/

---

## 📄 License

This project is licensed under the MIT License.
