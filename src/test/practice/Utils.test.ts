import { toUpperCase, getStringInfo, StringUtils } from "../app/practice/Utils";

describe("Utils test suite", () => {
  describe("StringUtils tests", () => {
    let sut: StringUtils;

    beforeEach(() => {
      sut = new StringUtils();
    });

    it("Should return correct upperCase", () => {
      const actual = sut.toUpperCase("abc");
      expect(actual).toBe("ABC");
    });

    // can be used to leave todos on what you need to write tests for
    it.todo("test long strings");

    it("Should throw error on invalid argument - arrow function", () => {
      expect(() => {
        sut.toUpperCase("");
      }).toThrow();
    });
  });

  it("should return uppercase of a valid string", () => {
    // arrange
    const sut = toUpperCase;
    const expected = "ABC";

    // act
    const actual = sut("abc");

    // assert
    expect(actual).toBe(expected);
  });

  describe("ToUpperCase examples", () => {
    it.each([
      { input: "abc", expected: "ABC" },
      { input: "My-String", expected: "MY-STRING" },
      { input: "def", expected: "DEF" },
    ])("$input toUpperCase should be $expected", ({ input, expected }) => {
      const actual = toUpperCase(input);
      expect(actual).toBe(expected);
    });
  });

  describe("getStringInfo for arg My-String should", () => {
    test("return right length", () => {
      const actual = getStringInfo("My-String");
      expect(actual.characters).toHaveLength(9);
    });
    test("return right lower casing", () => {
      const actual = getStringInfo("My-String");
      expect(actual.lowerCase).toBe("my-string");
    });
    test("return right upper casing", () => {
      const actual = getStringInfo("My-String");
      expect(actual.upperCase).toBe("MY-STRING");
    });
    test("return right characters", () => {
      const actual = getStringInfo("My-String");
      expect(actual.characters).toEqual([
        "M",
        "y",
        "-",
        "S",
        "t",
        "r",
        "i",
        "n",
        "g",
      ]);
      expect(actual.characters).toContain<string>("M");
      expect(actual.characters).toEqual(
        expect.arrayContaining(["r", "i", "n", "g", "M", "y", "-", "S", "t"])
      );
    });
    test("return defined extra info", () => {
      const actual = getStringInfo("My-String");
      expect(actual.extraInfo).not.toBe(undefined);
      expect(actual.extraInfo).not.toBeUndefined();
      expect(actual.extraInfo).toBeDefined();
      expect(actual.extraInfo).toBeTruthy();
    });
    test("return right extra info", () => {
      const actual = getStringInfo("My-String");
      expect(actual.extraInfo).toEqual({});
    });
  });
});
