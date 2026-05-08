# PaceWise — Presentation Script
> Casual demo walkthrough. Walk through the app live while delivering these lines.

---

## Opening

"Hi everyone! Today we're presenting **PaceWise** — a web app designed to help students manage their study life all in one place. You can take notes, create flashcards, track your schedule, and even generate practice quizzes using AI.

Let's go ahead and walk through the app."

---

## 1. Landing Page

"So this is the first page you see when you visit PaceWise. It's simple, clean, and tells you exactly what the app is about.

One thing worth mentioning — if you're already logged in, the app automatically detects your session and skips this page entirely, sending you straight to your dashboard. No extra steps needed."

---

## 2. Sign-In Page

"To get started, you just sign in with your Google account — one click and you're in. We used **Supabase** for authentication, which handles the whole Google OAuth flow for us. So there's no separate registration, no passwords to remember — just your Google account."

---

## 3. Dashboard

"Once you're logged in, this is your home base — the Dashboard.

At the top, it greets you by name. Below that you can see your **progress** across all your subjects — each one has a progress bar showing how far along you are.

On the right side, you've got a few stat cards:

- The **Study Streak** tracks how many consecutive days you've studied. It shows a little flame icon when you're active. Miss a day and it resets — kind of like Duolingo.
- The **Time Studied** card counts how long you've been active in the current session, updating every second in real time.
- And at the bottom, there's a **Last Viewed Course** card that remembers which subject you were working on, so you can jump right back in."

---

## 4. Schedule Page

"This is the Schedule page. Here you can manage all your subjects and their class schedules — add new ones, edit existing ones, or delete them.

There's also a **search bar** so you can quickly find a subject if you have a lot of them. The list is paginated so it doesn't get overwhelming.

One thing that's neat: the Schedule and Notes pages are actually synced. If you add a subject in Notes, it automatically appears here too — and the other way around. So you only ever have to add a subject once."

---

## 5. Notes — Subjects

"Speaking of Notes — this is the Notes page. Your subjects show up as cards in a grid, and each card tells you when it was last updated.

You can add a new subject right from here using the button at the top. And like I mentioned, any subject you add here shows up in the Schedule page as well."

---

## 6. Notes — Pages List

"When you click on a subject, you go into its notebook. This is where all your note pages for that subject live.

You can create as many pages as you want, and you can also **tag** each page. Those tags show up right here on the list, and there's a search bar at the top so you can filter notes by tag — really handy if you're looking for a specific topic."

---

## 7. Notes — Editor

"And this is the actual editor. This is where you write your notes.

It's a rich text editor — so you can use **bold**, *italic*, underline, headings, and blockquotes. Your notes save automatically as you type, so you never have to worry about losing your work.

Now here's one of our favorite features — the **Lookup tool** on the right side. You type any word or phrase, and it instantly pulls results from two external APIs:

- **Wikipedia** — gives you a summary and a thumbnail of the topic, with a link to read more.
- **Free Dictionary API** — gives you the definition, part of speech, phonetic pronunciation, and even a little speaker icon so you can hear how the word is pronounced.

Both of these are free public APIs, so no API key needed — and they run side by side so you get both results at the same time.

There's also a **Create Flashcard** button right here in the editor. So while you're taking notes, if you come across something you want to review later, you can instantly turn it into a flashcard without leaving the page.

And the **Tags** button lets you label the current page, which feeds into that tag search we saw earlier."

---

## 8. Flashcards — Subject Selection

"Moving on to Flashcards. This page shows all your subjects — same ones from the Notes and Schedule pages — as cards in a grid. You just pick the subject you want to study."

---

## 9. Flashcards — Deck View

"Inside a subject, you see all the flashcards in that deck. You can **add cards manually** with a question and answer, or **delete** individual cards. There's also a delete deck button if you want to wipe the whole thing.

When you're ready to study, you hit **Study Mode**."

---

## 10. Flashcards — Study Mode

"Study Mode is where the learning happens. You see the question, and when you're ready, you flip the card to reveal the answer.

You go through all your cards one by one. And here's a small but important detail — studying your flashcards actually **updates your Study Streak** on the Dashboard. So the app rewards you for actually sitting down and reviewing."

---

## 11. Practice Test Page

"Last page — the Practice Test. The idea here is that you can generate a quiz straight from your notes using AI.

We built the full infrastructure for this using **Ollama**, which lets you run a large language model locally — specifically **LLaMA 2**. You'd send your notes to the model, it reads them, and generates multiple choice and true-or-false questions automatically.

The quiz feature is currently disabled on the UI because running Ollama requires a local machine setup, but the backend is fully wired up — the API routes for generating questions, starting a quiz, submitting answers, and viewing results are all there and ready to go."

---

## Closing

"And that's PaceWise!

To quickly recap what we used to build it:
- **Next.js** for the frontend and backend routes
- **Supabase** for our database and Google sign-in
- **Wikipedia API** and **Free Dictionary API** for the in-editor Lookup tool
- **Ollama with LLaMA 2** for the AI quiz generation feature

It's a complete study companion — notes, flashcards, scheduling, and AI-powered quizzes, all in one place.

Thanks for listening, and we're happy to take any questions!"
