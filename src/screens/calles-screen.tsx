import React, { useState } from 'react';
import { FlatList } from 'react-native'; 
import { getCalles, Calle } from '../data/db'
import { CallesNavigation, CallesRouteProp } from '../navigation/stack';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Container } from '../design-system';
import { CalleItem } from '../components/calle-item';
import { useHeaderTitle } from '../navigation/use-header-title';
 

export function CallesScreen() {
    const navigation = useNavigation<CallesNavigation>();
    const route = useRoute<CallesRouteProp>();
    const { colectivoId , calleId } = route.params; 
    const [calles, setCalles] = useState(getCalles({ colectivoId, calleId }));
    
    const [title, setTitle ] = useHeaderTitle(!calleId ? 'Calles': 'Intersecciones' );

    const keyExtractor = (item: any, index: number) => index.toString()

    const doNavigation = (calle: Calle) => {
        if (!calleId) {
            navigation.push('Calles', { colectivoId, calleId: calle.id });
        } else {
            console.log('[TODO] ver paradas')
        }
    }

    const renderItem = ({ item }: { item: Calle }) => (
        <CalleItem
            calle={item}
            onPress={doNavigation}
        />
    )

    return (
        <Container>  
            <FlatList
                keyExtractor={keyExtractor}
                data={calles}
                renderItem={renderItem}
            /> 
        </Container>
    );
}
