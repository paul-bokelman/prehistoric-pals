import { dino } from ".";

export const url = (path: string) => {
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};

export const ppals = { dino };
