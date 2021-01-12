import {
  formatLuna, formatLunaInput, formatLunaUserInput,
  formatPercentage,
  formatUST,
  formatUSTInput,
  formatUSTUserInput,
  formatUSTWithPostfixUnits,
} from '../';

describe('notation', () => {
  test('notation formats', () => {
    expect(formatUST('1.342131')).toBe('1.342');
    expect(formatUST('1.12049312')).toBe('1.12');
    expect(formatUST('1.10049312')).toBe('1.1');
    expect(formatUST('1.00049312')).toBe('1');
    expect(formatUST('1000.1234000')).toBe('1,000.123');
    expect(formatUST('1000.120000')).toBe('1,000.12');

    expect(formatUSTWithPostfixUnits('1342131')).toBe('1.34M');
    expect(formatUSTWithPostfixUnits('1342131.34432')).toBe('1.34M');
    expect(formatUSTWithPostfixUnits('1100493')).toBe('1.1M');
    expect(formatUSTWithPostfixUnits('1100493.2435')).toBe('1.1M');
    expect(formatUSTWithPostfixUnits('11103452')).toBe('11.1M');
    expect(formatUSTWithPostfixUnits('1000345')).toBe('1M');
    expect(formatUSTWithPostfixUnits('1000345000')).toBe('1,000.34M');
    expect(formatUSTWithPostfixUnits('10003450')).toBe('10M');
    expect(formatUSTWithPostfixUnits('1120.33434')).toBe('1.12K');
    expect(formatUSTWithPostfixUnits('1123.4000')).toBe('1.12K');
    expect(formatUSTWithPostfixUnits('1120.000')).toBe('1.12K');
    expect(formatUSTWithPostfixUnits('1000')).toBe('1K');
    expect(formatUSTWithPostfixUnits('1010')).toBe('1.01K');
    
    expect(formatLuna('1.342131')).toBe('1.342131');
    expect(formatLuna('1.12049312')).toBe('1.120493');
    expect(formatLuna('1.1004000')).toBe('1.1004');
    expect(formatLuna('1.00049312')).toBe('1.000493');
    expect(formatLuna('1000.1234000')).toBe('1,000.1234');
    expect(formatLuna('1000.120000')).toBe('1,000.12');
    
    expect(formatPercentage('1.342131')).toBe('1.34');
    expect(formatPercentage('1.12049312')).toBe('1.12');
    expect(formatPercentage('1.1004000')).toBe('1.1');
    expect(formatPercentage('1.00049312')).toBe('1');
    expect(formatPercentage('1000.1234000')).toBe('1,000.12');
    expect(formatPercentage('1000.120000')).toBe('1,000.12');
    
    expect(formatUSTUserInput('10.3436')).toBe('10.343');
    expect(formatUSTUserInput('10.00')).toBe('10.00');
    
    expect(formatUSTInput('10.3436')).toBe('10.343');
    expect(formatUSTInput('10.00')).toBe('10');
    
    expect(formatLunaUserInput('10.34363554')).toBe('10.343635');
    expect(formatLunaUserInput('10.3436')).toBe('10.3436');
    expect(formatLunaUserInput('10.0000000')).toBe('10.000000');
    
    expect(formatLunaInput('10.3436')).toBe('10.3436');
    expect(formatLunaInput('10.00')).toBe('10');
  });
});
