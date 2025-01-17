import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

const GsrpiPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#373D92',
            100: '#373D92',
            200: '#373D92',
            300: '#6970C7',
            400: '#6970C7',
            500: '#000066', // Primary color
            60: '#000000',
            700: '#030567',
            800: '#1E257B',
            900: '#2B3186',
            950: '#2B3186',
        },
        primaryLight: {
            500: '#5056AC',
        },
        primaryDark: {
            500: '#07184A',
        },
        secondary: {
            500: '#9D0311',
        },
        secondaryLight: {
            500: '#DB141C',
        },
        secondaryDark: {
            500: '#690007',
        },
        webAccessibility: '#249300',
        neutralHover: '#F6F6F6',
        neutralText: '#454444',
        security: '#FF554C',
        tertiary: '#1D72D3',
        error: '#FF6D0A',
        red: '#DB141C',
        orange: '#FF6C08',
        yellow: '#FFB000',
        green: '#5BAE40',
        blue: '#00AAE5',
        purple: '#5A00BA',
        gray: '#928F9A',
        buttonDisabled: '#C9C8CC',
        focusRing: {
            width: '2px',
            style: 'dashed',
            color: '{primary.color}',
            offset: '1px'
        },
        colorScheme: {
            light: {
                primary: {
                    color: '{primary.500}',
                    inverseColor: '{primary.500}',
                    hoverColor: '{primaryLight.500}',
                    activeColor: '{primary.500}'
                },
                secondary: {
                    color: '{secondary.500}',
                    inverseColor: '{secondary.500}',
                    hoverColor: '{secondaryLight.500}',
                    activeColor: '{secondary.500}'
                },
                button: {
                    primary: {
                        background: '{primary.500}',
                        color: '#FFFFFF',
                        borderColor: '{primary.500}',
                    },
                    secondary: {
                        background: '{secondary.500}',
                        color: '#FFFFFF',
                        borderColor: '{secondary.500}',
                    },
                },
                highlight: {
                    background: '{zinc.950}',
                    focusBackground: '{zinc.700}',
                    color: '#ffffff',
                    focusColor: '#ffffff'
                },
                formField: {
                    hoverBorderColor: '{primary.500}',
                    focusBorderColor: '{primary.500}',
                    errorBorderColor: '{error}',
                    disabledBorderColor: '{neutralHover}',
                    hoverBackgroundColor: '{primaryLight.500}',
                    focusBackgroundColor: '{primary.50}',
                    disabledBackgroundColor: '{neutralHover}',
                    errorTextColor: '{error}',
                    placeholderTextColor: '{neutralText}',
                    textColor: '{primary.900}',
                    labelTextColor: '{primaryDark.500}',
                    iconColor: '{primary.500}',
                    requiredAsteriskColor: '{error}',
                    focusBoxShadow: '0 0 4px 2px {primary.500}'
                    
                }
            },
            dark: {
                primary: {
                    color: '{primaryDark.500}',
                    inverseColor: '{primaryDark.500}',
                    hoverColor: '{primary.500}',
                    activeColor: '{primaryDark.500}'
                },
                highlight: {
                    background: 'rgba(250, 250, 250, .16)',
                    focusBackground: 'rgba(250, 250, 250, .24)',
                    color: 'rgba(255,255,255,.87)',
                    focusColor: 'rgba(255,255,255,.87)'
                },
                formField: {
                    hoverBorderColor: '{primaryDark.500}'
                }
            }
        }
    }
});

export { GsrpiPreset };