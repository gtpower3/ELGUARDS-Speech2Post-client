import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import axios from 'axios'

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box, Button, CardActions, TextField } from '@mui/material';
import SocialMediaCard from './components/SocialMediaCard';
import SocialMediaCardContainer from './components/SocialMediaCardContainer';


const msgObj = {
  facebook: { content: "🚨 Stay vigilant! 🚨 Attackers are using social engineering techniques to commit various types of fraud, including phone, credit card, finance, and government document fraud. Protect your identity and personal information! #CyberSecurity #FraudPrevention" },
  instagram: { content: "🚨 Protect Yourself from Fraud! 🚨 Attackers exploit social engineering to commit various types of fraud. Keep your information safe and stay vigilant! 💪🔒 #FraudPrevention #CyberSecurity" },
  linkedin: { content: "In today's digital world, awareness is your best defense against fraud. Attackers are utilizing social engineering techniques to carry out phone, credit card, finance, and government document fraud. Understanding these threats is crucial for protecting your identity. Let's champion security together! #CyberSecurity #FraudPrevention" },
  twitter: { content: "🚨 Beware of social engineering! 🚨 Fraudsters might open accounts or run up charges using your information. Stay protected! #CyberSecurity #FraudPrevention" },
  suggestedImageContent: "An infographic illustrating the types of fraud associated with social engineering, featuring icons for phone fraud, credit card fraud, bank fraud, and government document fraud."
}

function App() {
  const [promptText, setPromptText] = useState('');
  const [isAwaitOptimizedResult, setisAwaitOptimizedResult] = useState(false);
  const [isShowingResultCards, setisShowingResultCards] = useState(false);
  const [optimizedResult, setOptimizedResult] = useState(null);

  const submitVoiceData = async (text) => {
    // return;
    setisShowingResultCards(true);
    setisAwaitOptimizedResult(true);
    try {
      const res = await axios.post('http://localhost:3030/api/optimize', { content: text });
      console.log(res.status === 200 ? "Success!" : "Failed");
      const resObj = res.data;
      setOptimizedResult(resObj);
      console.log(resObj)
    } catch (error) {
      console.error(error);
    }
    finally {
      setisAwaitOptimizedResult(false); // Stop loading indicator
    }
  }

  return (
    <div className="App">
      <div className='input-container'>
        <h1>Speech 2 Post</h1>
        <TextField
          id="prompt-input"
          label="TESTING - Enter prompt here"
          multiline
          rows={10}
          onChange={e => setPromptText(e.target.value)}
          sx={{ width: '100%' }}
        />
        <Button variant="contained" onClick={() => submitVoiceData(promptText)}>Submit</Button>
      </div>

      {/* <pre>{msgObj.facebook.content}</pre>
      <pre>{msgObj.twitter.content}</pre>
      <pre>{msgObj.linkedin.content}</pre>
      <pre>{msgObj.instagram.content}</pre>
      <pre>{msgObj.suggestedImageContent}</pre> */}
      {/* <SocialMediaCardContainer>
        <SocialMediaCard title="Facebook" content={msgObj.facebook.content} isLoading={false} />
        <SocialMediaCard title="X (formerly Twitter)" content={msgObj.twitter.content} isLoading={false} />
        <SocialMediaCard title="LinkedIn" content={msgObj.linkedin.content} isLoading={false} />
        <SocialMediaCard title="Instagram" content={msgObj.instagram.content} isLoading={false} />
        <SocialMediaCard />
      </SocialMediaCardContainer> */}
      {isShowingResultCards &&
        (isAwaitOptimizedResult || !optimizedResult ? <SocialMediaCardContainer>
          <SocialMediaCard title="Facebook" isLoading={isAwaitOptimizedResult} />
          <SocialMediaCard title="X (formerly Twitter)" isLoading={isAwaitOptimizedResult} />
          <SocialMediaCard title="LinkedIn" isLoading={isAwaitOptimizedResult} />
          <SocialMediaCard title="Instagram" isLoading={isAwaitOptimizedResult} />
        </SocialMediaCardContainer>
          :
          <SocialMediaCardContainer>
            <SocialMediaCard title="Facebook" content={optimizedResult.facebook?.content || 'No content available'} isLoading={isAwaitOptimizedResult} />
            <SocialMediaCard title="X (formerly Twitter)" content={optimizedResult.twitter?.content || 'No content available'} isLoading={isAwaitOptimizedResult} />
            <SocialMediaCard title="LinkedIn" content={optimizedResult.linkedin?.content || 'No content available'} isLoading={isAwaitOptimizedResult} />
            <SocialMediaCard title="Instagram" content={optimizedResult.instagram?.content || 'No content available'} isLoading={isAwaitOptimizedResult} />
            {/* <pre>{JSON.stringify(optimizedResult, null, 2)}</pre> */}
          </SocialMediaCardContainer>)
      }
    </div>
  );
}

export default App;
