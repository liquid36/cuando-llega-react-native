import React from 'react'; 
import { Badge } from 'react-native-elements';

export function BanderaBadge (props: { bandera: string }) {
    const { bandera } = props;
    const bgColor: string = banderaColorMap[bandera] || 'lightgrey';
    return <Badge badgeStyle={{ backgroundColor: bgColor, width: '20px', height: '20px', borderRadius: '50%' }}></Badge>
}

const banderaColorMap: any = {
    'ROJA': 'red',
    'VERDE': 'green',
    'NEGRA': 'black'
}