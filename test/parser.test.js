import parser from '../src/math/parser'
import { math } from '../src/math/math'
import Decimal from 'decimal.js'

describe('Parser interface', () => {
  const p = parser()

  test('Parser has a "parse" method', () => {
    expect(p).toHaveProperty('parse')
    expect(typeof p.parse).toBe('function')
  })
})

describe('Parsing', () => {
  const p = parser()

  test('Parser parses a hole', () => {
    const e = p.parse('?')
    expect(e.toString()).toEqual('?')
    expect(e.isHole()).toBeTruthy()
  })

  test('Parser parses an integer', () => {
    const e = p.parse('123')
    expect(e.string).toEqual('123')
    expect(e.input).toEqual('123')
    expect(e.isInt()).toBeTruthy()
  })

  test('Parser parses a number whith coma', () => {
    const e = p.parse('123,45')
    expect(e.string).toEqual('123.45')
    expect(e.input).toEqual('123,45')
    expect(e.isNumber()).toBeTruthy()
  })

  test('Parser parses a number whith point', () => {
    const e = p.parse('123.45')
    expect(e.string).toEqual('123.45')
    expect(e.input).toEqual('123.45')
    expect(e.isNumber()).toBeTruthy()
  })

  test('Parser parses an integer whith leading 0', () => {
    const e = p.parse('00123')
    expect(e.string).toEqual('123')
    expect(e.input).toEqual('00123')
    expect(e.isNumber()).toBeTruthy()
  })

  test('Parser parses a decimal whith leading 0', () => {
    const e = p.parse('00123,445')
    expect(e.string).toEqual('123.445')
    expect(e.input).toEqual('00123,445')
    expect(e.isNumber()).toBeTruthy()
  })

  test('Parser parses a decimal whith trailing 0', () => {
    const e = p.parse('123,44500')
    expect(e.input).toEqual('123,44500')
    expect(e.string).toEqual('123.445')
    expect(e.isNumber()).toBeTruthy()
  })

  test('Parser parses a decimal number with"," and output the comma', () => {
    const e = p.parse('123,45')
    expect(e.toString({ comma: true })).toEqual('123,45')
    expect(e.isNumber()).toBeTruthy()
  })

  test('Parser parses number with spaces', () => {
    let e = p.parse('3 9 8 9')
    expect(e.string).toEqual('3989')
    expect(e.input).toEqual('3 9 8 9')
  })

  test('Parser parses expressions with spaces', () => {
    let e = p.parse('3 + 7')
    expect(e.string).toEqual('3+7')
    // expect(e.input).toEqual('3 + 7')
  })
  
  test('Parser parses a decimal whith spaces', () => {
    const e = p.parse('  1 23  ,4 45 0 0 ')
    expect(e.input).toEqual('1 23  ,4 45 0 0')
    expect(e.string).toEqual('123.445')
    expect(e.isNumber()).toBeTruthy()
  })

  test('Parser parses a segment length', () => {
    const e = p.parse('AB')
    expect(e.toString()).toEqual('AB')
    expect(e.isSegmentLength()).toBeTruthy()
  })

  test('Parser parses a symbol', () => {
    const e = p.parse('a')
    expect(e.toString()).toEqual('a')
    expect(e.isSymbol()).toBeTruthy()
  })

  test('Parser parses a negative number', () => {
    const e = p.parse('-1')
    expect(e.toString()).toEqual('-1')
    expect(e.isOpposite()).toBeTruthy()
  })

  test('Parser parses a positive number', () => {
    const e = p.parse('+1')
    expect(e.toString()).toEqual('+1')
    expect(e.isPositive()).toBeTruthy()
  })

  // test('Parser parses multiple signs', () => {
  //   const e = p.parse('+-++-----1')
  //   expect(e.toString()).toEqual('+-++-----1')
  //   expect(e.isPositive()).toBeTruthy()
  // })

  test('Parser parses a bracket', () => {
    const e = p.parse('(3)')
    expect(e.toString()).toEqual('(3)')
    expect(e.isBracket()).toBeTruthy()
  })

  test.skip('Parser parses a radical', () => {
    const e = p.parse('sqrt(25)')
    expect(e.toString()).toEqual('sqrt(25)')
    expect(e.isRadical()).toBeTruthy()
  })

  test('Parser parses an addition', () => {
    const e = p.parse('1+1')
    expect(e.toString()).toEqual('1+1')
    expect(e.isSum()).toBeTruthy()
  })

  // test('Parser parses an addition', () => {
  //   const e = p.parse('1+-1')
  //   expect(e.toString()).toEqual('1+-1')
  //   expect(e.isSum()).toBeTruthy()
  // })

  test('Parser parses a difference', () => {
    const e = p.parse('1-1')
    expect(e.toString()).toEqual('1-1')
    expect(e.isDifference()).toBeTruthy()
  })
  // test('Parser parses a difference', () => {
  //   const e = p.parse('+1-+1')
  //   expect(e.toString()).toEqual('+1-+1')
  //   expect(e.isDifference()).toBeTruthy()
  // })

  test('Parser parses a product', () => {
    const e = p.parse('1*1')
    expect(e.toString()).toEqual('1*1')
    expect(e.isProduct()).toBeTruthy()
  })

  // test('Parser parses a product', () => {
  //   const e = p.parse('-1*+1')
  //   expect(e.toString()).toEqual('-1*+1')
  //   expect(e.isProduct()).toBeTruthy()
  // })

  test('Parser parses a division', () => {
    const e = p.parse('1:1')
    expect(e.toString()).toEqual('1:1')
    expect(e.isDivision()).toBeTruthy()
  })

  // test('Parser parses a division', () => {
  //   const e = p.parse('-1:+1')
  //   expect(e.toString()).toEqual('-1:+1')
  //   expect(e.isDivision()).toBeTruthy()
  // })

  test('Parser parses a quotient', () => {
    const e = p.parse('1/1')
    expect(e.toString()).toEqual('1/1')
    expect(e.isQuotient()).toBeTruthy()
  })
  // test('Parser parses a quotient', () => {
  //   const e = p.parse('-1/+1')
  //   expect(e.toString()).toEqual('-1/+1')
  //   expect(e.isQuotient()).toBeTruthy()
  // })

  test('Parser parses a power', () => {
    const e = p.parse('1^1')
    expect(e.toString()).toEqual('1^1')
    expect(e.isPower()).toBeTruthy()
  })

  test('Parser parses ...', () => {
    const e = p.parse('1/2^3')
    expect(e.toString()).toEqual('1/2^3')
    expect(e.isQuotient()).toBeTruthy()
  })

  test('Parser parses a complex expression', () => {
    const e = p.parse('-(((+3.4+4/3)*2:(-4-5^2)))')
    expect(e.toString()).toEqual('-(((+3.4+4/3)*2:(-4-5^2)))')

  })

  test('Parser parses an equality', () => {
    const e = p.parse('1=1')
    expect(e.toString()).toEqual('1=1')
    expect(e.isEquality()).toBeTruthy()
  })

  test('Parser parses an unequality', () => {
    const e = p.parse('1!=1')
    expect(e.toString()).toEqual('1!=1')
    expect(e.isUnequality()).toBeTruthy()
  })

  test('Parser parses an inequality', () => {
    let e = p.parse('1<1')
    expect(e.toString()).toEqual('1<1')
    expect(e.isInequality()).toBeTruthy()

    e = p.parse('1<=1')
    expect(e.toString()).toEqual('1<=1')
    expect(e.isInequality()).toBeTruthy()

    e = p.parse('1>1')
    expect(e.toString()).toEqual('1>1')
    expect(e.isInequality()).toBeTruthy()

    e = p.parse('1>=1')
    expect(e.toString()).toEqual('1>=1')
    expect(e.isInequality()).toBeTruthy()
  })

  test('Parser parses functions', () => {
    let e = p.parse('pgcd(12;18)')
    expect(e.string).toEqual('pgcd(12;18)')
    expect(e.isFunction()).toBeTruthy()

    e = p.parse('mod(15;4)')
    expect(e.string).toEqual('mod(15;4)')
    expect(e.isFunction()).toBeTruthy()

    e = p.parse('cos(5)')
    expect(e.string).toEqual('cos(5)')
    expect(e.isFunction()).toBeTruthy()

    e = p.parse('sin(5)')
    expect(e.string).toEqual('sin(5)')
    expect(e.isFunction()).toBeTruthy()

    e = p.parse('tan(5)')
    expect(e.string).toEqual('tan(5)')
    expect(e.isFunction()).toBeTruthy()

    e = p.parse('ln(5)')
    expect(e.string).toEqual('ln(5)')
    expect(e.isFunction()).toBeTruthy()

    e = p.parse('log(5)')
    expect(e.string).toEqual('log(5)')
    expect(e.isFunction()).toBeTruthy()

    e = p.parse('exp(5)')
    expect(e.string).toEqual('exp(5)')
    expect(e.isFunction()).toBeTruthy()

    e = p.parse('floor(5.2)')
    expect(e.string).toEqual('floor(5.2)')
    expect(e.isFunction()).toBeTruthy()

    e = p.parse('abs(-5)')
    expect(e.string).toEqual('abs(-5)')
    expect(e.isFunction()).toBeTruthy()
  })

  test('Parser parses booleans', () => {
    let e = p.parse('true')
    expect(e.string).toEqual('true')
    expect(e.isBoolean()).toBeTruthy()
    expect(e.isTrue()).toBeTruthy()

    e = p.parse('false')
    expect(e.string).toEqual('false')
    expect(e.isBoolean()).toBeTruthy()
    expect(e.isFalse()).toBeTruthy()
  })



  test('Parser parses templates', () => {
    const exps = [
      // '$e',
      // '$er',
      // '$en',
      // '$d',
      // '$dr',


      '$e{2}',
      '$ep{2}',
      '$ei{2}',
      '$er{2}',
      '$epr{2}',
      '$eir{2}',
      '$e{2;4}',
      '$ep{2;4}',
      '$ei{2;4}',
      '$er{2;4}',
      '$epr{2;4}',
      '$eir{2;4}',
      '$e[2;4]',
      '$er[2;4]',
      '$ep[2;4]',
      '$epr[2;4]',
      '$ei[2;4]',
      '$eir[2;4]',

      '$e[2;4]\\{3}',

      // '$d{2;3}',
      // '$d{2:4;3:5}',

      '${1}',
      '$l{1;2}',
      '$l{1;2}\\{2;3}'
    ]
    for (const tested of exps) {
      const e = p.parse(tested)
      expect(e.isTemplate()).toBeTruthy()
      expect(e.string).toBe(tested)
    }
  })

  // {nature:, children:}
  test('Parser creates AST', () => {
    const exps = {
      '1+1+1': { children: ['+', 'number'], nature: '+' },
      '1+(1+1)': { children: ['number', 'bracket'], nature: '+' },
      '(1+1)+1': { children: ['bracket', 'number'], nature: '+' },
      '1-(1+1)': { children: ['number', 'bracket'], nature: '-' },
      '1+1-1': { children: ['+', 'number'], nature: '-' },
      '(1+1)-1': { children: ['bracket', 'number'], nature: '-' },
      '1+1*1': { children: ['number', '*'], nature: '+' },
      '1+(1*1)': { children: ['number', 'bracket'], nature: '+' },
      '1*1+1': { children: ['*', 'number'], nature: '+' },
      '(1*1)+1': { children: ['bracket', 'number'], nature: '+' },
      '1+1:1': { children: ['number', ':'], nature: '+' },
      '1+(1:1)': { children: ['number', 'bracket'], nature: '+' },
      '1:1+1': { children: [':', 'number'], nature: '+' },
      '(1:1)+1': { children: ['bracket', 'number'], nature: '+' },
      '1+1/1': { children: ['number', '/'], nature: '+' },
      '1+(1/1)': { children: ['number', 'bracket'], nature: '+' },
      '1/1+1': { children: ['/', 'number'], nature: '+' },
      '(1/1)+1': { children: ['bracket', 'number'], nature: '+' },
      '1^1+1': { children: ['^', 'number'], nature: '+' },
      '(1^1)+1': { children: ['bracket', 'number'], nature: '+' },
      '1+1^1': { children: ['number', '^'], nature: '+' },
      '1+(1^1)': { children: ['number', 'bracket'], nature: '+' },

      // '1-(1+1)':'1-(1+1)', duplicate
      // '1+1-1':'1+1-1', duplicate
      '1-(1-1)': { children: ['number', 'bracket'], nature: '-' },
      '1-1-1': { children: ['-', 'number'], nature: '-' },
      '(1-1)-1': { children: ['bracket', 'number'], nature: '-' },
      '1*1-1': { children: ['*', 'number'], nature: '-' },
      '(1*1)-1': { children: ['bracket', 'number'], nature: '-' },
      '1-1*1': { children: ['number', '*'], nature: '-' },
      '1-(1*1)': { children: ['number', 'bracket'], nature: '-' },
      '1-1:1': { children: ['number', ':'], nature: '-' },
      '1-(1:1)': { children: ['number', 'bracket'], nature: '-' },
      '1:1-1': { children: [':', 'number'], nature: '-' },
      '(1:1)-1': { children: ['bracket', 'number'], nature: '-' },
      '1-1/1': { children: ['number', '/'], nature: '-' },
      '1-(1/1)': { children: ['number', 'bracket'], nature: '-' },
      '1/1-1': { children: ['/', 'number'], nature: '-' },
      '(1/1)-1': { children: ['bracket', 'number'], nature: '-' },
      '1^1-1': { children: ['^', 'number'], nature: '-' },
      '(1^1)-1': { children: ['bracket', 'number'], nature: '-' },
      '1-1^1': { children: ['number', '^'], nature: '-' },
      '1-(1^1)': { children: ['number', 'bracket'], nature: '-' },

      '1*(1+1)': { children: ['number', 'bracket'], nature: '*' },
      '(1+1)*1': { children: ['bracket', 'number'], nature: '*' },
      '1*(1-1)': { children: ['number', 'bracket'], nature: '*' },
      '(1-1)*1': { children: ['bracket', 'number'], nature: '*' },
      '1*1*1': { children: ['*', 'number'], nature: '*' },
      '1*(1*1)': { children: ['number', 'bracket'], nature: '*' },
      '(1*1)*1': { children: ['bracket', 'number'], nature: '*' },
      '1:1*1': { children: [':', 'number'], nature: '*' },
      '(1:1)*1': { children: ['bracket', 'number'], nature: '*' },
      '1*(1:1)': { children: ['number', 'bracket'], nature: '*' },
      '1*1/1': { children: ['*', 'number'], nature: '/' },
      '1*(1/1)': { children: ['number', 'bracket'], nature: '*' },
      '1/1*1': { children: ['/', 'number'], nature: '*' },
      '(1/1)*1': { children: ['bracket', 'number'], nature: '*' },
      '1^1*1': { children: ['^', 'number'], nature: '*' },
      '(1^1)*1': { children: ['bracket', 'number'], nature: '*' },
      '1*1^1': { children: ['number', '^'], nature: '*' },
      '1*(1^1)': { children: ['number', 'bracket'], nature: '*' },

      '1:(1+1)': { children: ['number', 'bracket'], nature: ':' },
      '(1+1):1': { children: ['bracket', 'number'], nature: ':' },
      '1:(1-1)': { children: ['number', 'bracket'], nature: ':' },
      '(1-1):1': { children: ['bracket', 'number'], nature: ':' },
      '1:(1*1)': { children: ['number', 'bracket'], nature: ':' },
      '1*1:1': { children: ['*', 'number'], nature: ':' },
      '(1*1):1': { children: ['bracket', 'number'], nature: ':' },
      '1:1:1': { children: [':', 'number'], nature: ':' },
      '1:(1:1)': { children: ['number', 'bracket'], nature: ':' },
      '(1:1):1': { children: ['bracket', 'number'], nature: ':' },
      '1:(1/1)': { children: ['number', 'bracket'], nature: ':' },
      '1:1/1': { children: [':', 'number'], nature: '/' },
      '1/1:1': { children: ['/', 'number'], nature: ':' },
      '(1/1):1': { children: ['bracket', 'number'], nature: ':' },
      '1^1:1': { children: ['^', 'number'], nature: ':' },
      '(1^1):1': { children: ['bracket', 'number'], nature: ':' },
      '1:1^1': { children: ['number', '^'], nature: ':' },
      '1:(1^1)': { children: ['number', 'bracket'], nature: ':' },

      '1/(1+1)': { children: ['number', 'bracket'], nature: '/' },
      '(1+1)/1': { children: ['bracket', 'number'], nature: '/' },
      '1/(1-1)': { children: ['number', 'bracket'], nature: '/' },
      '(1-1)/1': { children: ['bracket', 'number'], nature: '/' },
      '1/(1*1)': { children: ['number', 'bracket'], nature: '/' },
      '(1*1)/1': { children: ['bracket', 'number'], nature: '/' },
      '1/(1:1)': { children: ['number', 'bracket'], nature: '/' },
      '(1:1)/1': { children: ['bracket', 'number'], nature: '/' },
      '1/(1/1)': { children: ['number', 'bracket'], nature: '/' },
      '1/1/1': { children: ['/', 'number'], nature: '/' },
      '(1/1)/1': { children: ['bracket', 'number'], nature: '/' },
      '1^1/1': { children: ['^', 'number'], nature: '/' },
      '(1^1)/1': { children: ['bracket', 'number'], nature: '/' },
      '1/1^1': { children: ['number', '^'], nature: '/' },
      '1/(1^1)': { children: ['number', 'bracket'], nature: '/' },

      '1^(1+1)': { children: ['number', 'bracket'], nature: '^' },
      '(1+1)^1': { children: ['bracket', 'number'], nature: '^' },
      '1^(1-1)': { children: ['number', 'bracket'], nature: '^' },
      '(1-1)^1': { children: ['bracket', 'number'], nature: '^' },
      '1^(1*1)': { children: ['number', 'bracket'], nature: '^' },
      '(1*1)^1': { children: ['bracket', 'number'], nature: '^' },
      '1^(1:1)': { children: ['number', 'bracket'], nature: '^' },
      '(1:1)^1': { children: ['bracket', 'number'], nature: '^' },
      '1^(1/1)': { children: ['number', 'bracket'], nature: '^' },
      '1^1^1': { children: ['^', 'number'], nature: '^' },
      '1^(1^1)': { children: ['number', 'bracket'], nature: '^' },
      '(1^1)^1': { children: ['bracket', 'number'], nature: '^' },

      '-1+2': { children: ['opposite', 'number'], nature: '+' },
      '(-1)+2': { children: ['bracket', 'number'], nature: '+' },
      '-(1+2)': { children: ['bracket'], nature: 'opposite' },
      // '1+-2': { children: ['number', 'opposite'], nature: '+' },
      '1+(-2)': { children: ['number', 'bracket'], nature: '+' },

      '-1-2': { children: ['opposite', 'number'], nature: '-' },
      '(-1)-2': { children: ['bracket', 'number'], nature: '-' },
      '-(1-2)': { children: ['bracket'], nature: 'opposite' },
      // '1--2': { children: ['number', 'opposite'], nature: '-' },
      '1-(-2)': { children: ['number', 'bracket'], nature: '-' },

      '-1*2': { children: ['*'], nature: 'opposite' },
      '+1*2': { children: ['*'], nature: 'positive' },
      '(-1)*2': { children: ['bracket', 'number'], nature: '*' },
      '-(1*2)': { children: ['bracket'], nature: 'opposite' },
      // '1*-2': { children: ['number', 'opposite'], nature: '*' },
      '1*(-2)': { children: ['number', 'bracket'], nature: '*' },

      '-1:2': { children: [':'], nature: 'opposite' },
      '+1:2': { children: [':'], nature: 'positive' },
      '(-1):2': { children: ['bracket', 'number'], nature: ':' },
      '-(1:2)': { children: ['bracket'], nature: 'opposite' },
      // '1:-2': { children: ['number', 'opposite'], nature: ':' },
      '1:(-2)': { children: ['number', 'bracket'], nature: ':' },

      '-1/2': { children: ['/'], nature: 'opposite' },
      '+1/2': { children: ['/'], nature: 'positive' },
      '(-1)/2': { children: ['bracket', 'number'], nature: '/' },
      '-(1/2)': { children: ['bracket'], nature: 'opposite' },
      // '1/-2': { children: ['number', 'opposite'], nature: '/' },
      '1/(-2)': { children: ['number', 'bracket'], nature: '/' },


      'abc': { children: ['', 'symbol'], nature: '' },
      'ab:c': { children: ['', 'symbol'], nature: ':' },
      'ab/c': { children: ['', 'symbol'], nature: '/' },
      'ab:c*d': { children: [':', 'symbol'], nature: '*' },
      'ab/c*d': { children: ['/', 'symbol'], nature: '*' },
      'ab+cd': { children: ['', ''], nature: '+' },
      'x^yz': { children: ['^', 'symbol'], nature: '' },
      'ax^y': { children: ['symbol', '^'], nature: '' },
      'ax^yz': { children: ['', 'symbol'], nature: '' },
    }
    for (const [tested, expected] of Object.entries(exps)) {
      // console.log('tested', tested)
      const e = p.parse(tested)
      expect(e.shallow()).toEqual(expected)
    }
  })

  // a Tester quand la fonction de simplification de fonction sera réécrite
  test.skip('Parser puts brackets where it is needed', () => {
    const exps = {
      '1+1+1': '1+1+1',
      '1+(1+1)': '1+1+1',
      '(1+1)+1': '1+1+1',
      '1-(1+1)': '1-(1+1)',
      '1+1-1': '1+1-1',
      '(1+1)-1': '1+1-1',
      '1+1*1': '1+1*1',
      '1+(1*1)': '1+1*1',
      '1*1+1': '1*1+1',
      '(1*1)+1': '1*1+1',
      '1+1:1': '1+1:1',
      '1+(1:1)': '1+1:1',
      '1:1+1': '1:1+1',
      '(1:1)+1': '1:1+1',
      '1+1/1': '1+1/1',
      '1+(1/1)': '1+1/1',
      '1/1+1': '1/1+1',
      '(1/1)+1': '1/1+1',
      '1^1+1': '1^1+1',
      '(1^1)+1': '1^1+1',
      '1+1^1': '1+1^1',
      '1+(1^1)': '1+1^1',

      // '1-(1+1)':'1-(1+1)', duplicate
      // '1+1-1':'1+1-1', duplicate
      '1-(1-1)': '1-(1-1)',
      '1-1-1': '1-1-1',
      '(1-1)-1': '1-1-1',
      '1*1-1': '1*1-1',
      '(1*1)-1': '1*1-1',
      '1-1*1': '1-1*1',
      '1-(1*1)': '1-1*1',
      '1-1:1': '1-1:1',
      '1-(1:1)': '1-1:1',
      '1:1-1': '1:1-1',
      '(1:1)-1': '1:1-1',
      '1-1/1': '1-1/1',
      '1-(1/1)': '1-1/1',
      '1/1-1': '1/1-1',
      '(1/1)-1': '1/1-1',
      '1^1-1': '1^1-1',
      '(1^1)-1': '1^1-1',
      '1-1^1': '1-1^1',
      '1-(1^1)': '1-1^1',

      '1*(1+1)': '1*(1+1)',
      '(1+1)*1': '(1+1)*1',
      '1*(1-1)': '1*(1-1)',
      '(1-1)*1': '(1-1)*1',
      '1*1*1': '1*1*1',
      '1*(1*1)': '1*1*1',
      '(1*1)*1': '1*1*1',
      '1:1*1': '1:1*1',
      '(1:1)*1': '1:1*1',
      '1*(1:1)': '1*1:1',
      '1*1/1': '1*1/1',
      '1*(1/1)': '1*1/1',
      '1/1*1': '1/1*1',
      '(1/1)*1': '1/1*1',
      '1^1*1': '1^1*1',
      '(1^1)*1': '1^1*1',
      '1*1^1': '1*1^1',
      '1*(1^1)': '1*1^1',

      '1:(1+1)': '1:(1+1)',
      '(1+1):1': '(1+1):1',
      '1:(1-1)': '1:(1-1)',
      '(1-1):1': '(1-1):1',
      '1:(1*1)': '1:(1*1)',
      '1*1:1': '1*1:1',
      '(1*1):1': '1*1:1',
      '1:1:1': '1:1:1',
      '1:(1:1)': '1:(1:1)',
      '(1:1):1': '1:1:1',
      '1:(1/1)': '1:1/1',
      '1:1/1': '1:1/1',
      '1/1:1': '1/1:1',
      '(1/1):1': '1/1:1',
      '1^1:1': '1^1:1',
      '(1^1):1': '1^1:1',
      '1:1^1': '1:1^1',
      '1:(1^1)': '1:1^1',

      '1/(1+1)': '1/(1+1)',
      '(1+1)/1': '(1+1)/1',
      '1/(1-1)': '1/(1-1)',
      '(1-1)/1': '(1-1)/1',
      '1/(1*1)': '1/(1*1)',
      '(1*1)/1': '(1*1)/1',
      '1/(1:1)': '1/(1:1)',
      '(1:1)/1': '(1:1)/1',
      '1/(1/1)': '1/(1/1)',
      '1/1/1': '1/1/1',
      '(1/1)/1': '1/1/1',
      '1^1/1': '1^1/1',
      '(1^1)/1': '1^1/1',
      '1/1^1': '1/1^1',
      '1/(1^1)': '1/1^1',

      '1^(1+1)': '1^(1+1)',
      '(1+1)^1': '(1+1)^1',
      '1^(1-1)': '1^(1-1)',
      '(1-1)^1': '(1-1)^1',
      '1^(1*1)': '1^(1*1)',
      '(1*1)^1': '(1*1)^1',
      '1^(1:1)': '1^(1:1)',
      '(1:1)^1': '(1:1)^1',
      '1^(1/1)': '1^(1/1)',
      '1^1^1': '1^1^1',
      '1^(1^1)': '1^(1^1)',
      '(1^1)^1': '1^1^1'
    }
    for (const [tested, expected] of Object.entries(exps)) {
      const e = p.parse(tested)
      expect(e.toString()).toEqual(expected)
    }
  })
})

describe('Implicit products', () => {
  const p = parser()

  test('Parser recognises a simple implicit product', () => {
    const e = p.parse('2abc')
    // const structure = { children: ['number', 'symbol', 'symbol'], nature: '*' }
    expect(e.isProduct()).toBeTruthy()
    expect(e.toString()).toEqual('2abc')
    // expect(e.showShallowStructure()).toEqual(structure)
  })

  test('Parser recognises a simple implicit product with *', () => {
    const e = p.parse('2ab*cab')
    // const structure = { children: ['number', 'symbol', 'symbol'], nature: '*' }
    expect(e.isProduct()).toBeTruthy()
    expect(e.toString()).toEqual('2ab*cab')
    // expect(e.showShallowStructure()).toEqual(structure)
  })

  test('Parser recognises a simple implicit product with +', () => {
    const e = p.parse('2ab+cab')
    // const structure = { children: ['number', 'symbol', 'symbol'], nature: '*' }
    expect(e.isSum()).toBeTruthy()
    expect(e.toString()).toEqual('2ab+cab')
    // expect(e.showShallowStructure()).toEqual(structure)
  })

  test('Parser recognises a simple implicit product with -', () => {
    const e = p.parse('2ab-cab')
    // const structure = { children: ['number', 'symbol', 'symbol'], nature: '*' }
    expect(e.isDifference()).toBeTruthy()
    expect(e.toString()).toEqual('2ab-cab')
    // expect(e.showShallowStructure()).toEqual(structure)
  })

  test('Parser recognises an implicit product with :', () => {
    const e = p.parse('ab:b*cad')
    // const structure = { children: ['*', '*'], nature: ':' }
    expect(e.isProduct()).toBeTruthy()
    expect(e.toString()).toEqual('ab:b*cad')
    // expect(e.showShallowStructure()).toEqual(structure)
  })

  test('Parser recognises an implicit product with /', () => {
    const e = p.parse('ab/b*c')
    // const structure = { children: ['*', '*'], nature: '/' }
    expect(e.isProduct()).toBeTruthy()
    expect(e.toString()).toEqual('ab/b*c')
    // expect(e.showShallowStructure()).toEqual(structure)
  })

  test('Parser recognises an implicit product with all', () => {
    const e = p.parse('ab/b*c:f*ra')
    // const structure = { children: ['*', '*'], nature: '/' }
    expect(e.isProduct()).toBeTruthy()
    expect(e.toString()).toEqual('ab/b*c:f*ra')
    // expect(e.showShallowStructure()).toEqual(structure)
  })



  test('Parser recognises an implicit product with ^', () => {
    const e = p.parse('2x^3y')
    // const structure = { children: ['number', '^', 'symbol'], nature: '*' }
    expect(e.isProduct()).toBeTruthy()
    expect(e.toString()).toEqual('2x^3y')
    // expect(e.showShallowStructure()).toEqual(structure)
  })
})

describe('Testing parsing units', () => {
  const p = parser()
  const exps = {
    '1 mL': '1 mL',
    '1 cL': '1 cL',
    '1 dL': '1 dL',
    '1 L': '1 L',
    '1 daL': '1 daL',
    '1 hL': '1 hL',
    '1 kL': '1 kL',
    '1 mm': '1 mm',
    '1 cm': '1 cm',
    '1 dm': '1 dm',
    '1 m': '1 m',
    '1 dam': '1 dam',
    '1 hm': '1 hm',
    '1 km': '1 km',
    '1 mg': '1 mg',
    '1 cg': '1 cg',
    '1 dg': '1 dg',
    '1 g': '1 g',
    '1 dag': '1 dag',
    '1 hg': '1 hg',
    '1 kg': '1 kg',
    '1 q': '1 q',
    '1 t': '1 t',
    '1 ms': '1 ms',
    '1 min': '1 min',
    '1 h': '1 h',
    '1 j': '1 j',
    '1 semaine': '1 semaine',
    '1 an': '1 an',
    '1 °': '1 °',
    '1 cm + 1 cm': '1 cm+1 cm',
    '1 cm + 1 cm + 1 cm': '1 cm+1 cm+1 cm',
    '3 cm + 5 cm ': '3 cm+5 cm',
    '1 km + 1 cm ': '1 km+1 cm',
    '1 km - 1 cm ': '1 km-1 cm',
    '1 km * 1 cm ': '1 km*1 cm',
    '1 km : 1 cm ': '1 km:1 cm',
    '1 km / 1 cm ': '1 km/1 cm',
    '1 cm.cm': '1 cm.cm',
    '1 cm^2': '1 cm^2',
    '1 cm^(-2)': '1 cm^(-2)',
    '1 cm^2.cm': '1 cm^2.cm',
    '1 cm^2.cm^2': '1 cm^2.cm^2',
    '1 cm^2.cm^(-2)': '1 cm^2.cm^(-2)',
    '1 t.cm^(-2)': '1 t.cm^(-2)',
    '1 kg.m^(-2)': '1 kg.m^(-2)',
    '(1+2) cm': '(1+2) cm',
    '(1*2) cm': '(1*2) cm',
    '1*2 cm': '1*2 cm',
    '1*(2 cm)': '1*(2 cm)',
    '1 cm * 2': '1 cm*2',
    '(1 cm) * 2': '(1 cm)*2',
    '(1-2) cm': '(1-2) cm',
    '(1:2) cm': '(1:2) cm',
    '1:2 cm': '1:2 cm',
    '1:(2 cm)': '1:(2 cm)',
    '1 cm:2': '1 cm:2',
    '(1/2) cm': '(1/2) cm',
    'a cm': 'a cm',
    '1 km = 1000 m': '1 km=1000 m',
    '$e[2;9] km': '$e[2;9] km',
  }





  // TODO : division par 0
  for (const [tested, expected] of Object.entries(exps)) {
    test(`parsing ${tested}`, () => {
      expect(p.parse(tested).string).toBe(expected)
    })
  }
})

describe.skip('Testing wrong units expressions ', () => {
  const p = parser()
  const exps = ['1 cm + 1', '1L + 1m', '1 cm cm', '(2cm + 5 cm) cm']

  for (const tested of exps) {
    test(`parsing ${tested}`, () => {
      const e = p.parse(tested)
      expect(e.type === 'error').toBe(true)
    })
  }
})
