import React from 'react';
import { Calle } from '../data/db';
import { ListItem } from 'react-native-elements';

export function CalleItem({ calle, onPress }: { calle: Calle; onPress: any }) {
    return (
        <ListItem
            key={calle.id}
            title={calle.nombre}
            subtitle={calle.ciudad}
            bottomDivider
            chevron
            onPress={() => onPress(calle)}
        />
    );
}
