import { createContext, useContext, useState, type ReactNode } from "react";

export interface Animal {
  id: string;
  name: string;
  personality: string;
  illustration: string;
}

const DOG_URL = "https://private-us-east-1.manuscdn.com/sessionFile/EdahenehbQK3Bb8wcoTRUJ/sandbox/ZIbNqgg8tiwknKACjLIpjU_1770920703327_na1fn_YW5pbWFsLWRvZw.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvRWRhaGVuZWhiUUszQmI4d2NvVFJVSi9zYW5kYm94L1pJYk5xZ2c4dGl3a25LQUNqTElwalVfMTc3MDkyMDcwMzMyN19uYTFmbl9ZVzVwYldGc0xXUnZady5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=LLtNPJGx~iibxxIR-qgll1zQfyVFZkWqgOk3zyKAYAnaU8m--U93PUntxDSEu~5f-KgMYKOV6XHcBeZcxdTH1Ocms-KgCCTYPRNxF-YyfbPzj6IvWGh0lfB2CVu88qmasMaDVuajZOP1rl~RtSM7myrLShoFmYyUajoyVFp4BhxpCnyS78mvlK757TL1UVAUdrKMweol5kS1Sqrx-mT3h0qU~ReuMEEdghydXxVqo9WG5YG0AQ6JnSBT-YhT3bF8DHWKKVSp7hhWN5LVYtOSNsyWw42sx3R6szPgR3Z9OSaZ41K0Vl4r3tZJn7gfpAKCvVcs89JUvyWsS21120EVdg__";
const TREX_URL = "https://private-us-east-1.manuscdn.com/sessionFile/EdahenehbQK3Bb8wcoTRUJ/sandbox/ZIbNqgg8tiwknKACjLIpjU_1770920703327_na1fn_YW5pbWFsLXRyZXg.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvRWRhaGVuZWhiUUszQmI4d2NvVFJVSi9zYW5kYm94L1pJYk5xZ2c4dGl3a25LQUNqTElwalVfMTc3MDkyMDcwMzMyN19uYTFmbl9ZVzVwYldGc0xYUnlaWGcucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=FzqyLFPlxs7y~DwJc9V-RgcrANcwXovHmfOd2x6j~N-YUeRKvtEgN7VSDUzbigQuLc-QeJLghkAEpMa2VoJStk3gdTxntb~t~gjRuVNg4kqgUcgmys4PgjEeaENTGyhq3MZqh9TgAp~ufwEc66HKa8Gp4vzBSDT~UhYpUJtGnYwYl3OucFT0p0nyhnP13oSFlmwqfWx2CPvGkYyE6JehHZaifXNirjvHYzOjVAzqsO~OfqheMovZxPzcXKYcOVofXE7DLef7m2fEJt6V1Hvb~kGpBxHpvSksNamPwm5-w2Y4oFtxL7jaNW3UNkzBdhk0VrZKHmrr39y7PW2khC87LA__";
const CROC_URL = "https://private-us-east-1.manuscdn.com/sessionFile/EdahenehbQK3Bb8wcoTRUJ/sandbox/ZIbNqgg8tiwknKACjLIpjU_1770920703328_na1fn_YW5pbWFsLWNyb2NvZGlsZQ.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvRWRhaGVuZWhiUUszQmI4d2NvVFJVSi9zYW5kYm94L1pJYk5xZ2c4dGl3a25LQUNqTElwalVfMTc3MDkyMDcwMzMyOF9uYTFmbl9ZVzVwYldGc0xXTnliMk52Wkdsc1pRLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=GjVuFhMN8oCzpsx1GuH2HKt4xdKu0k0saO5OfWmbwo8YgMTirHzTDezk551i38hJVv1~hwhT1gpKUGwHWP7TiBaL41XPd-cYqtrxK6wMPYga2WOHsnWYOJQ877B3Aq~bcpGCZqgStYTyGOZxLmSrsjjs5~U-w8EuNzvEKG7Q5lD3mASwsrYLH8BxpyyjA52zcz~ZZ2ovYOIwbnJx8ru3WIf1bXFU3pSqgqXM2DZKd9DD~q2DW8zMlelOsTjEWOIaimbo-M38pqXEvzQ43mGf3ZeajU4RA8XcGfu-DdI7qZNxG1Xdi6dXhVx~RgJwkAwPHWLYPFjFJk5xg33j4sw9Aw__";
const SHARK_URL = "https://private-us-east-1.manuscdn.com/sessionFile/EdahenehbQK3Bb8wcoTRUJ/sandbox/ZIbNqgg8tiwknKACjLIpjU_1770920703328_na1fn_YW5pbWFsLXNoYXJr.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvRWRhaGVuZWhiUUszQmI4d2NvVFJVSi9zYW5kYm94L1pJYk5xZ2c4dGl3a25LQUNqTElwalVfMTc3MDkyMDcwMzMyOF9uYTFmbl9ZVzVwYldGc0xYTm9ZWEpyLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=jwwa27gSRNSUx9oLqtjgYtyMsg0iyw08eBuf8B6uoM1elgjV~UUSJ2EDzk6~moX9Zq6-DEkR1jtp57pO7k3nLNOAuM~gRUqNn2cCK5LAPp7z8yfS8I2GyNuCO6rj3KPNWjqoimE4sZQCwoAOyZS5PtsEy6GlwngjoLKsaiL7Vrj7qOJK~uP8VSI5k0VJcSrDgSjBi~Si9ibmZ9gPIb7YgZ~Zd2ia6sOUcAu2ajJpHCeWTs~W3-hJ3znIPbXubQmIOXEHargT5wxTBMzYZJy9NNZb6ZXoy4WWkSbfUE0Td8KnzMaiGuMUgV7ap3srw3iPxtLc91yGgAsivCPCl-kolw__";

export const ALL_ANIMALS: Animal[] = [
  {
    id: "bunny",
    name: "Hoppy",
    personality: "Energetic & Bouncy",
    illustration: "https://files.manuscdn.com/user_upload_by_module/session_file/109885302/RXSrwXabMUoBYRik.png",
  },
  {
    id: "bear",
    name: "Snoozy",
    personality: "Cuddly & Calm",
    illustration: "https://files.manuscdn.com/user_upload_by_module/session_file/109885302/XnieUJGIewdldYqG.png",
  },
  {
    id: "fox",
    name: "Sparky",
    personality: "Clever & Playful",
    illustration: "https://files.manuscdn.com/user_upload_by_module/session_file/109885302/LKfihDuAWFFozMYY.png",
  },
  {
    id: "cat",
    name: "Luna",
    personality: "Peaceful & Gentle",
    illustration: "https://files.manuscdn.com/user_upload_by_module/session_file/109885302/zjjBLqPqpFDQlswg.png",
  },
  {
    id: "panda",
    name: "Zen",
    personality: "Calm & Wise",
    illustration: "https://files.manuscdn.com/user_upload_by_module/session_file/109885302/phDMDrqNZNgFpjbA.png",
  },
  {
    id: "dog",
    name: "Buddy",
    personality: "Loyal & Friendly",
    illustration: DOG_URL,
  },
  {
    id: "trex",
    name: "Rex",
    personality: "Brave & Mighty",
    illustration: TREX_URL,
  },
  {
    id: "crocodile",
    name: "Snapper",
    personality: "Tough & Silly",
    illustration: CROC_URL,
  },
  {
    id: "shark",
    name: "Finn",
    personality: "Cool & Adventurous",
    illustration: SHARK_URL,
  },
];

interface AnimalContextType {
  selectedAnimal: Animal | null;
  setSelectedAnimal: (animal: Animal | null) => void;
}

const AnimalContext = createContext<AnimalContextType>({
  selectedAnimal: null,
  setSelectedAnimal: () => {},
});

export function AnimalProvider({ children }: { children: ReactNode }) {
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);

  return (
    <AnimalContext.Provider value={{ selectedAnimal, setSelectedAnimal }}>
      {children}
    </AnimalContext.Provider>
  );
}

export function useAnimal() {
  return useContext(AnimalContext);
}
