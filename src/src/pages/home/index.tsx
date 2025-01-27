import React, { useState, useRef } from "react";
import styled from "styled-components";

const generateRandomNumber = (): string => {
  return Math.floor(10000 + Math.random() * 90000).toString(); // Gera um número aleatório de 5 dígitos
};

let targetNumber: string = generateRandomNumber(); // Número alvo aleatório

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
`;

const LetterInput = styled.input`
  width: 40px;
  height: 40px;
  font-size: 1.5rem;
  text-align: center;
  border: 2px solid #ccc;
  border-radius: 5px;
  outline: none;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  margin-top: 20px;
  font-size: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const WordContainer = styled.div`
  display: flex;
  margin: 10px 0;
`;

const LetterBox = styled.div<{ bgColor: string }>`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 5px;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  background-color: ${(props) => props.bgColor || "#ccc"};
  border-radius: 5px;
`;

const App: React.FC = () => {
  const [guess, setGuess] = useState<string[]>(Array(targetNumber.length).fill(""));
  const [attempts, setAttempts] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) { // Permite apenas números
      const newGuess = [...guess];
      newGuess[index] = value;
      setGuess(newGuess);

      if (value && index < targetNumber.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!guess[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleSubmit = () => {
    const number = guess.join("");
    if (number.length === targetNumber.length && !attempts.includes(number)) {
      const newAttempts = [...attempts, number];
      setAttempts(newAttempts);
      setGuess(Array(targetNumber.length).fill(""));
      inputRefs.current[0]?.focus();

      if (newAttempts.length >= 6) {
        setGameOver(true);
        setTimeout(() => {
          targetNumber = generateRandomNumber();
          setAttempts([]);
          setGameOver(false);
          setGuess(Array(targetNumber.length).fill(""));
        }, 3000);
      }
    }
  };

  const getLetterColor = (digit: string, index: number): string => {
    if (targetNumber[index] === digit) {
      return "#6aaa64"; // Verde: dígito e posição corretos
    } else if (targetNumber.includes(digit)) {
      return "#c9b458"; // Amarelo: dígito correto, posição errada
    } else {
      return "#787c7e"; // Cinza: dígito incorreto
    }
  };

  return (
    <AppContainer>
      <InputContainer>
        {guess.map((digit, index) => (
          <LetterInput
            key={index}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            ref={(el) => (inputRefs.current[index] = el)}
            disabled={gameOver}
          />
        ))}
      </InputContainer>
      <SubmitButton onClick={handleSubmit} disabled={gameOver}>Enviar</SubmitButton>
      {attempts.map((attempt, attemptIndex) => (
        <WordContainer key={attemptIndex}>
          {attempt.split("").map((digit, digitIndex) => (
            <LetterBox
              key={digitIndex}
              bgColor={getLetterColor(digit, digitIndex)}
            >
              {digit}
            </LetterBox>
          ))}
        </WordContainer>
      ))}
    </AppContainer>
  );
};

export default App;
