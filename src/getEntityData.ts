
import { WikiEntity } from 'wiki-entity';
import { Entity, EntityTypeValue, EntityData, IPlainObject } from 'entitizer.models';

export function getEntityData(wikiEntity: WikiEntity, type: EntityTypeValue): EntityData {
    if (!wikiEntity.claims || !type) {
        return null;
    }
    const types = ENTITY_DATA_PROPS[type];
    if (!types) {
        return null;
    }
    const data: EntityData = {};

    for (var key in wikiEntity.claims) {
        if (~types.indexOf(key) && wikiEntity.claims[key].values.length) {
            data[key] = [];
            wikiEntity.claims[key].values.forEach(value => {
                const v: { value: string, label?: string } = { value: value.value_string || value.value.toString() };
                if (PROP_PARSERS[key]) {
                    v.value = PROP_PARSERS[key](v.value);
                }
                if (value.label && v.value !== value.label) {
                    v.label = value.label;
                }
                data[key].push(v);
            });
        }
    }

    return data;
}

const ENTITY_DATA_PROPS: IPlainObject<string[]> = {
    // Person
    H: [
        // instance of
        'P31',
        // sex or gender
        'P21',
        // date of birth
        'P569',
        // occupation
        'P106',
        // country of citizenship
        'P27',
        // family name
        'P734',
        // father
        'P22',
        // mother
        'P25',
        // spouse
        'P26',
        // native language
        'P103',
        // position held
        'P39',
        // nickname
        'P1449',
        // IMDb ID
        'P345',
        // ISNI
        'P213',
        // Twitter username
        'P2002',
        // Instagram username
        'P2003',
        // Facebook ID
        'P2013',
        // YouTube channel ID
        'P2397',
        // date of death
        'P570',
        // place of death
        'P20',
        // official website
        'P856'
    ]
};

const PROP_PARSERS = {
    // P570: dateParser,
    // P569: dateParser
};

// function dateParser(date: string): string {
//     if (date[0] === '+') {
//         date = date.substr(1);
//     }

//     const i = date.indexOf('T');
//     if (i > 0) {
//         date = date.substr(0, i);
//     }

//     return date;
// }
