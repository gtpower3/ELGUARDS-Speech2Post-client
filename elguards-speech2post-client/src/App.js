import logo from './images/ELGUARDS_LOGO-01.svg';
import './App.css';
import { useEffect, useRef, useState } from 'react';
import { Button, Typography, } from '@mui/material';
import SocialMediaCard from './components/SocialMediaCard';
import SocialMediaCardContainer from './components/SocialMediaCardContainer';
import SpeechToTextInput from './components/SpeechToTextInput';


const msgObj = {
  facebook: { content: "🚨 Stay vigilant! 🚨 Attackers are using social engineering techniques to commit various types of fraud, including phone, credit card, finance, and government document fraud. Protect your identity and personal information! #CyberSecurity #FraudPrevention" },
  instagram: { content: "🚨 Protect Yourself from Fraud! 🚨 Attackers exploit social engineering to commit various types of fraud. Keep your information safe and stay vigilant! 💪🔒 #FraudPrevention #CyberSecurity" },
  linkedin: { content: "In today's digital world, awareness is your best defense against fraud. Attackers are utilizing social engineering techniques to carry out phone, credit card, finance, and government document fraud. Understanding these threats is crucial for protecting your identity. Let's champion security together! #CyberSecurity #FraudPrevention" },
  twitter: { content: "🚨 Beware of social engineering! 🚨 Fraudsters might open accounts or run up charges using your information. Stay protected! #CyberSecurity #FraudPrevention" },
  suggestedImageContent: "An infographic illustrating the types of fraud associated with social engineering, featuring icons for phone fraud, credit card fraud, bank fraud, and government document fraud."
}

function App() {

  const [scrollingDown, setScrollingDown] = useState(false);
  const [resultData, setResultData] = useState(msgObj);
  const handleDataFromChild = (data) => {
    setResultData(data);
  }

  const [isLoading, setIsLoading] = useState(false);
  const handleIsLoading = (isLoading) => {
    setIsLoading(isLoading);
  }

  const [isShowingInput, setIsShowingInput] = useState(false);
  const handleIsShowingInput = () => {
    setIsShowingInput(true);
  }

  const [isShowingResultCards, setIsShowingResultCards] = useState(false);
  const handleIsShowingResultCards = (isShowingResultCards) => {
    setIsShowingResultCards(isShowingResultCards);
  }

  // Reference to the input section for scrolling
  const inputSectionRef = useRef(null);

  // Handle button click
  const handleButtonClick = () => {
    setIsShowingInput(true); // Show the input section when the button is clicked
  };

  // Scroll to the input section if it's visible
  useEffect(() => {
    if (isShowingInput && inputSectionRef.current) {
      inputSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isShowingInput]);

  // const submitVoiceData = async (text) => {
  //   // return;
  //   setisShowingResultCards(true);
  //   setIsLoading(true);
  //   try {
  //     const res = await axios.post('http://localhost:3030/api/optimize', { content: text });
  //     console.log(res.status === 200 ? "Success!" : "Failed");
  //     const resObj = res.data;
  //     setResultData(resObj);
  //     console.log(resObj)
  //   } catch (error) {
  //     console.error(error);
  //   }
  //   finally {
  //     setIsLoading(false); // Stop loading indicator
  //   }
  // }

  return (
    <div className="App">
      {!isShowingInput && <section className='cover-page'>
        <img src={logo} alt="ELGUARDS Logo" width="400em" />
        <Typography gutterBottom variant='h3'>Speech2Post</Typography>
        <Button
          size="small"
          variant="contained"
          sx={{ width: "10em", height: "5em" }}
          onClick={handleButtonClick}
        >
          Start now!
        </Button>
      </section>}

      {isShowingInput && <section className='input-page' ref={inputSectionRef}><SpeechToTextInput onSendData={handleDataFromChild} onIsLoading={handleIsLoading} onIsShowingResultCards={handleIsShowingResultCards} /></section>}



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
      </SocialMediaCardContainer> */}
      {
        // (!resultData ? <SocialMediaCardContainer>
        //     <SocialMediaCard title="Facebook" isLoading={isLoading} />
        //     <SocialMediaCard title="X (formerly Twitter)" isLoading={isLoading} />
        //     <SocialMediaCard title="LinkedIn" isLoading={isLoading} />
        //     <SocialMediaCard title="Instagram" isLoading={isLoading} />
        //   </SocialMediaCardContainer>
        //     :
        //     <SocialMediaCardContainer>
        //       <SocialMediaCard title="Facebook" content={resultData.facebook?.content || 'No content available'} isLoading={isLoading} />
        //       <SocialMediaCard title="X (formerly Twitter)" content={resultData.twitter?.content || 'No content available'} isLoading={isLoading} />
        //       <SocialMediaCard title="LinkedIn" content={resultData.linkedin?.content || 'No content available'} isLoading={isLoading} />
        //       <SocialMediaCard title="Instagram" content={resultData.instagram?.content || 'No content available'} isLoading={isLoading} />
        //       {/* <pre>{JSON.stringify(optimizedResult, null, 2)}</pre> */}
        //     </SocialMediaCardContainer>)
      }
      {
        isShowingResultCards &&
        (isLoading || !resultData ?
          <div style={{ width: "100%" }}>
            <SocialMediaCardContainer>
              <SocialMediaCard title="Facebook" isLoading={isLoading} />
              <SocialMediaCard title="X (formerly Twitter)" isLoading={isLoading} />
              <SocialMediaCard title="LinkedIn" isLoading={isLoading} />
              <SocialMediaCard title="Instagram" isLoading={isLoading} />
            </SocialMediaCardContainer>
          </div>
          :
          <div style={{ width: "100%" }}>
            <SocialMediaCardContainer>
              <SocialMediaCard title="Facebook" content={resultData.facebook?.content || 'No content available'} isLoading={isLoading} />
              <SocialMediaCard title="X (formerly Twitter)" content={resultData.twitter?.content || 'No content available'} isLoading={isLoading} />
              <SocialMediaCard title="LinkedIn" content={resultData.linkedin?.content || 'No content available'} isLoading={isLoading} />
              <SocialMediaCard title="Instagram" content={resultData.instagram?.content || 'No content available'} isLoading={isLoading} />
              {/* <pre>{JSON.stringify(optimizedResult, null, 2)}</pre> */}
            </SocialMediaCardContainer>
          </div>)
      }
    </div>
  );
}

export default App;
