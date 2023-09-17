import React, { useState } from "react";
import axios from 'axios';

export default function App() {
  // State
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    color: '',
    aboutYourself: '',
  });
  const [responseData, setResponseData] = useState(null);
  const [showForm, setShowForm] = useState(true);
  
  // Mock data
  const questions = [
    { id: 1, type: "text", question: "What is your name" },
    {
      id: 2,
      type: "radio",
      question: "Select your color",
      options: ["red", "green"]
    },
    { id: 3, type: "textarea", question: "Tell us about yourself" }
  ];

  // handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value ?? "" });
  };

  // handle form submission
  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:4000/graphql', {
        query: `
          mutation ($input: FormInput!) {
            submitForm(input: $input) {
              id
              name
              color
              aboutYourself
            }
          }
        `,
        variables: {
          input: formData,
        },
      });

      const resultData = response.data.data.submitForm;
      setResponseData(resultData);
      setShowForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  // handle Next button click
  const handleNext = async () => {
      if (step < questions.length) {
        setStep(step + 1);
      } else {
        await handleSubmit();
      }
  };

  return (
    <div style={styles.container}>
      {showForm && step <= questions?.length ? (
        <div style={styles.formSection}>
          <p style={styles.question}>{questions[step - 1].question}</p>
          {questions[step - 1].type === "text" && (
            <input
              style={styles.input}
              placeholder="Enter name"
              name="name"
              type="text"
              value={formData.name ?? ''}
              onChange={handleChange}
            />
          )}

          {questions[step - 1].type === "radio" && (
            <>
              {questions[step - 1].options.map((option, index) => (
                <label key={index} style={styles.radioLabel}>
                  <input
                    name="color"
                    type="radio"
                    value={option}
                    checked={formData.color === option}
                    onChange={handleChange}
                  />
                  {option}
                </label>
              ))}
            </>
          )}

          {questions[step - 1].type === "textarea" && (
            <textarea
              style={styles.textarea}
              placeholder="Enter something"
              name="aboutYourself"
              value={formData.aboutYourself ?? ''}
              onChange={handleChange}
            />
          )}
          <button style={styles.button} onClick={handleNext}>Next</button>
        </div>
      ) : (
        <div style={styles.formSection}>
          {/* To use the nullish coalescing operator (??) to provide default values for undefined or null values in your code, you can modify the code as follows: */}
          <p style={styles.result}>Name: {responseData.name ?? ""}</p>
          <p style={styles.result}>Color: {responseData.color ?? ""}</p>
          <p style={styles.result}>About Yourself: {responseData.aboutYourself ?? ""}</p>
          <p style={styles.submitted}>Form submitted</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f0f0f0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  },
  formSection: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "5px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
    width: "400px",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
    textAlign: "center",
  },
  question: {
    fontSize: "18px",
    marginBottom: "10px",
  },
  input: {
    width: "100%",
    padding: "5px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  radioLabel: {
    display: "block",
    marginBottom: "5px",
  },
  textarea: {
    width: "100%",
    padding: "5px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  result: {
    fontSize: "18px",
    marginBottom: "10px",
  },
  submitted: {
    fontSize: "18px",
    marginBottom: "10px",
    color: "green",
    fontWeight: "bold",
    textAlign: "center",
  },
};