// src/components/BotMessages.jsx
import React from 'react';

const BotMessages = {
  welcomeMessages: [
    "Hi there! I'm CareView, your symptom checker developed by trusted healthcare professionals. Type 'start' to begin or 'help' for more info.",
    "Hello! Welcome to CareView, your trusted symptom checker. Type 'start' to get going or 'help' for guidance.",
    "Greetings! I'm CareView, here to help you understand your symptoms. Type 'start' to proceed or 'help' for details.",
    "Hey! CareView here, built by healthcare pros to assist you. Type 'start' to dive in or 'help' for more info.",
  ],
  helpMessages: [
    "I'm CareView, developed by trusted healthcare professionals to help you understand your symptoms. I'll guide you step-by-step to enter your details. Type 'start' to begin, use the dropdowns to select options, or type your answers. You can type 'done' for symptoms or 'none' for optional fields like risk factors or travel.",
    "CareView is your go-to symptom checker, crafted by healthcare experts. I'll walk you through each step. Type 'start' to begin, select options from dropdowns, or type answers. Use 'done' for symptoms or 'none' for optional fields.",
    "Welcome to CareView, created by medical professionals. I'll guide you through entering your details. Type 'start' to begin, choose from dropdowns, or type your answers. Use 'done' for symptoms or 'none' for optional fields like travel or risk factors.",
  ],
  invalidWelcomeMessages: [
    "Hmm, please type 'start' to begin or 'help' for more info.",
    "Oops, I didn't catch that. Type 'start' to proceed or 'help' for assistance.",
    "Not sure what you meant. Please type 'start' to begin or 'help' for guidance.",
  ],
  symptomPrompts: [
    "Got it! Any more symptoms? (You need at least two. Type 'done' when ready.)",
    "Alright, noted! Want to add more symptoms? (Need at least two, type 'done' when finished.)",
    "Thanks for that! Any other symptoms to include? (Two minimum, type 'done' to move on.)",
    "Received! Got more symptoms to share? (At least two required, type 'done' when ready.)",
    "Understood! Any additional symptoms? (You need two or more, type 'done' when done.)",
  ],
  stepPrompts: {
    age: [
      "Let's start with your age. How old are you? (Enter a number between 1 and 120)",
      "First up, what's your age? (Please enter a number from 1 to 120)",
      "To begin, tell me your age. (Enter a number between 1 and 120)",
    ],
    gender: [
      "What is your gender? Please select or type: Male, Female, or Other.",
      "Next, what's your gender? Choose or type: Male, Female, or Other.",
      "Please tell me your gender. Select or type: Male, Female, or Other.",
    ],
    symptoms: [
      "Now, tell me about your symptoms. Type to search and select at least two. When you're done, type 'done'.",
      "Let's hear about your symptoms. Type to search, pick at least two, and type 'done' when ready.",
      "Time to list your symptoms. Search and select at least two, then type 'done' to continue.",
    ],
    duration: [
      "How long have you been experiencing these symptoms? (Enter a number, e.g., 3)",
      "How long have these symptoms been going on? (Enter a number like 3)",
      "What's the duration of your symptoms? (Provide a number, e.g., 3)",
    ],
    durationUnit: [
      "Is that in Days, Weeks, or Months? Please select or type one.",
      "Are those in Days, Weeks, or Months? Choose or type one.",
      "In Days, Weeks, or Months? Select or type your answer.",
    ],
    severity: [
      "How severe are your symptoms? Please select or type: Mild, Moderate, or Severe.",
      "What's the severity of your symptoms? Choose or type: Mild, Moderate, or Severe.",
      "How bad are your symptoms? Select or type: Mild, Moderate, or Severe.",
    ],
    travelRegion: [
      "Have you traveled recently? Select a region or 'None' if you haven't.",
      "Any recent travel? Choose a region or 'None' if not.",
      "Have you been traveling? Pick a region or 'None' if you haven't.",
    ],
    riskFactors: [
      "Any risk factors to note? Select any that apply or type 'none' to skip.",
      "Got any risk factors? Choose any that apply or type 'none' to skip.",
      "Any relevant risk factors? Select them or type 'none' to move on.",
    ],
    drugHistory: [
      "What about your medication history? Please select or type an option.",
      "Tell me about your medication history. Choose or type an option.",
      "Any medication history to share? Select or type an option.",
    ],
    submit: [
      "All set! I'm analyzing your information now...",
      "Everything's ready! Analyzing your data now...",
      "Got all the info! Processing your symptoms now...",
    ],
  },

  getWelcomeMessage: () => {
    return BotMessages.welcomeMessages[Math.floor(Math.random() * BotMessages.welcomeMessages.length)];
  },

  getHelpMessage: () => {
    return BotMessages.helpMessages[Math.floor(Math.random() * BotMessages.helpMessages.length)];
  },

  getInvalidWelcomeMessage: () => {
    return BotMessages.invalidWelcomeMessages[Math.floor(Math.random() * BotMessages.invalidWelcomeMessages.length)];
  },

  getSymptomPrompt: () => {
    return BotMessages.symptomPrompts[Math.floor(Math.random() * BotMessages.symptomPrompts.length)];
  },

  getStepPrompt: (step) => {
    const prompts = BotMessages.stepPrompts[step] || [''];
    return prompts[Math.floor(Math.random() * prompts.length)];
  },
};

export default BotMessages;