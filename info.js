import React, { useState } from "react";
import axios from "axios"; // Make sure Axios is installed

const Info = () => {
  const [userInput, setUserInput] = useState("");
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false); // State to track loading status

  // Card data
  const responses = [
    {
      user: "I have a runny nose, mild sore throat, and a slight cough. No fever.",
      ai: "It looks like you may have a mild cold or seasonal allergies. Rest, stay hydrated, and try over-the-counter medications like antihistamines or cough drops. If symptoms worsen, consider visiting a doctor.",
    },
    {
      user: "I've been experiencing stomach cramps, nausea, and bloating for the past two days. No fever, but I feel uncomfortable.",
      ai: "These symptoms could be due to indigestion, food intolerance, or mild gastritis. If the pain persists or worsens, consider seeing a gastroenterologist for evaluation. Avoid heavy meals and try drinking ginger tea for relief.",
    },
    {
      user: "I have sharp chest pain, shortness of breath, and my left arm feels numb.",
      ai: "Your symptoms could indicate a serious medical emergency such as a heart attack. Please seek immediate medical attention by calling emergency services or going to the nearest hospital.",
    },
    {
      user: "I have persistent headaches and dizziness. What should I do?",
      ai: "Your symptoms could be due to migraines, dehydration, or other underlying conditions. Consider visiting a neurologist or general physician for further assessment.",
    },
  ];

  const [currentCardIndex, setCurrentCardIndex] = useState(0); // Track the current card index

  // CSS Styles
  const styles = {
    container: {
      padding: "20px",
      position: "relative",
      display: "flex",
      justifyContent: "center", 
      alignItems: "center", 
      flexDirection: "column", 
      minHeight: "100vh", 
    },
    header: {
      textAlign: "center",
      marginBottom: "20px",
    },
    submitButton: {
      padding: "10px 20px",
      backgroundColor: "#00796b",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "16px",
      marginTop: "10px",
    },
    responseContainer: {
      marginTop: "20px",
      padding: "20px",
      backgroundColor: "#e0f7fa",
      borderRadius: "15px",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      textAlign: "left",
      border: "1px solid #e0f7fa",
    },
    loadingText: {
      marginTop: "20px",
      fontSize: "16px",
      color: "#00796b",
    },
    disclaimer: {
      marginTop: "30px",
      padding: "8px",
      backgroundColor: "#8a270c",
      borderRadius: "8px",
      fontSize: "5px",
      color: "white",
      maxWidth: "600px",
      margin: "50px auto",
    },
    card: {
      backgroundColor: "#e0f7fa",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      padding: "20px",
      maxWidth: "600px",
      marginBottom: "20px",
      width: "100%",
    },
    button: {
      padding: "10px 20px",
      backgroundColor: "transparent",
      border: "none",
      fontSize: "24px", // Increase size for better visibility
      cursor: "pointer",
      marginTop: "20px",
      color: "#00796b",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "center", // Center the buttons horizontally
      gap: "20px", // Add spacing between the buttons
      marginTop: "20px",
    },
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true); // Set loading to true when the request starts
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [
            { role: "system", content: "You are giving simple health advice." },
            { role: "user", content: userInput },
          ],
          max_tokens: 150,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer `, // Replace with your OpenAI API key
            "Content-Type": "application/json",
          },
        }
      );
      setResponseText(response.data.choices[0].message.content);
    } catch (error) {
      console.error("Error fetching API response:", error);
      setResponseText("There was an error fetching the response.");
    } finally {
      setLoading(false); // Set loading to false once the request is done
    }
  };

  // Button functions for navigating through the cards
  const nextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % responses.length);
  };

  const prevCard = () => {
    setCurrentCardIndex(
      (prevIndex) => (prevIndex - 1 + responses.length) % responses.length
    );
  };

  return (
    <div style={styles.container}>
      <div>
        <input
        type="text"
        placeholder="Ask AI (Runny Nose, Cold, Fever, Chest Pain, etc)"
        value={userInput}
        onChange={handleInputChange}
      />
      <button style={styles.submitButton} onClick={handleSubmit}>
        Submit
      </button>
      </div>

      {/* Show loading text if the request is in progress */}
      {loading && <p style={styles.loadingText}>Loading...</p>}

      {/* Display AI response under the input */}
      {responseText && !loading && (
        <div style={styles.responseContainer}>
          <p>
            <strong>Your AI Assistant:</strong> {responseText}
          </p>
        </div>
      )}

      {/* Render the current card based on the currentCardIndex */}
      <h1 style={styles.header}>AI Example Responses:</h1>
      <div style={styles.card}>
        <div className="card-header">
          User: {responses[currentCardIndex].user}
        </div>
        <div className="card-body">
          <p>AI: {responses[currentCardIndex].ai}</p>
        </div>
      </div>

      {/* Buttons for navigating cards */}
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={prevCard}>
          ←
        </button>
        <button style={styles.button} onClick={nextCard}>
          →
        </button>
      </div>

      {/* Disclaimer Section */}
      <div style={styles.disclaimer}>
        <p>
          <strong>⚠ Disclaimer</strong>: This AI Symptom Checker is for
          informational purposes only and does not provide medical advice. Please
          consult a healthcare professional for an accurate diagnosis and treatment.
        </p>
      </div>
    </div>
  );
};

export default Info;
