
export type TCourse = {
  imageUrl?: string;
  title: string;
  subtitle: string;
  tagline: string;
  benefits : string[];
  accessType : "lifetime" | "limited";
  accessValidity: Date;
  category: string;
  duration: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
};