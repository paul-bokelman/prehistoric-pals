export const attributes = {
  expressions: {
    mouth: ["frown", "smile", "straight", "tooth", "tongue", "kiss"],
    eye: [
      "plain",
      "angry",
      "delighted",
      "tired",
      "bored",
      "blind",
      "swag",
      "happy",
    ],
  },
  physical: {
    back: [null, "pentagon", "spike", "innerspike"],
    // belly: ["plain"],
  },
  accessories: {
    hat: [null, "egg"],
    // glasses: [null, "sunglasses", "monocle"],
  },
};

export const background = {
  colors: {},
  sky: ["moon", "rainbow", "clouds"],
  ground: ["grass", "dirt", "sand", "rock"],
};

export const mutuallyExclusive = {};

export const overlayOrder = [
  ["hats", "glasses"],
  ["mouth", "eyes"],
  ["back", "belly"],
];

export const colors = {
  current: {
    body: {
      primary: "#1200FF",
      secondary: "#FF0000",
    },
    accessories: { primary: "#FFCE00", secondary: "#FF0000" },
  },
};
