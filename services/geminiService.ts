
import { GoogleGenAI, Modality } from "@google/genai";
import type { Template } from '../types';

// Utility to convert File to a Gemini-compatible Part
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        // Handle ArrayBuffer case if necessary, though for web it's usually data URL
        resolve('');
      }
    };
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
};

export const generateImage = async (
  template: Template,
  userImage: File,
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const userImagePart = await fileToGenerativePart(userImage);
  
  // The template prompt is used exactly as provided. The "{input person}" placeholder
  // is replaced to refer to the subject from the input image.
  const processedPrompt = template.prompt.replace(/{input person}/g, 'The person in the provided photo');
  const textPart = { text: processedPrompt };


  // For this image editing model, the image should be sent first,
  // followed by the instructional text prompt.
  const parts = [
    userImagePart,
    textPart
  ];

  try {
    // The 'gemini-2.5-flash-image' model is used for image editing and remixing tasks.
    // It accepts both an image and a text prompt as input.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts },
      config: {
        // The responseModality must be set to IMAGE to receive an image output.
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData) {
          const base64ImageBytes: string = part.inlineData.data;
          return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        }
    }
    throw new Error("No image was generated. The response may have been blocked.");
  } catch (error) {
    console.error("Error generating image with Gemini:", error);
    if (error instanceof Error && error.message.includes("not found")) {
        throw new Error(`The model used for remixing is currently unavailable. Please try again later.`);
    }
    throw new Error("Failed to generate image. Please try again or use a different photo.");
  }
};
