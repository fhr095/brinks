import React, { useState, useEffect, useRef } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import './App.css';

function App() {
  const [attempts, setAttempts] = useState(0);
  const [proposalAccepted, setProposalAccepted] = useState(false);
  const [swapButtons, setSwapButtons] = useState(false);
  const noButtonRef = useRef(null);
  const yesButtonRef = useRef(null);

  // Tamanho da tela (viewport)
  const { width, height } = useWindowSize();

  // Posição do botão "Não"
  const [noPosition, setNoPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    // Ao montar o componente, posicionar o botão "Não" aleatoriamente
    // Isso garante que ele não comece ao lado do "Sim" de forma normal.
    positionNoButtonRandomly();
    // Ajustar a posição caso a janela seja redimensionada
    window.addEventListener('resize', positionNoButtonRandomly);
    return () => window.removeEventListener('resize', positionNoButtonRandomly);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNoClick = () => {
    if (attempts < 2) {
      setAttempts(prev => prev + 1);
      positionNoButtonRandomly();
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
      // Agora o "Sim" é o antigo "Não" após a troca
      alert('Agora você aceitou! 💍');
    }
  };

  const positionNoButtonRandomly = () => {
    const noButton = noButtonRef.current;
    const yesButton = yesButtonRef.current;

    if (noButton && yesButton && width > 0 && height > 0) {
      const buttonWidth = noButton.offsetWidth;
      const buttonHeight = noButton.offsetHeight;
      const yesRect = yesButton.getBoundingClientRect();

      const margin = 20;
      
      // Dimensões visíveis da tela
      const maxLeft = width - buttonWidth - margin;
      const maxTop = height - buttonHeight - margin;

      let newLeft, newTop;
      let overlap = true;
      let attemptsMove = 0;

      while (overlap && attemptsMove < 200) {
        // Escolhe posição aleatória na tela, dentro dos limites
        newLeft = Math.floor(Math.random() * (maxLeft - margin)) + margin;
        newTop = Math.floor(Math.random() * (maxTop - margin)) + margin;

        // Dimensão do "Não"
        const noRect = {
          top: newTop,
          left: newLeft,
          right: newLeft + buttonWidth,
          bottom: newTop + buttonHeight,
        };

        // Verifica se sobrepõe o "Sim"
        overlap = !(noRect.right < yesRect.left ||
                    noRect.left > yesRect.right ||
                    noRect.bottom < yesRect.top ||
                    noRect.top > yesRect.bottom);

        attemptsMove++;
      }

      setNoPosition({ top: newTop, left: newLeft });
    }
  };

  return (
    <div className="container">
      {proposalAccepted && <Confetti width={width} height={height} />}
      <h1>Quer se casar comigo?</h1>
      <div className="buttons-area">
        {/* Botão Sim/Não fixo no centro da área */}
        <button
          className={`yes-button ${proposalAccepted && swapButtons ? 'final-no' : ''}`}
          onClick={handleYesClick}
          disabled={proposalAccepted && swapButtons}
          ref={yesButtonRef}
        >
          {proposalAccepted && swapButtons ? 'Não' : 'Sim'}
        </button>
      </div>
      <button
        className={`no-button ${proposalAccepted && swapButtons ? 'final-yes' : ''}`}
        onClick={handleNoClick}
        disabled={proposalAccepted}
        style={{
          position: 'absolute',
          top: noPosition.top,
          left: noPosition.left,
        }}
        ref={noButtonRef}
      >
        {proposalAccepted && swapButtons ? 'Sim' : 'Não'}
      </button>
      {proposalAccepted && (
        <p>
          Um email contendo a solicitação de aceite foi enviado para o senhor Felipe Henrique. f******095@gmail.com
        </p>
      )}
    </div>
  );
}

export default App;
