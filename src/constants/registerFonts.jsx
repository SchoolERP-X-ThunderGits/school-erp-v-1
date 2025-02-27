// src/registerFonts.js
import { Font } from '@react-pdf/renderer';

// Register Arial font globally
Font.register({
    family: 'RobotoR',
    src: '/assets/fonts/Roboto-Regular.ttf',  // Replace with actual URL
});
Font.register({
    family: 'RobotoM',
    src: '/assets/fonts/Roboto-Medium.ttf',  // Replace with actual URL
});
Font.register({
    family: 'RobotoL',
    src: '/assets/fonts/Roboto-Light.ttf',  // Replace with actual URL
});
Font.register({
    family: 'RobotoB',
    src: '/assets/fonts/Roboto-Bold.ttf',  // Replace with actual URL
});
Font.register({
    family: 'RobotoBI',
    src: '/assets/fonts/Roboto-BoldItalic.ttf',  // Replace with actual URL
});
Font.register({
    family: 'RobotoRI',
    src: '/assets/fonts/Roboto-Italic.ttf',  // Replace with actual URL
});


