import logo from './images/ELGUARDS_LOGO-01.svg';
import './App.css';
import { useEffect, useRef, useState } from 'react';
import { Button, Typography, } from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SocialMediaCard from './components/SocialMediaCard';
import SocialMediaCardContainer from './components/SocialMediaCardContainer';
import SpeechToTextInput from './components/SpeechToTextInput';
import { useTranslation } from 'react-i18next';
import TopicPicker from './components/TopicPicker';

// HARDCODED RESULTS - FOR TESTING ONLY
const msgObj = {
  facebook: { content: "🚨 Stay vigilant! 🚨 Attackers are using social engineering techniques to commit various types of fraud, including phone, credit card, finance, and government document fraud. Protect your identity and personal information! #CyberSecurity #FraudPrevention" },
  instagram: { content: "🚨 Protect Yourself from Fraud! 🚨 Attackers exploit social engineering to commit various types of fraud. Keep your information safe and stay vigilant! 💪🔒 #FraudPrevention #CyberSecurity" },
  linkedin: { content: "In today's digital world, awareness is your best defense against fraud. Attackers are utilizing social engineering techniques to carry out phone, credit card, finance, and government document fraud. Understanding these threats is crucial for protecting your identity. Let's champion security together! #CyberSecurity #FraudPrevention" },
  twitter: { content: "🚨 Beware of social engineering! 🚨 Fraudsters might open accounts or run up charges using your information. Stay protected! #CyberSecurity #FraudPrevention" },
  suggestedImageContent: "An infographic illustrating the types of fraud associated with social engineering, featuring icons for phone fraud, credit card fraud, bank fraud, and government document fraud."
}

function App() {
  const { t, i18n } = useTranslation();
  const [resultData, setResultData] = useState(msgObj);
  const handleDataFromChild = (data) => {
    setResultData(data);
  }

  const [isLoading, setIsLoading] = useState(false);
  const handleIsLoading = (isLoading) => {
    handlePageNum(3);
    setIsLoading(isLoading);
  }

  const [isShowingInput, setIsShowingInput] = useState(false);
  const handleIsShowingInput = () => {
    setIsShowingInput(true);
  }

  const handleIsShowingResultCards = (isShowingResultCards) => {
    if (isShowingResultCards) setPageNum(3);
  }

  const [isShowingTopicSelects, setIsShowingTopicSelects] = useState(false);
  const handleIsShowingTopicSelects = (isShowingTopicSelects) => {
    setIsShowingTopicSelects(isShowingTopicSelects);
  }

  const [pageNum, setPageNum] = useState(0); //0 = welcome, language select | 1 = pick topic / input topic | 2 = (if input topic) input/record topic | 3 = result cards
  const handlePageNum = (num) => {
    setLastPageNum(pageNum);
    setPageNum(num);
  }
  const [lastPageNum, setLastPageNum] = useState(0);
  const previousPage = () => {
    const tmp = pageNum;
    setPageNum(lastPageNum);
    setLastPageNum(tmp);
  }

  // Reference to the input section for scrolling
  const inputSectionRef = useRef(null);


  const handleStartNowBtn = () => {
    handlePageNum(2);
  };

  const handlePickTopicBtn = () => {
    handlePageNum(1);
  };

  // Scroll to the input section if it's visible
  useEffect(() => {
    if (isShowingInput && inputSectionRef.current) {
      inputSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isShowingInput]);

  const [language, setLanguage] = useState('en'); // 'en' for English, 'ar' for Arabic
  const [dir, setDir] = useState('ltr'); // 'en' for English, 'ar' for Arabic
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setDir(lang === 'ar' ? "rtl" : "ltr");
    i18n.changeLanguage(lang);
  }

  return (
    <div className="App">
      {pageNum === 0 && <section className='cover-page'>
        <img src={logo} alt="ELGUARDS Logo" width="400em" />
        <Typography gutterBottom variant='h3'>{t('Speech 2 Post')}</Typography>
        <div className='cover-page-language'>
          <Button color='secondary' className='cover-page-language-box' variant='contained' disabled={language === 'en'} onClick={() => handleLanguageChange("en")} sx={{
            marginTop: '1em',
            marginBottom: '1em',
          }}>
            <p style={{ fontSize: "2em" }}>English</p>
          </Button>
          <SwapHorizIcon sx={{ fontSize: "3em" }} />
          <Button color='secondary' className='cover-page-language-box' variant='contained' disabled={language === 'ar'} onClick={() => handleLanguageChange("ar")} sx={{
            marginTop: '1em',
            marginBottom: '1em',
          }}>
            <p style={{ fontSize: "2em" }}>عربي</p>
          </Button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", marginTop: "1em" }}>
          <Button
            size="small"
            variant="contained"
            dir={dir}
            sx={{ width: "10em", height: "5em", }}
            onClick={handleStartNowBtn}
          >
            <p style={{ fontSize: "1.5em" }}>{t('Start Now!')}</p>
          </Button>
          <Button
            size="small"
            variant='text'
            dir={dir}
            sx={{ width: "10em", height: "5em", }}
            onClick={handlePickTopicBtn}
          >
            <p style={{ fontSize: "1em" }}>{t('I prefer to pick a topic')}</p>
          </Button>
        </div>

      </section>
      }

      {pageNum === 1 && <section className='selects-page'><Button onClick={previousPage}>Back</Button><TopicPicker onSendData={handleDataFromChild} onIsLoading={handleIsLoading} /></section>}

      {pageNum === 2 && <section className='input-page' ref={inputSectionRef}><Button onClick={previousPage}>Back</Button><SpeechToTextInput t={t} lang={language} dir={dir} onSendData={handleDataFromChild} onIsLoading={handleIsLoading} onIsShowingResultCards={handleIsShowingResultCards} /></section>}

      {pageNum === 3 &&
        (isLoading || !resultData ?
          <div className='cards-page'>
            <SocialMediaCardContainer>
              <SocialMediaCard title="Facebook" isLoading={isLoading} dir={dir} t={t} />
              <SocialMediaCard title="X (formerly Twitter)" isLoading={isLoading} dir={dir} t={t} />
              <SocialMediaCard title="LinkedIn" isLoading={isLoading} dir={dir} t={t} />
              <SocialMediaCard title="Instagram" isLoading={isLoading} dir={dir} t={t} />
            </SocialMediaCardContainer>
          </div>
          :
          <div className='cards-page'>
            <Button onClick={previousPage}>Back</Button>
            <SocialMediaCardContainer>
              <SocialMediaCard title="Facebook" content={resultData.facebook?.content || 'No content available'} isLoading={isLoading} dir={dir} t={t} />
              <SocialMediaCard title="X (formerly Twitter)" content={resultData.twitter?.content || 'No content available'} isLoading={isLoading} dir={dir} t={t} />
              <SocialMediaCard title="LinkedIn" content={resultData.linkedin?.content || 'No content available'} isLoading={isLoading} dir={dir} t={t} />
              <SocialMediaCard title="Instagram" content={resultData.instagram?.content || 'No content available'} isLoading={isLoading} dir={dir} t={t} />
              {/* <pre>{JSON.stringify(optimizedResult, null, 2)}</pre> */}
            </SocialMediaCardContainer>
          </div>)}
    </div>
  );
}

export default App;
