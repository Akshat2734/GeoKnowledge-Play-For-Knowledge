declare global {
    interface Window {
        ReactLeaflet: any; // Replace 'any' with the correct type if known
    }
}
export {}; // This is important to ensure the file is treated as a module augmentation