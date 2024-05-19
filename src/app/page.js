'use client';

import useSpeechRecognition from "../hooks/useSpeechRecognitionHook"
import styles from './page.module.css';
import { useState, useEffect } from 'react'; 
import { useRouter } from 'next/navigation';  
import { useCompletion } from 'ai/react'; 
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export default function Page() {
  const [inputVal, setInputVal] = useState("");  
  const [chatInputValue, setChatInputValue] = useState("");
  const [questions, setQuestions] = useState([]); // Now using an array to store questions
  const router = useRouter();

  // Handle submission of the question form
  const handleSubmitQuestion = (e) => {
    debugger;
    e.preventDefault();
    if (inputVal.trim()) { // Only add the question if it's not empty
      setQuestions(prevQuestions => [...prevQuestions, inputVal]); // Add the new question to the list
      setInputVal(''); // Clear the input field after setting the question
    }
  };

  const {complete, completion, setInput, input, stop, isLoading} = useCompletion({api: '/api/completion'});

  /**
   * If the completion changes, set the value of our chatbox input to the completion
   */
  useEffect(() => {
    if (completion) {
      setChatInputValue(completion)
    }
  }, [completion])

  const {
    text, 
    startListening, 
    stopListening, 
    isListening, 
    hasRecognitionSupport
} = useSpeechRecognition();

/**
 * If the recognized text changes, set the value of our chatbox input to the recognized text
 */
useEffect(() => {
  if (text) {
    setInput(text)
    complete(text)
  }
}, [text])

  return (
    <div className={styles.main}>
      <form onSubmit={(e) => {
        e.preventDefault();

complete(input)
}} className={styles.chatForm}>
        <div className={styles.chat}>
          <input className={styles.chatbox}
            type="text" 
            value={input} 
            onChange={event => setInput(event.target.value)} 
            placeholder='Submit response'
          />
          <button className={styles.stopbutton} onClick={stop}>
            Stop
          </button>
          <button className={styles.submitbutton} disabled={isLoading} type='submit'>
            {isLoading ? 'Loading..' : 'Send'}
          </button>
        </div>
      </form>
      <output className={styles.output}>
        <span>{completion}</span>
      </output>
      <form onSubmit={handleSubmitQuestion} className={styles.questionForm}>
        <input
          id="question-input"
          type="text"
          placeholder="Type your question..."
          value={inputVal}  
          onChange={(e) => setInputVal(e.target.value)}
        />
      </form>
      <div className={styles.questionList}>
        <h3>Interview Questions</h3>
        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {questions.map((question, index) => (
          <Card key={index} style={{ marginBottom: '10px' }}>
          <CardContent>
            <Typography variant="body1">{question}</Typography>
          </CardContent>
          </Card>
        ))}
        </div>
      </div>
        <div className={styles.center}>
          <img
            className={styles.logo}
            src="/PrepSmartLogo.png"
            alt="PrepSmart Logo"
            width={200}
            height={100}
          />
        </div>
        <div className={styles.container}>
        </div>

        <div>
             {hasRecognitionSupport ? (
                <>
                    <div>
                        <button onClick={startListening}>Start Listening</button>
                    </div>

                    <div>
                        <button onClick={stopListening}>Stop Listening</button>
                    </div>

                    {isListening ? (<div>Your browser is currently listening</div>) : null}
                    {text}
                </>
            ) : (
                <h1>Your browser has no speech recognition support</h1>
            )}
        </div>
    </div>  
  );
}
