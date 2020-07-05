// In App.js in a new project

import * as React from 'react';
import { NavigationContainer, RouteProp, useNavigation } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { ColectivosScreen } from '../screens/colectivos-screen';
import { View, Text } from 'react-native';
import { CallesScreen } from '../screens/calles-screen';

// Esto puede ir a un refactor general
export type CommonNavigationProp<X extends Record<string, object | undefined>, Y extends keyof X> = {
    navigation: StackNavigationProp<X, Y>;
    route: RouteProp<X, Y>;
};

export type BasicNavigationList = {
    Colectivos: { calleId?: string; interseccionId?: string };
    Calles: { colectivoId?: string; calleId?: string };
};

export type ColectivosNavigation = StackNavigationProp<BasicNavigationList, 'Colectivos'>;
export type CallesNavigation = StackNavigationProp<BasicNavigationList, 'Calles'>;

export type ColectivosRouteProp = RouteProp<BasicNavigationList, 'Colectivos'>;
export type CallesRouteProp = RouteProp<BasicNavigationList, 'Calles'>;

export type ColectivosProps = CommonNavigationProp<BasicNavigationList, 'Colectivos'>;
export type CallesProps = CommonNavigationProp<BasicNavigationList, 'Calles'>;

const Stack = createStackNavigator<BasicNavigationList>();

export function BasicNavigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Colectivos">
                <Stack.Screen name="Colectivos" component={ColectivosScreen} />
                <Stack.Screen name="Calles" component={CallesScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
