let tokens = {
  oBrace: "{",
  cBrace: "}",
  oBracket: "[",
  cBracket: "]",
  quote: `"`,
  colon: ":",
  comma: ",",
  t: "t",
  f: "f"
};

let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(String);

let index = 0;

function parseStr(str) {
  if (str[index] !== tokens.quote) throw Error("gotta start with string");
  ++index; // past initial quote
  let val = "";
  for (; str[index] !== tokens.quote && index < str.length; ++index) {
    val += str[index];
  }
  if (index >= str.length) throw Error("invalid string");
  return val;
}

function parseBool(str) {
  if (str[index] !== tokens.t && str[index] !== tokens.f)
    throw Error("bool must be true or false");
  let b = str[index] === tokens.t ? true : false;
  let substr = str.slice(index, index + b.toString().length);
  if (substr !== b.toString())
    throw Error("invalid bool: expected " + b + " but got " + substr);
  index += b.toString().length;
  return b;
}

function parseNum(str) {
  if (!nums.includes(str[index])) throw Error("bad number");
  let n = "";
  for (; nums.includes(str[index]) && index < str.length; ++index) {
    n += str[index];
  }
  return Number(n);
}

function parseArr(str) {
  if (str[index] !== tokens.oBracket) throw Error("bad array");
  ++index;
  let a = [];
  for (; str[index] !== tokens.cBracket && index < str.length; ++index) {
    if (str[index] === tokens.comma) continue;
    a.push(parseVal(str));
  }
  if (index >= str.length) throw Error("arrays gotta close");
  return a;
}

function parseVal(str) {
  switch (str[index]) {
    case tokens.oBrace:
      return parseObj(str);
      break;
    case tokens.oBracket:
      return parseArr(str);
      break;
    case tokens.quote:
      return parseStr(str);
      break;
    case tokens.t:
    case tokens.f:
      return parseBool(str);
      break;
    case "0":
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
      return parseNum(str);
  }
}

function parseObj(str) {
  let obj = {};
  if (str[index] !== tokens.oBrace) throw Error("gotta start with a brace");
  ++index;
  for (; str[index] !== tokens.cBrace && index < str.length; ++index) {
    if (str[index] === tokens.comma) continue;
    Object.assign(obj, parseKvPair(str));
  }
  return obj;
}

function parseKvPair(str) {
  let key = parseStr(str);
  ++index; // past closing quote
  if (str[index] !== tokens.colon)
    throw Error(
      "missing colon after key: expected colon but got " + str[index]
    );

  ++index; // past the colon

  let val = parseVal(str);
  return { [key]: val };
}

function parse(str) {
  return parseObj(str.replace(/\s+/, ""));
}

function test() {
  let json = {
    key1: "hello",
    key2: "goodbye",
    age: 42,
    cool: true,
    uncool: false,
    stuff: { nested: "yup" },
    list: [1, 2, "hi", { innermost: "here i am" }]
  };
  console.log(parse(JSON.stringify(json)));
}

test();
