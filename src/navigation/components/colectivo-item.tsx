import React from 'react';
import { Colectivo } from "../../data/db";
import { ListItem, Badge } from "react-native-elements";
import { View } from "react-native";
import { BanderaBadge } from '../../design-system';


export function ColectivoItem({ colectivo, onPress }: { colectivo: Colectivo, onPress?: any }) {
    const banderas = [...colectivo.bandera];
    return (
        <ListItem
            key={colectivo.idLinea}
            title={colectivo.name}
            bottomDivider 
            rightElement={(
                <View style={{ flexDirection: 'row' }}>
                    {banderas.map((bandera) => <BanderaBadge key={bandera} bandera={bandera} />)}
                </View>
            )}
            chevron
            subtitle={banderas.join(', ')}
            onPress={() => onPress(colectivo)}
        />
    )
}