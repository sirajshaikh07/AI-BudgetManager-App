/* Fix React 19 JSX component type compatibility with Expo class-based components */
import type { LinearGradient as LG } from 'expo-linear-gradient';

declare module 'expo-linear-gradient' {
    import { Component } from 'react';
    import type { ViewProps } from 'react-native';

    interface LinearGradientProps extends ViewProps {
        colors: readonly string[];
        start?: { x: number; y: number } | readonly [number, number];
        end?: { x: number; y: number } | readonly [number, number];
        locations?: readonly number[];
    }

    export class LinearGradient extends Component<LinearGradientProps> { }
}
