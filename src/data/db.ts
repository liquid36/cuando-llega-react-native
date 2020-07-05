import { db as data } from './data'

export interface Colectivo {
    value: string;
    idLinea: string;
    identidad: string;
    name: string;
    bandera: Set<string>;
}

export interface Calle {
    id: string;
    nombre: string;
    ciudad: string;
}

export function getColectivos(calleId?: string, interseccionId?: string) {
    const colectivosMap: { [key: string]: Colectivo } = {};
    
    data.forEach((element: any) => {
        if (calleId && interseccionId) {
            if (calleId !== element.calle_id  || interseccionId !== element.interseccion_id) {
                return;
            }
        }
        const mapping = colectivosMap[element.colectivo_idLinea];
        if (mapping) {
            mapping.bandera.add(element.bandera);
            return;
        }
        colectivosMap[element.colectivo_idLinea] = {
            value: element.colectivo_value,
            idLinea: element.colectivo_idLinea,
            identidad: element.colectivo_identidad,
            name: element.colectivo_name,
            bandera: new Set<string>([element.bandera])
        };
    
    });
    return Object.values(colectivosMap)
}

export interface GetCalleParams {
    colectivoId?: string,
    calleId?: string
}
export function getCalles({ colectivoId , calleId }: GetCalleParams = {}) {
    const callesMap: { [key: string]: Calle } = {};
    
    data.forEach((element: any) => {
        const { colectivo_idLinea, calle_id } = element;
        if (colectivoId && colectivo_idLinea !== colectivoId) {
            return;
        }
        if (calleId && calle_id !== calleId) {
            return;
        }

        const prefix = !calleId ? 'calle' : 'interseccion';
        const idKey = prefix + '_id';
        const nameKey = prefix + '_name';
        const ciudadKey = prefix + '_city';
 

        const mapping = callesMap[element[idKey]]; 
        if (mapping) { 
            return;
        }
        callesMap[element[idKey]] = { 
            id: element[idKey],
            nombre: element[nameKey],
            ciudad: element[ciudadKey]
        };
    
    }); 
    return Object.values(callesMap).sort((a, b) => {
        return a.nombre.localeCompare(b.nombre);
    });
}
