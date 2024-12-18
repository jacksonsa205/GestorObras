const svgCaptcha = require('svg-captcha');

const captcha = svgCaptcha.createMathExpr({
    mathOperator: '+',
    mathMin: 1,
    mathMax: 10
});

module.exports = captcha;