import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { getColectivos, Colectivo } from '../data/db'
import { ColectivosNavigation } from '../navigation/stack';
import { ColectivoItem } from '../components/colectivo-item';
import { Container } from '../design-system';
import { useNavigation } from '@react-navigation/native';

export function ColectivosScreen() { 
    const navigation = useNavigation<ColectivosNavigation>();
    const [colectivos, setcolectivos] = useState(getColectivos());

    const keyExtractor = (item: any, index: number) => index.toString()
    
    const navigateTo = (item: Colectivo) => navigation.navigate('Calles', { colectivoId: item.idLinea })

    return (
        <Container>
            <FlatList
                keyExtractor={keyExtractor}
                data={colectivos}
                renderItem={({ item }) => (
                    <ColectivoItem colectivo={item} onPress={navigateTo}/>
                )}
            />
        </Container>
    );
}

