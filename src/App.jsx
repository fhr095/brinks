import React, { useState, useEffect, useRef } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import './App.css';

function App() {
  const [attempts, setAttempts] = useState(0);
  const [proposalAccepted, setProposalAccepted] = useState(false);
  const [swapButtons, setSwapButtons] = useState(false);
  const [noButtonFreeMode, setNoButtonFreeMode] = useState(false);
  const [messages, setMessages] = useState([]);

  const containerRef = useRef(null);
  const noButtonRef = useRef(null);
  const yesButtonRef = useRef(null);

  const { width, height } = useWindowSize();

  const [positions, setPositions] = useState({
    yes: { top: 0, left: 0 },
    no: { top: 0, left: 0 }
  });

  useEffect(() => {
    positionButtonsInitially();
    if (noButtonFreeMode) {
      positionNoButtonRandomly();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);

  const positionButtonsInitially = () => {
    const container = containerRef.current;
    const yesButton = yesButtonRef.current;
    const noButton = noButtonRef.current;
    if (!container || !yesButton || !noButton) return;

    const containerRect = container.getBoundingClientRect();
    const yesButtonWidth = yesButton.offsetWidth;
    const yesButtonHeight = yesButton.offsetHeight;
    const noButtonWidth = noButton.offsetWidth;

    // Centralizar o botão "Sim"
    const yesTop = (containerRect.height - yesButtonHeight) / 2;
    const yesLeft = (containerRect.width - yesButtonWidth) / 2;

    // Colocar o "Não" ao lado do "Sim"
    const noLeft = yesLeft + yesButtonWidth + 20; 
    const noTop = yesTop; 

    setPositions({
      yes: { top: yesTop, left: yesLeft },
      no: { top: noTop, left: noLeft }
    });
  };

  const handleNoClick = () => {
    if (!noButtonFreeMode) {
      setNoButtonFreeMode(true);
    }

    if (attempts < 2) {
      setAttempts(prev => prev + 1);
      positionNoButtonRandomly();
      showEncouragementMessage();
    } else {
      // Após 3 tentativas, trocar os botões
      setSwapButtons(true);
      setProposalAccepted(true);
    }
  };

  const handleYesClick = () => {
    if (!proposalAccepted) {
      alert('Fico muito feliz! 💍');
    } else {
      alert('Agora você aceitou! 💍');
    }
  };

  const positionNoButtonRandomly = () => {
    const container = containerRef.current;
    const yesButton = yesButtonRef.current;
    const noButton = noButtonRef.current;

    if (!container || !yesButton || !noButton) return;

    const containerRect = container.getBoundingClientRect();
    const yesRect = yesButton.getBoundingClientRect();
    const noWidth = noButton.offsetWidth;
    const noHeight = noButton.offsetHeight;

    const margin = 20;
    const maxLeft = containerRect.width - noWidth - margin;
    const maxTop = containerRect.height - noHeight - margin;

    let newLeft, newTop;
    let overlap = true;
    let attemptsMove = 0;

    while (overlap && attemptsMove < 200) {
      newLeft = Math.floor(Math.random() * (maxLeft - margin)) + margin;
      newTop = Math.floor(Math.random() * (maxTop - margin)) + margin;

      const yesOffsetTop = yesRect.top - containerRect.top;
      const yesOffsetLeft = yesRect.left - containerRect.left;
      const yesWidth = yesRect.width;
      const yesHeight = yesRect.height;

      const noRect = {
        top: newTop,
        left: newLeft,
        right: newLeft + noWidth,
        bottom: newTop + noHeight,
      };

      const yesAdjustedRect = {
        top: yesOffsetTop,
        left: yesOffsetLeft,
        right: yesOffsetLeft + yesWidth,
        bottom: yesOffsetTop + yesHeight
      };

      overlap = !(noRect.right < yesAdjustedRect.left ||
                  noRect.left > yesAdjustedRect.right ||
                  noRect.bottom < yesAdjustedRect.top ||
                  noRect.top > yesAdjustedRect.bottom);

      attemptsMove++;
    }

    // Se não encontrou posição, fallback
    if (overlap) {
      newLeft = margin;
      newTop = margin;
    }

    setPositions(prev => ({
      ...prev,
      no: { top: newTop, left: newLeft }
    }));
  };

  const showEncouragementMessage = () => {
    let newMessage = '';
    if (attempts === 0) {
      newMessage = 'Ops! Parece que você se confundiu, tente de novo!';
    } else if (attempts === 1) {
      newMessage = 'Errou de novo? Última chance! 🤔';
    }

    if (newMessage) {
      setMessages([...messages, newMessage]);
      setTimeout(() => {
        setMessages(prev => prev.slice(1));
      }, 2500);
    }
  };

  return (
    <div className="container" ref={containerRef}>
      {proposalAccepted && <Confetti width={width} height={height} />}
      <h1>Me dá o cu?</h1>
      <p className="subtext">Estou muito feliz em chegar até aqui. Escolha com carinho:</p>
      
      <button
        className={`yes-button ${proposalAccepted && swapButtons ? 'final-no' : ''}`}
        onClick={handleYesClick}
        disabled={proposalAccepted && swapButtons}
        ref={yesButtonRef}
        style={{
          position: 'absolute',
          top: positions.yes.top,
          left: positions.yes.left
        }}
      >
        {proposalAccepted && swapButtons ? 'Não' : 'Sim'}
      </button>
      
      <button
        className={`no-button ${proposalAccepted && swapButtons ? 'final-yes' : ''}`}
        onClick={handleNoClick}
        disabled={proposalAccepted}
        ref={noButtonRef}
        style={{
          position: 'absolute',
          top: positions.no.top,
          left: positions.no.left
        }}
      >
        {proposalAccepted && swapButtons ? 'Sim' : 'Não'}
      </button>

      {proposalAccepted && (
        <p className="final-message">
          Um email contendo a solicitação de aceite foi enviado para o senhor Felipe Henrique. f******095@gmail.com.
          Aguarde-o que ele entrará em contato!
        </p>
      )}
      {messages.length > 0 && (
        <div className="message-overlay">
          <p>{messages[messages.length - 1]}</p>
        </div>
      )}
    </div>
  );
}

export default App;
