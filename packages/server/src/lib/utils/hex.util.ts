type RandomHex = () => string;

export const randomHex: RandomHex = () => {
  const hex = Math.floor(Math.random() * 16777216).toString(16);
  if (hex.length < 6) return randomHex();
  return `#${hex}`;
};
