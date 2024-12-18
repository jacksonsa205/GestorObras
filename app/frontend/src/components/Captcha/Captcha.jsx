import React, { useState, useEffect, useRef } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const generateMathCaptcha = () => {
  const min = 1;
  const max = 10;
  const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
  const num2 = Math.floor(Math.random() * (max - min + 1)) + min;
  return {
    expression: `${num1} + ${num2}`,
    answer: num1 + num2,
  };
};

const CaptchaComponent = ({ onValidate }) => {
  const [captcha, setCaptcha] = useState(generateMathCaptcha());
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const svgRef = useRef(null);

  useEffect(() => {
    if (svgRef.current) {
      svgRef.current.innerHTML = ''; // Clear previous SVG content
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '100');
      svg.setAttribute('height', '50');
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', '10');
      text.setAttribute('y', '30');
      text.setAttribute('font-size', '20');
      text.setAttribute('fill', 'black');
      text.textContent = captcha.expression;
      svg.appendChild(text);
      svgRef.current.appendChild(svg);
    }
  }, [captcha]);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseInt(input) === captcha.answer) {
      setResult('Correto!');
      onValidate(true);
    } else {
      setResult('Incorreto, por favor tente novamente.');
      onValidate(false);
    }
  };

  const reloadCaptcha = () => {
    setCaptcha(generateMathCaptcha());
    setInput('');
    setResult(null);
  };

  return (
    <div className="captcha-container">
      <div ref={svgRef}></div>
      <div className="captcha-input">
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <FaPlus className="icon" />
            <input
              type="text"
              maxLength={2}
              value={input}
              onChange={handleChange}
              placeholder="Somar os valores"
            />
          </div>
          <button className="button-login" type="submit">Próximo</button>
        </form>
        <div className="input-container">
          {result && <p>{result}</p>}
        </div>

        <div className="captcha-links">
          <Link to="#" onClick={reloadCaptcha}>Atualizar Captcha</Link>
        </div>
      </div>
    </div>
  );
};

export default CaptchaComponent;