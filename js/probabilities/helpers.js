// Function to calculate factorial
export const factorial = (() => {
  const cache = {};
  return (n) => {
    if (n === 0) return 1;
    if (cache[n]) return cache[n];
    cache[n] = n * factorial(n - 1);
    return cache[n];
  };
})();

// Function to calculate combinatorial nCr (n choose r)
export const combinatorial = (n, r) => {
  if (r > n) return 0;
  return factorial(n) / (factorial(r) * factorial(n - r));
};

// Function to generate all combinations of a specific length from an array
export const generateCombinations = (array, length) => {
  const result = [];
  const combine = (start, prefix) => {
    if (prefix.length === length) {
      result.push(prefix);
      return;
    }
    for (let i = start; i < array.length; i++) {
      combine(i + 1, prefix.concat(array[i]));
    }
  };
  combine(0, []);
  return result;
};

// Function to work out if elements are next to each other
export const isSequential = (array) => {
  for (let i = 1; i < array.length; i++) {
    if (array[i] !== array[i - 1] + 1) {
      return false;
    }
  }
  return true;
};

export const toCamelCase = (str) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join("");
};

export const abbreviateHandNames = (names) => {
  return names.map((name) => {
    if (name === "Four Of A Kind") {
      return "4OAK";
    } else if (name === "Three Of A Kind") {
      return "3OAK";
    } else if (name === "Two Pair") {
      return "2P";
    } else if (name === "One Pair") {
      return "1P";
    }

    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("");
  });
};
