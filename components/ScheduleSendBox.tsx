"use client";
import React, { useState } from "react";

export default function ScheduleSendBox() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [dateTime, setDateTime] = useState("");

  const handleScheduleSend = async () => {
    if (!email || !message || !dateTime) {
      alert("Please fill everything.");
      return;
    }

    const payload = {
      email,
      message,
      dateTime,
    };

    await fetch("/api/schedule-send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    alert("Message scheduled!");
  };

  return (
    <div className="p-4 bg-white shadow rounded max-w-lg mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">📬 Schedule a Message</h2>
      <input
        type="email"
        placeholder="Recipient Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border w-full p-2 mb-4 rounded"
      />
      <textarea
        placeholder="Your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border w-full p-2 mb-4 rounded"
        rows={4}
      />
      <input
        type="datetime-local"
        value={dateTime}
        onChange={(e) => setDateTime(e.target.value)}
        className="border w-full p-2 mb-4 rounded"
      />
      <button
        onClick={handleScheduleSend}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Schedule Send
      </button>
    </div>
  );
}
