import {
  PasswordChecker,
  PasswordErrors,
} from "./../../app/passChecker/PasswordChecker";
describe("PasswordChecker test suite", () => {
  let sut: PasswordChecker;
  beforeEach(() => {
    sut = new PasswordChecker();
  });

  it("Password with less than 8 characters is invalid", () => {
    const actual = sut.checkPassword("1234567");
    expect(actual.valid).toBe(false);
    expect(actual.reasons).toContain(PasswordErrors.SHORT);
  });

  it("Password with 8 or more characters is valid", () => {
    const actual = sut.checkPassword("12345678");
    expect(actual.reasons).not.toContain(PasswordErrors.SHORT);
  });

  it("Password with no upper case char is invalid", () => {
    const actual = sut.checkPassword("1234abcd");
    expect(actual.valid).toBe(false);
    expect(actual.reasons).toContain(PasswordErrors.NO_UPPER_CASE);
  });

  it("Password with upper case char is valid", () => {
    const actual = sut.checkPassword("1234ABCD");
    expect(actual.reasons).not.toContain(PasswordErrors.NO_UPPER_CASE);
  });

  it("Password with no lower case char is invalid", () => {
    const actual = sut.checkPassword("1234ABCD");
    expect(actual.valid).toBe(false);
    expect(actual.reasons).toContain(PasswordErrors.NO_LOWER_CASE);
  });

  it("Password with lower case char is valid", () => {
    const actual = sut.checkPassword("1234ABCd");
    expect(actual.reasons).not.toContain(PasswordErrors.NO_LOWER_CASE);
  });

  it('Complex password is valid', () => {
    const actual = sut.checkPassword('abcd1234DCAB')
    expect(actual.reasons).toHaveLength(0)
    expect(actual.valid).toBe(true)
  })

  it('Admin password with no number is invalid', () => {
    const actual = sut.checkAdminPassword('abcdABCD')
    expect(actual.reasons).toContain(PasswordErrors.NO_NUMBER)
    expect(actual.valid).toBe(false)
  })
  
  it('Admin password with number is valid', () => {
    const actual = sut.checkAdminPassword('abcdABCD4')
    expect(actual.reasons).not.toContain(PasswordErrors.NO_NUMBER)
  })
});
